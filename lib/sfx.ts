/**
 * Tiny sound-effect player (Web Audio, low latency).
 * - Sounds only ever play from a user action; no autoplay.
 * - Files are fetched on intent (hover/focus), decoded on first play.
 * - A per-visitor mute preference is kept in localStorage.
 * Sounds generated with ElevenLabs (eleven_text_to_sound_v3).
 */

const SOUNDS = {
  pop: "/sounds/bubble-pop.mp3",
  reform: "/sounds/bubble-reform.mp3",
} as const;

export type SoundName = keyof typeof SOUNDS;

const MUTE_KEY = "gab:sfx-muted";
const listeners = new Set<() => void>();

let ctx: AudioContext | null = null;
const raw = new Map<SoundName, Promise<ArrayBuffer | null>>();
const decoded = new Map<SoundName, Promise<AudioBuffer | null>>();

export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* storage unavailable — preference just won't persist */
  }
  listeners.forEach((fn) => fn());
}

export function subscribeMuted(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key === MUTE_KEY && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/** Fetch the files ahead of time (no AudioContext yet, so no autoplay warnings). */
export function preloadSounds() {
  (Object.keys(SOUNDS) as SoundName[]).forEach((name) => {
    if (!raw.has(name)) {
      raw.set(
        name,
        fetch(SOUNDS[name])
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .catch(() => null),
      );
    }
  });
}

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const AC =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function getBuffer(name: SoundName, context: AudioContext) {
  let buf = decoded.get(name);
  if (!buf) {
    preloadSounds();
    buf = raw.get(name)!.then((data) => (data ? context.decodeAudioData(data.slice(0)) : null)).catch(() => null);
    decoded.set(name, buf);
  }
  return buf;
}

export async function playSound(name: SoundName, { volume = 0.5, rate = 1 }: { volume?: number; rate?: number } = {}) {
  if (typeof window === "undefined" || isMuted()) return;
  const context = getContext();
  if (!context) return;
  if (context.state === "suspended") await context.resume().catch(() => undefined);
  const buffer = await getBuffer(name, context);
  if (!buffer) return;
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;
  const gain = context.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(context.destination);
  source.start();
}
