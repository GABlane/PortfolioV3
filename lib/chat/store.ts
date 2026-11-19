import "server-only";

/**
 * Tiny key-value store for rate limits and the response cache.
 *
 * - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set (e.g. Upstash via the
 *   Vercel Marketplace), counts and cache entries are shared across all serverless
 *   instances — a real global limit.
 * - Without them, it falls back to per-instance memory: still throttles bursts in
 *   dev and on a single instance, but resets on cold starts.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
export const usingSharedStore = Boolean(REDIS_URL && REDIS_TOKEN);

type Entry = { value: string; expiresAt: number };
const memory = new Map<string, Entry>();
const MEMORY_MAX_KEYS = 5000;

function memoryGet(key: string): string | null {
  const e = memory.get(key);
  if (!e) return null;
  if (Date.now() >= e.expiresAt) {
    memory.delete(key);
    return null;
  }
  // refresh LRU position
  memory.delete(key);
  memory.set(key, e);
  return e.value;
}

function memorySet(key: string, value: string, ttlSeconds: number) {
  memory.delete(key);
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  while (memory.size > MEMORY_MAX_KEYS) {
    const oldest = memory.keys().next().value;
    if (oldest === undefined) break;
    memory.delete(oldest);
  }
}

async function redis(commands: (string | number)[][]): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown; error?: string }[];
    return data.map((d) => d.result ?? null);
  } catch {
    return null; // store unavailable → callers fall back to memory
  }
}

/** Increment a fixed-window counter and return the new count. */
export async function incrementCounter(key: string, windowSeconds: number): Promise<number> {
  if (usingSharedStore) {
    const out = await redis([
      ["SET", key, 0, "EX", windowSeconds, "NX"],
      ["INCR", key],
    ]);
    const n = out?.[1];
    if (typeof n === "number") return n;
  }
  const current = Number(memoryGet(key) ?? "0") + 1;
  const existing = memory.get(key);
  memorySet(key, String(current), existing ? Math.max(1, Math.ceil((existing.expiresAt - Date.now()) / 1000)) : windowSeconds);
  return current;
}

export async function getCached(key: string): Promise<string | null> {
  if (usingSharedStore) {
    const out = await redis([["GET", key]]);
    const v = out?.[0];
    if (typeof v === "string") return v;
  }
  return memoryGet(key);
}

export async function setCached(key: string, value: string, ttlSeconds: number): Promise<void> {
  memorySet(key, value, ttlSeconds);
  if (usingSharedStore) await redis([["SET", key, value, "EX", ttlSeconds]]);
}
