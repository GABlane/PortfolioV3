"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, subscribeMuted } from "@/lib/sfx";

/** Lets visitors turn the site's sound effects on or off (remembered per browser). */
export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-pressed={!muted}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full text-ink-3 transition-colors hover:text-ink"
    >
      {muted ? <VolumeX className="size-3.5" aria-hidden /> : <Volume2 className="size-3.5" aria-hidden />}
      Sound effects: {muted ? "off" : "on"}
    </button>
  );
}
