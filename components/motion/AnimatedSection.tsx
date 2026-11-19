"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: "div" | "li" | "section" | "article";
};

/** Gentle reveal when an element first scrolls into view. Runs once. */
export function Reveal({ children, className, delay = 0, y = 18, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
        y: { type: "spring", stiffness: 140, damping: 22, delay },
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggered entrance that plays on mount (used above the fold).
 * Note: no `filter` animation — a filtered ancestor becomes a backdrop root and
 * would stop child glass from blurring what is behind it.
 */
export function Entrance({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
        y: { type: "spring", stiffness: 120, damping: 20, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
