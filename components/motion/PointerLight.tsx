"use client";

import { useEffect } from "react";

/**
 * Lets the glass catch the light: sets --mx/--my on the hovered `.glass-interactive`
 * surface so its rim and sheen brighten near the cursor.
 *
 * One passive listener for the whole page, at most one update per frame, and it only
 * runs on fine-pointer devices with motion allowed. Touch devices pay nothing.
 */
export function PointerLight() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let active: HTMLElement | null = null;
    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTarget: EventTarget | null = null;

    const clear = () => {
      if (!active) return;
      active.style.removeProperty("--mx");
      active.style.removeProperty("--my");
      active = null;
    };

    const apply = () => {
      frame = 0;
      const target =
        lastTarget instanceof Element ? lastTarget.closest<HTMLElement>(".glass-interactive") : null;
      if (active && active !== target) clear();
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${lastX - rect.left}px`);
      target.style.setProperty("--my", `${lastY - rect.top}px`);
      active = target;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTarget = event.target;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", clear);
    window.addEventListener("blur", clear);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
      clear();
    };
  }, []);

  return null;
}
