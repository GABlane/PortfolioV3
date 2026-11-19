"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };
type TocGroup = { label: string; items: TocItem[] };

/** Sticky on-page navigation, grouped by chapter, that tracks the section being read. */
export function CaseStudyToc({ groups }: { groups: TocGroup[] }) {
  const ids = useMemo(() => groups.flatMap((g) => g.items.map((i) => i.id)), [groups]);
  const [active, setActive] = useState(ids[0] ?? "");
  const reduce = useReducedMotion();
  const idKey = ids.join("|");

  useEffect(() => {
    const order = idKey.split("|");
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = order.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    order.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [idKey]);

  return (
    <nav aria-label="Case study sections" className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-6">
        {groups.map((group, gi) => (
          <div key={group.label}>
            <p className="eyebrow mb-2 flex items-center gap-2">
              <span className="text-ink-3/70">{gi + 1}</span>
              {group.label}
            </p>
            <ol className="relative flex flex-col gap-0.5 border-l border-ink/[0.08]">
              {group.items.map((item) => {
                const isActive = item.id === active;
                return (
                  <li key={item.id} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="toc-indicator"
                        aria-hidden
                        className="absolute top-1 bottom-1 -left-px w-[2px] rounded-full bg-accent-strong"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "block py-1.5 pl-4 text-[0.88rem] transition-colors",
                        isActive ? "font-medium text-ink" : "text-ink-3 hover:text-ink",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  );
}
