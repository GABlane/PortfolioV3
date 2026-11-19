import Image from "next/image";
import { ArrowDown, Plus } from "lucide-react";
import { eelioEvolution } from "@/data/projects";

/** KuryenteKo + KilosWatt → Eelio */
export function ConceptEvolution() {
  const [kuryente, kilos] = eelioEvolution.sources;
  const result = eelioEvolution.result;

  return (
    <figure className="relative">
      <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_72px_1.05fr] lg:gap-0">
        {/* Sources */}
        <div className="flex flex-col gap-3">
          <SourceCard source={kuryente} accent="#c4510d" />
          <div className="flex justify-center lg:hidden" aria-hidden>
            <span className="surface grid size-8 place-items-center rounded-full text-ink-3">
              <Plus className="size-4" />
            </span>
          </div>
          <SourceCard source={kilos} accent="#13716a" />
        </div>

        {/* Connector */}
        <div aria-hidden className="relative hidden lg:block">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 72 400" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="evo-a" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c4510d" stopOpacity="0.55" />
                <stop offset="1" stopColor="#c4510d" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="evo-b" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#13716a" stopOpacity="0.55" />
                <stop offset="1" stopColor="#13716a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path d="M0 100 C 40 100, 32 200, 72 200" stroke="url(#evo-a)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0 300 C 40 300, 32 200, 72 200" stroke="url(#evo-b)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="flex justify-center lg:hidden" aria-hidden>
          <span className="surface grid size-8 place-items-center rounded-full text-ink-3">
            <ArrowDown className="size-4" />
          </span>
        </div>

        {/* Result */}
        <div
          className="relative flex flex-col overflow-hidden rounded-[26px] border border-white/80 p-5 shadow-[0_24px_60px_-28px_rgba(196,81,13,.5)] sm:p-6"
          style={{ background: "linear-gradient(160deg,#fdf1e7 0%,#fbe3d0 100%)" }}
        >
          <div className="absolute right-2 -bottom-6 h-[78%] w-[34%] sm:w-[30%]" aria-hidden>
            <Image src="/projects/eelio/mascot.webp" alt="" fill sizes="160px" className="object-contain object-bottom" />
          </div>
          <p className="font-mono text-[0.68rem] tracking-[0.14em] text-[#a3440b] uppercase">The merged concept</p>
          <p className="mt-2 text-[2rem] leading-none font-bold tracking-[-0.04em] text-[#211a14]">
            {result.name}
            <span className="text-[#c4510d]">.</span>
          </p>
          <ul className="mt-3 flex flex-col gap-0.5 text-[0.82rem] text-[#4a3b2e]">
            {result.meaning.map((m) => (
              <li key={m.part}>
                <span className="font-semibold text-[#a3440b]">{m.part}</span> · {m.gloss}
              </li>
            ))}
          </ul>
          <ul className="relative mt-5 flex max-w-[70%] flex-wrap gap-1.5">
            {result.points.map((p) => (
              <li key={p} className="rounded-full bg-white/75 px-2.5 py-1 text-[0.76rem] font-medium text-[#3a2c20] ring-1 ring-[#211a14]/[0.06]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-4 text-sm text-ink-3">
        Two team proposals for Challenge #2—one about understanding the bill, one about using less—were refined into a single
        product.
      </figcaption>
    </figure>
  );
}

function SourceCard({
  source,
  accent,
}: {
  source: (typeof eelioEvolution.sources)[number];
  accent: string;
}) {
  return (
    <div className="surface flex flex-1 flex-col rounded-[24px] p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[1.15rem] font-semibold tracking-[-0.025em]" style={{ color: accent }}>
          {source.name}
        </p>
        <p className="text-[0.75rem] font-medium text-ink-3">{source.focus}</p>
      </div>
      <p className="mt-1 text-[0.88rem] text-ink-2 italic">{source.question}</p>
      <ul className="mt-3 flex flex-col gap-1 text-[0.85rem] text-ink-2">
        {source.points.map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span aria-hidden className="size-1 rounded-full" style={{ background: accent }} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
