"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { LightSphere } from "@/components/layout/AmbientBackground";
import { playSound, preloadSounds } from "@/lib/sfx";

const DROPLET_COLORS = ["#ffffff", "#a7c7ff", "#e3b8ff", "#9fe8ff", "#ffd6f2", "#c9b8ff"];
const REFORM_MS = 1500;

/**
 * Gab's portrait as a floating bubble.
 * - Bobs gently (CSS, transform-only) with a shadow that breathes underneath.
 * - Drifts a little toward a fine pointer.
 * - Click / Enter / Space pops it: rim flash + iridescent droplets, then a fresh
 *   bubble re-forms. Reduced motion: no bob, no drift; pop is a simple fade.
 */
export function HeroPortrait({ variant = "hero" }: { variant?: "hero" | "avatar" }) {
  const isAvatar = variant === "avatar";
  // Both the desktop hero and the phone avatar show Gab's face in the bubble.
  const bubbleSrc = profile.photo;
  const reduce = useReducedMotion();
  const [popped, setPopped] = useState(false);
  const [generation, setGeneration] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const x = useSpring(0, { stiffness: 120, damping: 16 });
  const y = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pop = () => {
    if (popped) return;
    setPopped(true);
    // Slight pitch variation so repeat pops don't sound copy-pasted
    void playSound("pop", { volume: 0.55, rate: 0.94 + Math.random() * 0.14 });
    if ("vibrate" in navigator) navigator.vibrate?.([8, 30, 8]);
    timer.current = window.setTimeout(() => {
      setGeneration((g) => g + 1);
      setPopped(false);
      void playSound("reform", { volume: 0.35 });
    }, REFORM_MS);
  };

  return (
    <figure
      className={isAvatar ? "relative w-[88px] shrink-0" : "relative w-48 shrink-0 sm:w-60 lg:w-[300px] xl:w-[340px]"}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 18);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 14);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onPointerEnter={preloadSounds}
      onFocus={preloadSounds}
    >
      {/* Dotted light fields behind the bubble */}
      {!isAvatar && (
        <>
          <LightSphere tone="blue" className="-top-6 -right-10 size-32 sm:size-40 lg:size-52" />
          <LightSphere tone="lavender" className="-bottom-4 -left-10 size-24 sm:size-32 lg:size-40" />
        </>
      )}

      <div className={reduce ? undefined : isAvatar ? "bubble-bob-sm" : "bubble-bob"}>
        <motion.div style={reduce ? undefined : { x, y }}>
          <button
            type="button"
            onClick={pop}
            aria-label={`${profile.name}. Click to pop the bubble.`}
            className="group relative block aspect-square w-full cursor-pointer rounded-full focus-visible:outline-offset-4"
          >
            <AnimatePresence initial={false}>
              {!popped && (
                <motion.span
                  key={generation}
                  className="absolute inset-0 block"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.14 }}
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : {
                          scale: { type: "spring", stiffness: 160, damping: 13 },
                          opacity: { duration: 0.18 },
                        }
                  }
                  whileHover={reduce ? undefined : { scale: 1.025 }}
                  whileTap={reduce ? undefined : { scaleX: 1.06, scaleY: 0.94 }}
                >
                  {bubbleSrc ? (
                    <Image
                      src={bubbleSrc}
                      alt=""
                      fill
                      priority
                      sizes={isAvatar ? "88px" : "(min-width: 1280px) 340px, (min-width: 1024px) 300px, 240px"}
                      className="pointer-events-none rounded-full object-cover select-none"
                      draggable={false}
                    />
                  ) : (
                    <BubblePlaceholder />
                  )}
                </motion.span>
              )}
            </AnimatePresence>

            {popped && !reduce && <PopBurst />}
          </button>
        </motion.div>
      </div>

      {!isAvatar && (
        <>
      {/* Soft shadow that breathes with the bob */}
      <div
        aria-hidden
        className={`mx-auto mt-3 h-4 w-3/5 rounded-[50%] bg-[radial-gradient(closest-side,rgba(79,98,200,0.28),transparent)] ${
          reduce ? "" : "bubble-shadow"
        } ${popped ? "opacity-0" : ""} transition-opacity duration-300`}
      />

      <figcaption className="glass glass-soft mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.75rem] font-medium whitespace-nowrap text-ink-2 sm:text-[0.78rem]">
        <MapPin className="size-3.5 text-accent-strong" aria-hidden />
        {profile.location}
      </figcaption>
        </>
      )}

      <span className="sr-only" aria-live="polite">
        {popped ? "Pop! The bubble will re-form in a moment." : ""}
      </span>
    </figure>
  );
}

/** Rim flash + iridescent droplets that fly out and fall. */
function PopBurst() {
  const droplets = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + (i % 3) * 0.12;
    // Distances in cqw (1cqw = 1% of the bubble's width; radius = 50cqw)
    const start = 46; // just inside the rim
    const reach = 62 + (i % 4) * 9; // beyond the rim
    return {
      fromX: Math.cos(angle) * start,
      fromY: Math.sin(angle) * start,
      toX: Math.cos(angle) * reach,
      toY: Math.sin(angle) * reach + 12, // a touch of gravity
      size: 5 + (i % 3) * 3,
      color: DROPLET_COLORS[i % DROPLET_COLORS.length],
      delay: (i % 5) * 0.012,
    };
  });

  return (
    <span aria-hidden className="@container pointer-events-none absolute inset-0">
      {/* Rim flash */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-white/90 shadow-[0_0_24px_rgba(169,155,255,0.6)]"
        initial={{ scale: 1, opacity: 0.95 }}
        animate={{ scale: 1.22, opacity: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      />
      {droplets.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: d.size,
            height: d.size,
            marginLeft: -d.size / 2,
            marginTop: -d.size / 2,
            background: d.color,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.8), 0 2px 8px rgba(120,110,240,0.35)",
          }}
          initial={{ x: `${d.fromX}cqw`, y: `${d.fromY}cqw`, opacity: 1, scale: 1 }}
          animate={{ x: `${d.toX}cqw`, y: `${d.toY}cqw`, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: d.delay }}
        />
      ))}
    </span>
  );
}

function BubblePlaceholder() {
  return (
    <span
      className="absolute inset-0 grid place-items-center rounded-full border border-white/80"
      style={{
        background:
          "radial-gradient(120% 90% at 30% 20%, #ffffff 0%, rgba(255,255,255,0) 50%), linear-gradient(160deg, #dbe8ff 0%, #e6e0ff 55%, #d3eeff 100%)",
      }}
    >
      <span className="bg-gradient-to-br from-[#1d4ed8] to-[#6ec8ff] bg-clip-text text-5xl font-semibold tracking-[-0.06em] text-transparent">
        {profile.initials}
      </span>
    </span>
  );
}
