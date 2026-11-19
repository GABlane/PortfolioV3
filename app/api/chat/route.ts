import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";
import { chatConfig, isChatEnabled } from "@/lib/chat/config";
import { getSystemInstruction } from "@/lib/chat/knowledge";
import { checkLimits } from "@/lib/chat/rate-limit";
import { getCached, setCached } from "@/lib/chat/store";
import { isClearlyOffTopic, OFF_TOPIC_REPLY, OFF_TOPIC_SENTINEL } from "@/lib/chat/guard";

/**
 * POST /api/chat — a guarded wrapper around Gemini that answers questions about Gab
 * using only the portfolio's published content.
 *
 * Defences, in order:
 *  1. Configured?          503 if no GEMINI_API_KEY (key never leaves the server)
 *  2. Same-origin only     Origin / Sec-Fetch-Site checks + required custom header (blocks CSRF-style posts)
 *  3. Content-Type + size  application/json, body ≤ 16 KB, read with a hard cap
 *  4. Rate limits          per-visitor burst limit + site-wide daily budget (shared via Upstash when set)
 *  5. Validation           strict shape, role/length caps, control characters stripped
 *  6. Topic guard          obvious off-topic input refused before the model (free); the model
 *                          must answer anything else off-topic with a sentinel, swapped for a fixed reply
 *  7. Cache                identical first questions served from cache (no model call)
 *  8. Model call           system rules + grounded facts, temperature 0.4, output cap, 25 s timeout
 *  9. Response             streamed text, no-store, nosniff, noindex; generic errors; no content logged
 */

type ChatMessage = { role: "user" | "assistant"; content: string };

const BASE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

function error(status: number, message: string, extra?: Record<string, string>) {
  return Response.json({ error: message }, { status, headers: { ...BASE_HEADERS, ...extra } });
}

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) return null;

  const messages: ChatMessage[] = [];
  for (const m of raw.slice(-chatConfig.maxMessages)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const clean = content.replace(CONTROL_CHARS, "").trim().slice(0, chatConfig.maxCharsPerMessage);
    if (clean) messages.push({ role, content: clean });
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  if (messages.reduce((n, m) => n + m.content.length, 0) > chatConfig.maxTotalChars) return null;
  return messages;
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isSameOrigin(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== host) return false;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  return true;
}

async function readBody(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > chatConfig.maxBodyBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > chatConfig.maxBodyBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

function cacheKeyFor(question: string) {
  const normalized = question.toLowerCase().replace(/\s+/g, " ").replace(/[?!.\s]+$/, "").trim();
  return `chat:answer:${createHash("sha256").update(`${chatConfig.model}|${normalized}`).digest("hex").slice(0, 32)}`;
}

function textResponse(body: BodyInit, cache: "HIT" | "MISS" | "NONE", topic: "on" | "off" = "on") {
  return new Response(body, {
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
      "X-Cache": cache,
      "X-Chat-Topic": topic,
    },
  });
}

const offTopic = () => textResponse(OFF_TOPIC_REPLY, "NONE", "off");

export async function POST(request: Request) {
  if (!isChatEnabled()) return error(503, "The chat assistant isn't configured yet.");

  if (!isSameOrigin(request) || request.headers.get("x-portfolio-chat") !== "1") {
    return error(403, "Forbidden.");
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return error(415, "Unsupported content type.");
  }

  const raw = await readBody(request);
  if (raw === null) return error(413, "Message too long.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return error(400, "Invalid request.");
  }
  const messages = parseMessages(body);
  if (!messages) return error(400, "Invalid request.");

  // Layer 1: obvious off-topic input never reaches the model (and costs nothing)
  if (isClearlyOffTopic(messages[messages.length - 1].content)) return offTopic();

  const limit = await checkLimits(clientIp(request));
  if (!limit.ok) return error(limit.status, limit.message, { "Retry-After": String(limit.retryAfterSeconds) });

  // Cache only context-free first questions (e.g. the suggested prompts)
  const cacheable = messages.length === 1;
  const cacheKey = cacheable ? cacheKeyFor(messages[0].content) : null;
  if (cacheKey) {
    const hit = await getCached(cacheKey);
    if (hit) return textResponse(hit, "HIT");
  }

  const ai = new GoogleGenAI({ apiKey: chatConfig.apiKey });
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(chatConfig.requestTimeoutMs)]);

  let stream: AsyncGenerator<{ text?: string }>;
  try {
    stream = await ai.models.generateContentStream({
      model: chatConfig.model,
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.2,
        maxOutputTokens: chatConfig.maxOutputTokens,
        abortSignal: signal,
      },
    });
  } catch (err) {
    // Log the failure type only — never the visitor's messages
    console.error("[chat] model request failed:", err instanceof Error ? err.name : "unknown");
    return error(502, "The assistant couldn't respond right now. Please try again.");
  }

  // Layer 2: read the opening of the answer before sending anything. If the model
  // answered with the off-topic sentinel, stop it and send the fixed reply instead.
  const iterator = stream[Symbol.asyncIterator]();
  let head = "";
  let finished = false;
  try {
    while (head.trim().length < OFF_TOPIC_SENTINEL.length + 2) {
      const next = await iterator.next();
      if (next.done) {
        finished = true;
        break;
      }
      head += next.value.text ?? "";
    }
  } catch (err) {
    console.error("[chat] model stream failed:", err instanceof Error ? err.name : "unknown");
    return error(502, "The assistant couldn't respond right now. Please try again.");
  }

  if (head.trim().startsWith(OFF_TOPIC_SENTINEL) || head.includes(OFF_TOPIC_SENTINEL)) {
    await iterator.return?.(undefined);
    return offTopic();
  }

  const encoder = new TextEncoder();
  let full = head;
  let completed = false;

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (head) controller.enqueue(encoder.encode(head));
        if (!finished) {
          for (;;) {
            if (signal.aborted) break;
            const next = await iterator.next();
            if (next.done) break;
            const text = next.value.text ?? "";
            if (!text) continue;
            full += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        completed = !signal.aborted && full.trim().length > 0;
      } catch (err) {
        console.error("[chat] stream interrupted:", err instanceof Error ? err.name : "unknown");
        controller.enqueue(encoder.encode("\n\n(Sorry — the answer was cut off. Please try again.)"));
      } finally {
        controller.close();
        if (completed && cacheKey && !full.includes(OFF_TOPIC_SENTINEL)) {
          await setCached(cacheKey, full, chatConfig.cacheTtlSeconds);
        }
      }
    },
    cancel() {
      // Visitor closed the chat mid-answer; the abort signal stops the model call.
    },
  });

  return textResponse(out, "MISS");
}
