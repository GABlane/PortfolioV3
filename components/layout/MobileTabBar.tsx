"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { LayoutGrid, Mail, Search } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import { openCommandMenu } from "@/components/layout/CommandMenu";
import { openChat } from "@/components/chat/ChatAssistant";
import { BrandMark } from "@/components/ui/BrandMark";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

type Tab =
  | { kind: "link"; id: string; label: string; section: string; icon: ReactNode }
  | { kind: "action"; id: string; label: string; icon: ReactNode; onSelect: () => void };

/**
 * Phone navigation: a floating frosted tab bar at the bottom (thumb-reachable),
 * in the spirit of app tab bars. Hidden from md up, where the top nav takes over.
 */
export function MobileTabBar({ chatEnabled = false }: { chatEnabled?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const reduce = useReducedMotion();

  const activeId = isHome
    ? active === "experience" || active === "expertise"
      ? "home"
      : active
    : pathname.startsWith("/projects")
      ? "projects"
      : "";

  const tabs: Tab[] = [
    { kind: "link", id: "home", label: "Home", section: "home", icon: <BrandMark size={26} /> },
    {
      kind: "link",
      id: "projects",
      label: "Projects",
      section: "projects",
      icon: <LayoutGrid className="size-[22px]" aria-hidden />,
    },
    {
      kind: "action",
      id: "search",
      label: "Search",
      icon: <Search className="size-[22px]" aria-hidden />,
      onSelect: openCommandMenu,
    },
    { kind: "link", id: "contact", label: "Contact", section: "contact", icon: <Mail className="size-[22px]" aria-hidden /> },
    {
      ...(chatEnabled
        ? { kind: "action" as const, onSelect: openChat, label: "Ask the AI assistant about Gab" }
        : { kind: "link" as const, section: "about", label: "About me" }),
      id: "about",
      icon: (
        <span className="relative block size-7 overflow-hidden rounded-full ring-2 ring-white/90">
          {profile.bubbleArt ? (
            <Image src={profile.bubbleArt} alt="" fill sizes="28px" className="object-cover" />
          ) : (
            <span className="grid h-full place-items-center bg-accent/15 text-[0.6rem] font-semibold text-accent-ink">
              {profile.initials}
            </span>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)] md:hidden">
      <nav aria-label="Tab bar" className="glass glass-strong pointer-events-auto w-full max-w-[420px] rounded-full p-1.5">
        <ul className="flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            const inner = (
              <>
                {isActive && (
                  <motion.span
                    layoutId="tab-lens"
                    className="glass-lens absolute inset-0 rounded-full"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={cn("relative z-10", isActive ? "text-accent-strong" : "text-ink-2")}>{tab.icon}</span>
              </>
            );
            const cls = "press relative grid h-12 w-full place-items-center rounded-full";
            return (
              <li key={tab.id} className="flex-1">
                {tab.kind === "link" ? (
                  <Link
                    href={isHome ? `#${tab.section}` : `/#${tab.section}`}
                    aria-label={tab.label}
                    aria-current={isActive ? (isHome ? "location" : "page") : undefined}
                    className={cls}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button type="button" onClick={tab.onSelect} aria-label={tab.label} className={cls}>
                    {inner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
