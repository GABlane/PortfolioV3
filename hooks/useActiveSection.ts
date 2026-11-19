"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/data/profile";

const SECTION_IDS = navItems.map((n) => n.id);

/** Tracks which home-page section is in the reading band. Shared by the navbar and tab bar. */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    if (!enabled) return;
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // The section nearest the top among those crossing the focus band
        const ordered = SECTION_IDS.filter((id) => visible.has(id));
        if (ordered.length > 0) setActive(ordered[0]);
      },
      { rootMargin: "-38% 0px -55% 0px", threshold: [0, 0.01] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}
