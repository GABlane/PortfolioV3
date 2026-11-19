import { GraduationCap, Trophy, Users } from "lucide-react";
import { about } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/AnimatedSection";
import { Glow, LightSphere } from "@/components/layout/AmbientBackground";

const groupIcons = { Education: GraduationCap, Recognition: Trophy, Leadership: Users } as const;

/**
 * Two related halves: the story (who I am) and the record (what backs it up).
 * The record is one surface, subdivided by kind, so related facts sit together.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        {/* Story */}
        <div className="flex flex-col lg:sticky lg:top-32">
          <SectionHeading id="about-title" eyebrow="04 — About" title={about.title} />
          <Reveal className="mt-6 flex max-w-xl flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-2">
            {about.paragraphs.map((p) => (
              <p key={p} className="text-pretty">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Record */}
        <Reveal className="relative" delay={0.05}>
          <Glow className="-top-16 -right-10" color="rgba(170,150,255,0.26)" size="26rem" />
          <LightSphere tone="cyan" className="-top-8 -right-4 size-28 sm:-right-8 sm:size-36" />
          <LightSphere tone="blue" className="-bottom-8 -left-6 size-20 sm:size-24" />

          <div className="glass relative rounded-[var(--radius-panel)] p-2 sm:p-3">
            <h3 className="sr-only">At a glance</h3>
            <div className="flex flex-col">
              {about.groups.map((group, gi) => {
                const Icon = groupIcons[group.label];
                return (
                  <section
                    key={group.label}
                    aria-labelledby={`about-group-${gi}`}
                    className={gi > 0 ? "border-t border-ink/[0.06]" : undefined}
                  >
                    <div className="px-4 pt-5 pb-2 sm:px-5">
                      <h4 id={`about-group-${gi}`} className="eyebrow flex items-center gap-2">
                        <Icon className="size-3.5 text-accent-strong" aria-hidden />
                        {group.label}
                      </h4>
                    </div>
                    <ul className="flex flex-col pb-3">
                      {group.items.map((item) => (
                        <li key={item.title} className="px-4 py-2.5 sm:px-5">
                          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                            <p className="font-semibold tracking-[-0.015em] text-ink">{item.title}</p>
                            <p className="shrink-0 font-mono text-[0.72rem] text-ink-3">{item.date}</p>
                          </div>
                          <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{item.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
