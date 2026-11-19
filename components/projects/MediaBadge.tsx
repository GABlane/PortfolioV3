import type { MediaKind } from "@/data/types";
import { cn } from "@/lib/utils";

const labels: Record<MediaKind, string> = {
  screenshot: "Screenshot",
  "demo-capture": "Demo capture",
  "pitch-deck": "From pitch deck",
  illustration: "Illustration",
};

export function MediaBadge({ kind, dark, className }: { kind: MediaKind; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.08em] uppercase",
        dark ? "glass-dark text-white/80" : "glass glass-strong text-ink-2",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", kind === "illustration" ? "bg-[#a99bff]" : "bg-accent")} />
      {labels[kind]}
    </span>
  );
}
