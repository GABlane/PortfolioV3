"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Sparkles, Square, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string; error?: boolean; offTopic?: boolean };

export const OPEN_CHAT_EVENT = "chat:open";
export function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

const SUGGESTIONS = [
  "What does Gab build?",
  "Tell me about BentaBuddy",
  "What's his professional experience?",
  "How can I contact him?",
];

const WELCOME: Msg = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm an AI assistant for Gab's portfolio. Ask me about his projects, skills, or experience — I answer using what's published on this site.",
};

const MAX_INPUT = 600;

/** Turns /projects/... paths, emails and URLs in an answer into links. */
function linkify(text: string): ReactNode[] {
  const pattern = /(\/projects\/[a-z0-9-]+|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/gi;
  return text.split(pattern).map((part, i) => {
    if (!part) return null;
    if (/^\/projects\/[a-z0-9-]+$/i.test(part)) {
      return (
        <Link key={i} href={part} className="font-medium text-accent-ink underline underline-offset-2">
          {part}
        </Link>
      );
    }
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-ink underline underline-offset-2">
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="font-medium text-accent-ink underline underline-offset-2">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Floating "Ask about Gab" assistant. Talks only to /api/chat (same origin);
 * the Gemini key never reaches the browser.
 */
export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const reduce = useReducedMotion();
  const abortRef = useRef<AbortController | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to whatever opened the chat (launcher, tab bar bubble, command menu)
    const target = returnFocusRef.current;
    (target && document.contains(target) ? target : launcherRef.current)?.focus();
  }, []);

  useEffect(() => {
    const onOpen = () => show();
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Keep the newest message in view
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, reduce]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (text: string) => {
    const question = text.trim().slice(0, MAX_INPUT);
    if (!question || streaming) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: question };
    const replyId = crypto.randomUUID();
    // Send only useful context: drop the welcome text, errors, and refused (off-topic) exchanges
    const kept: Msg[] = [];
    messages.forEach((m, i) => {
      if (m.id === "welcome" || m.error || m.offTopic) return;
      const reply = messages[i + 1];
      if (m.role === "user" && reply && (reply.error || reply.offTopic)) return;
      kept.push(m);
    });
    const history = [...kept, userMsg];
    setMessages((prev) => [...prev, userMsg, { id: replyId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const update = (content: string, error = false, offTopic = false) =>
      setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content, error, offTopic } : m)));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-portfolio-chat": "1" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        update(data?.error ?? "Something went wrong. Please try again.", true);
        return;
      }
      if (res.headers.get("X-Chat-Topic") === "off") {
        update(await res.text(), false, true);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        update(acc);
      }
      if (!acc.trim()) update("I couldn't come up with an answer — try rephrasing?", true);
    } catch (err) {
      if ((err as Error).name !== "AbortError") update("Connection lost. Please try again.", true);
      else setMessages((prev) => prev.filter((m) => !(m.id === replyId && !m.content)));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const last = messages[messages.length - 1];
  // Offer the suggestions at the start, and again after an off-topic refusal
  const showSuggestions = !streaming && (messages.length === 1 || Boolean(last?.offTopic));

  return (
    <>
      {/* Launcher — above the phone tab bar, bottom-right on larger screens */}
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={show}
            aria-label="Ask the AI assistant about Gab"
            aria-haspopup="dialog"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="glass glass-strong glass-interactive btn-glass press fixed right-6 bottom-6 z-[55] hidden h-12 items-center gap-2 rounded-full pr-4 pl-1.5 text-[0.9rem] font-medium text-ink md:flex"
          >
            <span className="relative size-9 overflow-hidden rounded-full ring-2 ring-white/90">
              {profile.bubbleArt ? (
                <Image src={profile.bubbleArt} alt="" fill sizes="36px" className="object-cover" />
              ) : null}
              <Sparkles className="absolute inset-0 m-auto size-4 text-accent-strong" aria-hidden />
            </span>
            Ask about Gab
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label="Ask about Gab — AI assistant"
            className="glass glass-strong fixed inset-x-3 bottom-[calc(max(env(safe-area-inset-bottom),12px)+72px)] z-[60] flex h-[min(560px,calc(100svh-180px))] flex-col overflow-hidden rounded-[28px] md:inset-x-auto md:right-6 md:bottom-6 md:h-[min(600px,calc(100svh-120px))] md:w-[400px]"
            style={{ transformOrigin: "bottom right" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3">
              <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white/90">
                {profile.bubbleArt && <Image src={profile.bubbleArt} alt="" fill sizes="36px" className="object-cover" />}
                <Sparkles className="relative size-4 text-accent-strong" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">Ask about Gab</p>
                <p className="truncate text-[0.74rem] text-ink-3">AI assistant · answers from this portfolio</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close assistant"
                className="fill-inset fill-interactive press grid size-9 place-items-center rounded-full text-ink-2"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {/* Conversation */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-busy={streaming}
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <p
                    className={cn(
                      "max-w-[85%] rounded-[20px] px-3.5 py-2.5 text-[0.92rem] leading-relaxed whitespace-pre-wrap",
                      m.role === "user"
                        ? "rounded-br-md bg-[linear-gradient(180deg,#2f6ff0,#1d4ed8)] text-white"
                        : m.error
                          ? "rounded-bl-md border border-amber-300/70 bg-amber-50/80 text-amber-900"
                          : "fill-inset rounded-bl-md text-ink",
                    )}
                  >
                    {m.content ? (
                      m.role === "assistant" && !m.error ? linkify(m.content) : m.content
                    ) : (
                      <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="size-1.5 animate-pulse rounded-full bg-accent/60"
                            style={{ animationDelay: `${d * 150}ms` }}
                          />
                        ))}
                      </span>
                    )}
                  </p>
                </div>
              ))}

              {showSuggestions && (
                <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Suggested questions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="fill-inset fill-interactive press rounded-full px-3 py-1.5 text-[0.82rem] font-medium text-ink-2"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-ink/[0.07] p-3"
            >
              <div className="fill-inset flex items-end gap-2 rounded-[22px] p-1.5 pl-3.5">
                <label htmlFor="chat-input" className="sr-only">
                  Ask a question about Gab
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_INPUT}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  placeholder="Ask about projects, skills, experience…"
                  className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-[0.92rem] text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
                />
                {streaming ? (
                  <button
                    type="button"
                    onClick={() => abortRef.current?.abort()}
                    aria-label="Stop answering"
                    className="press grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white"
                  >
                    <Square className="size-3.5" fill="currentColor" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="btn-primary press grid size-9 shrink-0 place-items-center rounded-full disabled:opacity-40"
                  >
                    <ArrowUp className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-center text-[0.68rem] text-ink-3">
                AI can make mistakes. For anything important, email{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-2">
                  Gab
                </a>
                .
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
