"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";
import { navItems, profile, resumeLink } from "@/data/profile";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { openCommandMenu, useShortcutLabel } from "@/components/layout/CommandMenu";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";

/** HIG: bars recede while scrolling down and return on scroll up. */
function useMinimizeOnScroll(start = 260) {
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (y < start) setMinimized(false);
        else if (delta > 6) setMinimized(true);
        else if (delta < -6) setMinimized(false);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [start]);
  return minimized;
}


function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);
  return scrolled;
}

export function GlassNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const scrolled = useScrolled();
  const reduce = useReducedMotion();
  const shortcut = useShortcutLabel();
  const minimizedByScroll = useMinimizeOnScroll();
  const [navEngaged, setNavEngaged] = useState(false);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const activeId = isHome ? active : pathname.startsWith("/projects") ? "projects" : "";
  // Collapse to the current section while reading; any hover or focus restores it.
  const collapsed = minimizedByScroll && !navEngaged && activeId !== "";



  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Scroll-edge frost: content softens as it slides beneath the floating nav */}
      <div
        aria-hidden
        className={cn(
          "header-frost pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-500",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 transition-[padding] duration-500 ease-[var(--ease-out)] sm:px-6",
          scrolled ? "pt-2.5" : "pt-4 sm:pt-5",
        )}
      >
        {/* Monogram */}
        <Link
          href={isHome ? "#home" : "/"}
          className={cn(
            "glass glass-interactive btn-glass press pointer-events-auto flex shrink-0 items-center gap-2.5 rounded-full pr-4 pl-2",
            scrolled ? "glass-strong h-11" : "h-12",
          )}
          aria-label={`${profile.name} — home`}
        >
          <BrandMark size={32} priority />
          <span className="text-[0.92rem] font-semibold tracking-[-0.02em] text-ink">{profile.preferredName}</span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          onPointerEnter={() => setNavEngaged(true)}
          onPointerLeave={() => setNavEngaged(false)}
          onFocus={() => setNavEngaged(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setNavEngaged(false);
          }}
          data-collapsed={collapsed || undefined}
          className={cn(
            "glass pointer-events-auto hidden rounded-full p-1 transition-[background-color,box-shadow] duration-500 md:block",
            scrolled && "glass-strong",
          )}
        >
          <ul className="flex items-center">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "relative overflow-hidden rounded-full transition-[max-width,opacity] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none",
                    collapsed && !isActive ? "max-w-0 opacity-0" : "max-w-40 opacity-100",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-lens"
                      className="glass-lens absolute inset-0 rounded-full"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <a
                    href={hrefFor(item.id)}
                    aria-current={isActive ? (isHome ? "location" : "page") : undefined}
                    className={cn(
                      "relative z-10 flex items-center rounded-full px-3.5 text-[0.88rem] font-medium tracking-[-0.01em] whitespace-nowrap transition-[color,height] duration-300 lg:px-4",
                      scrolled ? "h-9" : "h-10",
                      isActive ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop utilities */}
        <div className="pointer-events-auto hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openCommandMenu}
            aria-label={`Search and jump (${shortcut})`}
            aria-keyshortcuts="Meta+K Control+K"
            className={cn(
              "glass press glass-interactive btn-glass flex items-center gap-2 rounded-full pr-2 pl-3.5 text-[0.85rem] text-ink-2 hover:text-ink",
              scrolled ? "glass-strong h-11" : "h-12",
            )}
          >
            <Search className="size-4" aria-hidden />
            <kbd className="fill-inset rounded-full px-2 py-0.5 font-mono text-[0.7rem] text-ink-3">{shortcut}</kbd>
          </button>
          <div
            role="group"
            aria-label="Profiles"
            className={cn(
              "glass flex items-center gap-0.5 rounded-full p-1 transition-[height] duration-500",
              scrolled ? "glass-strong h-11" : "h-12",
            )}
          >
            {[
              { href: profile.social.github, label: "GitHub profile", icon: <GitHubIcon className="size-[18px]" /> },
              { href: profile.social.linkedin, label: "LinkedIn profile", icon: <LinkedInIcon className="size-[17px]" /> },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.label} (opens in a new tab)`}
                className="press grid aspect-square h-full place-items-center rounded-full text-ink-2 transition-colors hover:bg-white/60 hover:text-ink"
              >
                {l.icon}
              </a>
            ))}
          </div>
          <Link
            href={resumeLink.href}
            className={cn(
              "glass glass-interactive btn-glass press flex items-center gap-1.5 rounded-full px-4 text-[0.88rem] font-medium text-ink",
              scrolled ? "glass-strong h-11" : "h-12",
            )}
          >
            <FileText className="size-4 text-ink-2" aria-hidden />
            Resume
          </Link>
        </div>

        {/* Phones: profile links up top, like an app's top bar (navigation lives in the bottom tab bar) */}
        <div
          role="group"
          aria-label="Profiles"
          className={cn(
            "glass pointer-events-auto flex items-center gap-0.5 rounded-full p-1 md:hidden",
            scrolled ? "glass-strong h-11" : "h-12",
          )}
        >
          {[
            { href: profile.social.github, label: "GitHub profile", icon: <GitHubIcon className="size-[18px]" /> },
            { href: profile.social.linkedin, label: "LinkedIn profile", icon: <LinkedInIcon className="size-[17px]" /> },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${l.label} (opens in a new tab)`}
              className="press grid aspect-square h-full place-items-center rounded-full text-ink-2 active:bg-white/60"
            >
              {l.icon}
            </a>
          ))}
        </div>

        {/* Tablet: utilities collapse into the md nav; show a compact resume link */}
        <Link
          href={resumeLink.href}
          className={cn(
            "glass glass-interactive btn-glass press pointer-events-auto hidden items-center gap-1.5 rounded-full px-4 text-[0.88rem] font-medium text-ink md:flex lg:hidden",
            scrolled ? "glass-strong h-11" : "h-12",
          )}
        >
          <FileText className="size-4 text-ink-2" aria-hidden />
          Resume
        </Link>
      </div>

    </header>
  );
}
