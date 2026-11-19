import { expertise, toolbelt } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/AnimatedSection";
import { Glow, LightSphere } from "@/components/layout/AmbientBackground";
import type { ExpertiseArea } from "@/data/types";

export function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        id="expertise-title"
        eyebrow="03 — Expertise"
        title="How I Build"
        subtitle="Capabilities, not skill bars. These are the layers I work across, and the tools I reach for in each."
      />

      <div className="relative mt-12 sm:mt-14">
        <Glow className="-top-10 left-1/4" color="rgba(110,200,255,0.24)" size="30rem" />
        <Glow className="right-0 -bottom-16" color="rgba(79,140,255,0.2)" size="28rem" />
        <LightSphere tone="cyan" className="top-[calc(50%-1.25rem)] left-1/2 hidden size-44 -translate-x-1/2 -translate-y-1/2 sm:block" />
        <LightSphere tone="lavender" className="-top-8 right-[8%] size-24 sm:size-28" />

        <ul className="relative grid gap-5 sm:grid-cols-2">
          {expertise.map((area, i) => (
            <Reveal as="li" key={area.title} delay={(i % 2) * 0.07}>
              <ExpertiseCard area={area} index={i} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="relative mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="eyebrow shrink-0">Also in the toolbelt</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.9rem] text-ink-2">
              {toolbelt.map((tool) => (
                <li key={tool} className="after:ml-4 after:text-ink/20 after:content-['·'] last:after:content-none">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ExpertiseCard({ area, index }: { area: ExpertiseArea; index: number }) {
  const Icon = area.icon;
  return (
    <article className="glass glass-interactive flex h-full flex-col rounded-[var(--radius-card)] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="glass-lens grid size-12 place-items-center rounded-2xl text-accent-strong">
          <Icon className="size-[22px]" aria-hidden />
        </span>
        <span className="font-mono text-[0.72rem] text-ink-3" aria-hidden>
          0{index + 1}
        </span>
      </div>
      <h3 className="mt-6 text-[1.25rem] font-semibold tracking-[-0.025em] text-ink">{area.title}</h3>
      <p className="mt-2 text-pretty leading-relaxed text-ink-2">{area.description}</p>
      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${area.title} tools and practices`}>
        {area.items.map((item) => (
          <li key={item} className="rounded-full bg-white/65 px-3 py-1 text-[0.82rem] font-medium text-ink-2 ring-1 ring-ink/[0.06]">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
