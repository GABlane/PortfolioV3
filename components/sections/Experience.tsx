import { Check, LockKeyhole } from "lucide-react";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/AnimatedSection";
import { Glow, LightSphere } from "@/components/layout/AmbientBackground";

export function Experience() {
  const [current, ...previous] = experience.roles;

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
      <SectionHeading
        id="experience-title"
        eyebrow="01 — Career"
        title="Experience"
        subtitle="Building software beyond the classroom."
      />

      <Reveal className="relative mt-12 sm:mt-14">
        <Glow className="-top-20 -left-24" color="rgba(79,140,255,0.30)" size="34rem" />
        <Glow className="-right-24 -bottom-24" color="rgba(170,150,255,0.26)" size="30rem" />
        <Glow className="top-1/3 left-1/2" color="rgba(110,200,255,0.22)" size="22rem" />
        <LightSphere tone="blue" className="-top-12 -left-6 size-32 sm:-left-10 sm:size-44" />
        <LightSphere tone="lavender" className="-right-4 -bottom-10 size-28 sm:-right-8 sm:size-40" />

        <article
          aria-labelledby="employer-name"
          className="glass relative overflow-hidden rounded-[var(--radius-panel)]"
        >
          <AbstractRings />

          {/* 1 · Company — who and what, at a glance */}
          <header className="relative px-6 pt-7 pb-7 sm:px-10 sm:pt-10 lg:px-12">
            <p className="eyebrow">Employer</p>
            <h3
              id="employer-name"
              className="mt-2 text-[1.45rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.75rem]"
            >
              {experience.employer}
            </h3>
            <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-ink-2">{experience.summary}</p>
          </header>

          <div className="relative mx-6 h-px bg-ink/[0.07] sm:mx-10 lg:mx-12" />

          {/* 2 · Roles — the progression, then what the current role involves */}
          <div className="relative grid gap-10 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-12">
            <section aria-labelledby="progression-label">
              <h4 id="progression-label" className="eyebrow">
                Progression
              </h4>
              <ol className="relative mt-5 flex flex-col gap-7">
                <span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-accent via-accent/40 to-ink/10"
                />
                <li className="relative pl-9">
                  <span aria-hidden className="absolute top-1 left-0 grid size-[15px] place-items-center">
                    <span className="absolute inset-0 rounded-full bg-accent/25" />
                    <span className="relative size-[9px] rounded-full bg-accent-strong ring-2 ring-white" />
                  </span>
                  <p className="font-mono text-[0.74rem] tracking-wide text-accent-ink">{current.displayDates}</p>
                  <p className="mt-1 text-[1.08rem] font-semibold tracking-[-0.02em] text-ink">{current.title}</p>
                  <p className="mt-1.5 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[0.72rem] font-medium text-accent-ink">
                    Current role
                  </p>
                </li>
                {previous.map((role) => (
                  <li key={role.title} className="relative pl-9">
                    <span aria-hidden className="absolute top-1 left-0 grid size-[15px] place-items-center">
                      <span className="size-[9px] rounded-full bg-white ring-2 ring-ink/20" />
                    </span>
                    <p className="font-mono text-[0.74rem] tracking-wide text-ink-3">{role.displayDates}</p>
                    <p className="mt-1 text-[1.02rem] font-semibold tracking-[-0.02em] text-ink">{role.title}</p>
                    <p className="mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-ink-2">{role.description}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="current-work-label" className="flex flex-col">
              <h4 id="current-work-label" className="eyebrow">
                What I do now
              </h4>
              <p className="mt-4 text-pretty leading-relaxed text-ink">{current.description}</p>

              <div className="fill-inset mt-6 rounded-[24px] p-5 sm:p-6">
                <h5 className="text-[0.92rem] font-semibold tracking-[-0.01em] text-ink">Highlights</h5>
                <ul className="mt-3.5 flex flex-col gap-3">
                  {experience.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/12 text-accent-strong">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-pretty text-[0.95rem] leading-relaxed text-ink-2">{item}</span>
                    </li>
                  ))}
                </ul>

                <h5 className="mt-6 border-t border-ink/[0.06] pt-5 text-[0.92rem] font-semibold tracking-[-0.01em] text-ink">
                  Technical focus
                </h5>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {experience.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full bg-white/80 px-3 py-1 text-[0.8rem] font-medium text-ink-2 ring-1 ring-ink/[0.06]"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* 3 · Confidentiality — the NDA note lives with the disclosure it explains */}
          <footer className="relative flex items-start gap-2.5 border-t border-ink/[0.06] bg-white/25 px-6 py-4 text-[0.82rem] leading-relaxed text-ink-3 sm:px-10 lg:px-12">
            <LockKeyhole className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <p>
              <span className="font-medium text-ink-2">Under NDA.</span> {experience.disclosure}
            </p>
          </footer>
        </article>
      </Reveal>
    </section>
  );
}

/** Original abstract decoration — deliberately unrelated to any real product. */
function AbstractRings() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -top-24 -right-24 size-[340px] opacity-70 sm:size-[420px]"
      viewBox="0 0 400 400"
      fill="none"
    >
      <defs>
        <linearGradient id="ring-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F8CFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#6EC8FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ring-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A99BFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4F8CFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="70" y="70" width="260" height="260" rx="72" stroke="url(#ring-a)" strokeWidth="1.25" />
      <rect x="110" y="110" width="180" height="180" rx="52" stroke="url(#ring-b)" strokeWidth="1.25" />
      <rect x="150" y="150" width="100" height="100" rx="30" stroke="url(#ring-a)" strokeWidth="1.25" />
      <circle cx="330" cy="200" r="4" fill="#4F8CFF" fillOpacity="0.35" />
      <circle cx="200" cy="70" r="3" fill="#A99BFF" fillOpacity="0.4" />
    </svg>
  );
}
