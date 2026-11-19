"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SPARK_COLORS = ["#4f8cff", "#6ec8ff", "#a99bff", "#ffffff", "#2563eb", "#cfefff"];

/**
 * Copy-email button with a small reward: the label morphs to a check and a
 * burst of glass sparks pops out. Short haptic tick on supporting devices.
 * Reduced motion: no burst, just the state change.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    setBurst((b) => b + 1);
    if ("vibrate" in navigator) navigator.vibrate?.(12);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        layout={!reduce}
        onClick={onCopy}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`fill-inset fill-interactive relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full px-4 text-[0.88rem] font-medium ${
          copied ? "text-emerald-700" : "text-ink-2 hover:text-ink"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "idle"}
            className="inline-flex items-center gap-2"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            {copied ? (
              <>
                <motion.span
                  className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white"
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 600, damping: 18 }}
                >
                  <Check className="size-3" strokeWidth={3.5} aria-hidden />
                </motion.span>
                Copied
              </>
            ) : (
              <>
                <Copy className="size-4" aria-hidden />
                Copy email
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Spark burst — decorative */}
      {!reduce && burst > 0 && <Sparks key={burst} />}

      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}

function Sparks() {
  const sparks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
    const distance = 34 + (i % 3) * 12;
    return {
      x: Math.cos(angle) * distance * 1.6,
      y: Math.sin(angle) * distance,
      size: 4 + (i % 3) * 2,
      color: SPARK_COLORS[i % SPARK_COLORS.length],
      delay: (i % 4) * 0.015,
    };
  });
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.7), 0 2px 6px rgba(37,99,235,0.35)",
          }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{ x: s.x, y: s.y, scale: [0.4, 1.2, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: s.delay }}
        />
      ))}
    </span>
  );
}
