import Image, { type StaticImageData } from "next/image";
import { Check, Clock, MapPin, MessageCircle, Navigation, Sparkles } from "lucide-react";
import type { MediaKind, Project } from "@/data/types";
import { cn } from "@/lib/utils";
import { MediaBadge } from "./MediaBadge";

type ProjectPreviewProps = {
  project: Project;
  size?: "card" | "hero";
  priority?: boolean;
  className?: string;
  /** Hide the media-type badge (e.g. in tiny grid tiles; the case study still shows it). */
  hideBadge?: boolean;
};

const previewKind: Record<Project["preview"], MediaKind> = {
  bentabuddy: "illustration",
  freshly: "screenshot",
  eelio: "pitch-deck",
  smartvault: "demo-capture",
  freshguide: "illustration",
};

/**
 * Project preview frames. Real assets are used where they exist; otherwise an
 * original composition is drawn and clearly labelled as an illustration.
 */
export function ProjectPreview({ project, size = "card", priority = false, className, hideBadge = false }: ProjectPreviewProps) {
  const sizes = size === "hero" ? "(min-width: 1024px) 1100px, 100vw" : "(min-width: 1024px) 560px, 100vw";
  const kind = previewKind[project.preview];

  return (
    <div
      className={cn(
        "@container relative isolate overflow-hidden rounded-[var(--radius-media)]",
        size === "hero" ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[16/10]",
        className,
      )}
      style={{ background: project.brand.surface }}
    >
      {/* Artwork layer — eases forward slightly when the parent card is hovered */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
      {project.preview === "bentabuddy" && <BentaBuddyArt />}
      {project.preview === "freshly" && project.cover && (
        <FreshlyFrame src={project.cover.src} alt={project.cover.alt} sizes={sizes} priority={priority} />
      )}
      {project.preview === "eelio" && project.cover && <EelioArt mascot={project.cover.src} sizes={size} priority={priority} />}
      {project.preview === "smartvault" && project.cover && (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover object-[center_35%]"
        />
      )}
      {project.preview === "freshguide" && <FreshGuideArt />}
      </div>

      {/* Inner rim so every preview sits inside the glass */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/5" />
      {!hideBadge && <MediaBadge kind={kind} dark={project.brand.dark} className="absolute top-3 left-3 z-10" />}
    </div>
  );
}

/* --------------------------------------------------------------------------
   BentaBuddy — illustration of the conversation → draft flow from the README
   -------------------------------------------------------------------------- */
function BentaBuddyArt() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center p-[6%] pt-[12%]">
      <div
        className="orb -top-16 -right-10 size-64"
        style={{ ["--orb-color" as string]: "rgba(240,150,60,0.35)" }}
      />
      <div
        className="orb -bottom-20 -left-10 size-64"
        style={{ ["--orb-color" as string]: "rgba(47,107,79,0.18)" }}
      />
      <div className="relative grid w-full max-w-[86%] grid-cols-[1fr_1.05fr] items-center gap-[5%]">
        {/* Conversation */}
        <div className="flex flex-col gap-2 text-[clamp(0.55rem,1.55cqw,1.1rem)] leading-snug">
          <div className="flex items-center gap-1.5 text-[#7a5a3a]">
            <MessageCircle className="size-[1.1em]" />
            <span className="font-medium">Page inbox</span>
          </div>
          <p className="w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[#2b1a0b] shadow-[0_6px_16px_-8px_rgba(120,70,20,.35)]">
            2 dozen cheese pandesal bukas, pickup 8am
          </p>
          <p className="w-fit max-w-[95%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[#2b1a0b] shadow-[0_6px_16px_-8px_rgba(120,70,20,.35)]">
            gawin na lang 3 dozen, 9am
          </p>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[#2f6b4f]/10 px-2 py-0.5 text-[0.9em] text-[#2f6b4f]">
            <Sparkles className="size-[1em]" /> Local AI · on this computer
          </span>
        </div>

        {/* Draft */}
        <div className="rounded-[18px] border border-white/80 bg-white/70 p-3 text-[clamp(0.55rem,1.55cqw,1.1rem)] shadow-[0_18px_40px_-18px_rgba(120,70,20,.45)] backdrop-blur-md sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#2b1a0b]">Order draft</span>
            <span className="rounded-full bg-[#e07a1f]/12 px-2 py-0.5 text-[0.85em] font-medium text-[#a4520f]">Needs review</span>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5 text-[#4a3523]">
            <div className="flex justify-between gap-2">
              <span>Cheese pandesal</span>
              <span className="font-semibold text-[#2b1a0b]">36 pcs</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-[1em]" /> Pickup
              </span>
              <span className="font-semibold text-[#2b1a0b]">Tomorrow, 9:00</span>
            </div>
            <div className="mt-1 h-px bg-[#2b1a0b]/10" />
            <p className="text-[0.9em] text-[#7a5a3a]">Source: “gawin na lang 3 dozen, 9am”</p>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-[#2f6b4f] py-1.5 font-medium text-white">
              <Check className="size-[1em]" /> Approve
            </span>
            <span className="inline-flex flex-1 items-center justify-center rounded-full bg-white py-1.5 font-medium text-[#4a3523] ring-1 ring-[#2b1a0b]/10">
              Edit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Freshly — real screenshot in a minimal app frame
   -------------------------------------------------------------------------- */
function FreshlyFrame({ src, alt, sizes, priority }: { src: StaticImageData; alt: string; sizes: string; priority: boolean }) {
  return (
    <div className="absolute inset-0 px-[7%] pt-[11%]">
      <div
        className="orb -top-24 -left-16 size-72"
        style={{ ["--orb-color" as string]: "rgba(26,167,196,0.25)" }}
        aria-hidden
      />
      <div className="relative h-full overflow-hidden rounded-t-[16px] border border-b-0 border-white bg-white shadow-[0_24px_60px_-24px_rgba(18,52,64,.45)]">
        <div aria-hidden className="flex h-6 items-center gap-1.5 border-b border-[#123440]/[0.06] bg-[#f4fbfe] px-3">
          <span className="size-2 rounded-full bg-[#123440]/15" />
          <span className="size-2 rounded-full bg-[#123440]/15" />
          <span className="size-2 rounded-full bg-[#123440]/15" />
        </div>
        <div className="relative h-[calc(100%-1.5rem)]">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} placeholder="blur" className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Eelio — mascot and headline from the team pitch deck
   -------------------------------------------------------------------------- */
function EelioArt({ mascot, sizes, priority }: { mascot: StaticImageData; sizes: string; priority: boolean }) {
  const name = [
    { part: "Eel", gloss: "living battery" },
    { part: "Elio", gloss: "light & clarity" },
    { part: "-io", gloss: "made for you" },
  ];
  return (
    <div className="absolute inset-0">
      <div
        className="orb -top-24 right-0 size-80"
        style={{ ["--orb-color" as string]: "rgba(196,81,13,0.18)" }}
        aria-hidden
      />
      <div className="absolute inset-y-0 left-0 flex w-[64%] flex-col justify-center gap-[5%] pt-[8%] pl-[7%]">
        <p className="font-mono text-[clamp(0.5rem,1.25cqw,0.9rem)] font-medium tracking-[0.14em] text-[#a3440b] uppercase">
          Challenge #2 · Know your bill
        </p>
        <p className="text-[clamp(1.1rem,5.4cqw,3.6rem)] leading-[1.02] font-bold tracking-[-0.04em] text-[#211a14]">
          “Why is my bill like this?”
        </p>
        <p className="text-[clamp(1rem,4.4cqw,3rem)] leading-none font-bold tracking-[-0.04em] text-[#211a14]">
          Meet <span className="text-[#c4510d]">Eelio</span>.
        </p>
        <ul aria-hidden className="flex flex-wrap gap-1.5">
          {name.map((n) => (
            <li
              key={n.part}
              className="rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[clamp(0.5rem,1.4cqw,1rem)] text-[#4a3b2e] shadow-[0_10px_24px_-16px_rgba(120,60,20,.5)] backdrop-blur-md"
            >
              <span className="font-semibold text-[#a3440b]">{n.part}</span> · {n.gloss}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute right-[4%] bottom-[-14%] h-[104%] w-[34%]">
        <Image
          src={mascot}
          alt="Eelio's mascot, a friendly blue eel in an orange cap and vest."
          fill
          sizes={sizes === "hero" ? "380px" : "(min-width: 1024px) 200px, 34vw"}
          priority={priority}
          className="object-contain object-bottom drop-shadow-[0_18px_24px_rgba(120,60,20,0.25)]"
        />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   FreshGuide — illustrative campus route using the project logo
   -------------------------------------------------------------------------- */
function FreshGuideArt() {
  return (
    <div aria-hidden className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="fg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#14301a" strokeOpacity="0.05" />
          </pattern>
        </defs>
        <rect width="640" height="400" fill="url(#fg-grid)" />
        {/* Buildings */}
        <rect x="70" y="80" width="150" height="90" rx="16" fill="#fff" stroke="#14301a" strokeOpacity="0.08" />
        <rect x="380" y="60" width="190" height="110" rx="18" fill="#fff" stroke="#14301a" strokeOpacity="0.08" />
        <rect x="90" y="240" width="120" height="100" rx="16" fill="#fff" stroke="#14301a" strokeOpacity="0.08" />
        <rect x="400" y="250" width="170" height="90" rx="16" fill="#fff" stroke="#14301a" strokeOpacity="0.08" />
        {/* Route */}
        <path
          d="M300 312 C 300 250, 330 230, 360 205 S 470 150, 480 120"
          fill="none"
          stroke="#1da61d"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2 14"
        />
        <circle cx="300" cy="312" r="10" fill="#fff" stroke="#1da61d" strokeWidth="4" />
        <circle cx="480" cy="120" r="12" fill="#f5a300" />
        <circle cx="480" cy="120" r="22" fill="#f5a300" fillOpacity="0.18" />
      </svg>
      <div className="absolute top-[14%] left-[6%] flex items-center gap-2 rounded-2xl border border-white bg-white/80 px-3 py-2 text-[clamp(0.55rem,1.5cqw,1rem)] text-[#14301a] shadow-[0_12px_30px_-16px_rgba(20,48,26,.4)] backdrop-blur-md">
        <MapPin className="size-[1.2em] text-[#1da61d]" />
        <span className="font-semibold">Room 304</span>
        <span className="text-[#14301a]/60">· Main Building</span>
      </div>
      <div className="absolute right-[6%] bottom-[12%] flex items-center gap-2 rounded-2xl border border-white bg-white/80 px-3 py-2 text-[clamp(0.55rem,1.5cqw,1rem)] text-[#14301a] shadow-[0_12px_30px_-16px_rgba(20,48,26,.4)] backdrop-blur-md">
        <Navigation className="size-[1.2em] text-[#f5a300]" />
        <span className="font-semibold">3 steps</span>
        <span className="text-[#14301a]/60">· works offline</span>
      </div>
      <div className="absolute bottom-[9%] left-[6%] w-[18%] max-w-[104px]">
        <Image src="/projects/freshguide/logo.webp" alt="" width={512} height={398} className="h-auto w-full" />
      </div>
    </div>
  );
}
