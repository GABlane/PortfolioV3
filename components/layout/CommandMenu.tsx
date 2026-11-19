"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, CornerDownLeft, FileText, FolderGit2, Gamepad2, Hash, Mail, Search, Sparkles } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  group: "Sections" | "Case studies" | "Links";
  label: string;
  hint?: string;
  href: string;
  icon: "section" | "project" | "github" | "linkedin" | "mail" | "resume" | "playground" | "ai";
};

const OPEN_EVENT = "command-menu:open";

/** Opens the command menu from anywhere (e.g. the navbar trigger). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const subscribeNoop = () => () => {};
/** "⌘K" on Apple platforms, "Ctrl K" elsewhere — without a hydration mismatch. */
export function useShortcutLabel() {
  return useSyncExternalStore(
    subscribeNoop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    () => "⌘K",
  );
}

function ItemIcon({ icon }: { icon: CommandItem["icon"] }) {
  const cls = "size-4";
  switch (icon) {
    case "section":
      return <Hash className={cls} aria-hidden />;
    case "project":
      return <FolderGit2 className={cls} aria-hidden />;
    case "github":
      return <GitHubIcon className={cls} />;
    case "linkedin":
      return <LinkedInIcon className={cls} />;
    case "mail":
      return <Mail className={cls} aria-hidden />;
    case "resume":
      return <FileText className={cls} aria-hidden />;
    case "playground":
      return <Gamepad2 className={cls} aria-hidden />;
    case "ai":
      return <Sparkles className={cls} aria-hidden />;
  }
}

/**
 * Spotlight-style command menu (⌘K / Ctrl K). A frosted dialog with a combobox
 * input and a listbox of results; fully keyboard operable.
 */
export function CommandMenu({ items }: { items: CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const uid = useId();
  const listId = `${uid}-list`;

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return items;
    return items.filter((item) => {
      const hay = `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [items, query]);

  const show = useCallback(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    restoreFocus.current?.focus?.();
  }, []);

  // Global shortcut + programmatic open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, show, close]);

  // Focus the input and lock page scroll while open
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the active option in view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const run = (item: CommandItem) => {
    setOpen(false);
    const href = item.href;
    if (href === "action:chat") {
      window.dispatchEvent(new Event("chat:open"));
      return;
    }
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      restoreFocus.current?.focus?.();
      return;
    }
    if (href.startsWith("mailto:")) {
      window.location.href = href;
      return;
    }
    if (href.startsWith("/#") && pathname === "/") {
      const target = document.getElementById(href.slice(2));
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", href);
      return;
    }
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) run(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  // Group results while keeping a flat index for keyboard navigation
  const groups: { name: CommandItem["group"]; entries: { item: CommandItem; index: number }[] }[] = [];
  results.forEach((item, index) => {
    const g = groups.find((x) => x.name === item.group);
    if (g) g.entries.push({ item, index });
    else groups.push({ name: item.group, entries: [{ item, index }] });
  });
  const activeId = results[active] ? `${uid}-opt-${results[active].id}` : undefined;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
          <motion.button
            type="button"
            aria-label="Close command menu"
            tabIndex={-1}
            className="absolute inset-0 bg-[rgba(236,242,255,0.35)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="glass glass-strong relative w-full max-w-[600px] overflow-hidden rounded-[28px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <div className="flex items-center gap-3 border-b border-ink/[0.07] px-5">
              <Search className="size-[18px] shrink-0 text-ink-3" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                aria-label="Search sections, case studies, and links"
                placeholder="Jump to a section, project, or link…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                className="h-14 w-full bg-transparent text-[1rem] text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
              />
              <kbd className="fill-inset hidden shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[0.7rem] text-ink-3 sm:block">
                esc
              </kbd>
            </div>

            <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="max-h-[min(420px,55vh)] overflow-y-auto p-2">
              {results.length === 0 && (
                <li role="presentation" className="px-4 py-10 text-center text-sm text-ink-3">
                  No matches for “{query}”.
                </li>
              )}
              {groups.map((group) => (
                <li key={group.name} role="presentation">
                  <p role="presentation" className="eyebrow px-3 pt-3 pb-1.5 !text-[0.64rem]">
                    {group.name}
                  </p>
                  <ul role="group" aria-label={group.name}>
                    {group.entries.map(({ item, index }) => {
                      const isActive = index === active;
                      const external = item.href.startsWith("http");
                      return (
                        <li
                          key={item.id}
                          id={`${uid}-opt-${item.id}`}
                          role="option"
                          aria-selected={isActive}
                          data-index={index}
                          onMouseMove={() => setActive(index)}
                          onClick={() => run(item)}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-3 rounded-[16px] px-3 py-2 text-[0.94rem]",
                            isActive ? "glass-lens text-ink" : "text-ink-2",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-[10px]",
                              isActive ? "text-accent-strong" : "fill-inset text-ink-3",
                            )}
                          >
                            <ItemIcon icon={item.icon} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium tracking-[-0.01em]">{item.label}</span>
                            {item.hint && <span className="block truncate text-[0.78rem] text-ink-3">{item.hint}</span>}
                          </span>
                          {external ? (
                            <ArrowUpRight className="size-4 shrink-0 text-ink-3" aria-hidden />
                          ) : (
                            isActive && <CornerDownLeft className="size-4 shrink-0 text-ink-3" aria-hidden />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 border-t border-ink/[0.07] px-5 py-2.5 font-mono text-[0.68rem] text-ink-3">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span className="ml-auto">esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
