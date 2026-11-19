import {
  ArrowUpRight,
  BriefcaseBusiness,
  CodeXml,
  GraduationCap,
  Lightbulb,
  Monitor,
  Server,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { heroHighlights, heroIntro, profile, resumeLink, type IntroIcon } from "@/data/profile";
import { GlassButton } from "@/components/glass/GlassButton";
import { Entrance } from "@/components/motion/AnimatedSection";
import { HeroPortrait } from "./HeroPortrait";
import { MobileProfile } from "./MobileProfile";

const chipIcons: Record<IntroIcon, typeof CodeXml> = {
  code: CodeXml,
  web: Monitor,
  mobile: Smartphone,
  server: Server,
  ai: Sparkles,
  work: BriefcaseBusiness,
  study: GraduationCap,
  idea: Lightbulb,
};
const highlightIcons = { work: BriefcaseBusiness, build: Sparkles, bolt: Zap } as const;

/**
 * Introduction: face, name, then a short conversational intro with inline chips.
 * Layout: portrait | name + intro on desktop; stacked on mobile.
 */
export function Hero() {
  const socials = [
    { label: "github", href: profile.social.github },
    { label: "linkedin", href: profile.social.linkedin },
    { label: "email", href: `mailto:${profile.email}` },
  ];

  return (
    <section id="home" aria-label="Introduction" className="relative mx-auto max-w-6xl px-4 pt-24 pb-6 sm:px-6 md:pt-32 md:pb-8 lg:pt-32">
      {/* Phones: social-profile layout */}
      <MobileProfile />

      {/* Tablet & desktop */}
      <div className="hidden items-center gap-x-16 gap-y-10 md:grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-y-12">
      <Entrance delay={0.04} y={18} className="lg:justify-self-end">
        <HeroPortrait />
      </Entrance>

      <div className="flex flex-col">
        <Entrance delay={0.08}>
          <h1
            id="hero-title"
            className="text-[clamp(2.4rem,1.3rem+3.4vw,3.9rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink"
          >
            {profile.name}
          </h1>
          <p className="mt-3 text-[1.05rem] text-ink-2">{profile.title}</p>
        </Entrance>

        {/* Conversational intro — chips make the key nouns scannable */}
        <Entrance delay={0.16}>
          <div className="mt-6 flex max-w-[40rem] flex-col gap-4 text-[1.125rem] leading-[1.85] text-ink-2 sm:text-[1.22rem]">
            {heroIntro.map((paragraph, pi) => (
              <p key={pi} className="text-pretty">
                {paragraph.map((part, i) => {
                  if ("text" in part) return <span key={i}>{part.text}</span>;
                  const Icon = chipIcons[part.icon];
                  return (
                    <span key={i} className="whitespace-nowrap">
                      <span className="glass-lens mx-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-[0.1em] align-[0.05em] text-[0.94em] leading-[1.6] font-medium text-ink">
                        <Icon className="size-[0.95em] text-accent-strong" aria-hidden />
                        {part.chip}
                      </span>
                      {part.after}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </Entrance>

        <Entrance delay={0.24}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <GlassButton href="#projects" variant="primary" size="lg" showExternalIcon={false}>
              Explore My Work
            </GlassButton>
            <GlassButton href={resumeLink.href} variant="glass" size="lg" showExternalIcon={false}>
              {resumeLink.label}
            </GlassButton>
          </div>
        </Entrance>

        <Entrance delay={0.3}>
          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[0.9rem]">
            {socials.map((s) => {
              const web = s.href.startsWith("http");
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group inline-flex min-h-10 items-center gap-1 text-ink-3 transition-colors hover:text-ink"
                  >
                    <span className="underline-offset-4 group-hover:underline">{s.label}</span>
                    <ArrowUpRight
                      className="size-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                    {web && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </Entrance>
      </div>

      {/* Credentials — facts only, grouped as one frosted surface */}
      <Entrance delay={0.4} className="lg:col-span-2">
        <ul
          aria-label="Highlights"
          className="glass grid grid-cols-1 divide-y divide-ink/[0.06] rounded-[26px] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {heroHighlights.map((h) => {
            const Icon = highlightIcons[h.icon];
            return (
              <li key={h.title} className="flex items-center gap-3.5 px-5 py-4 sm:px-6 sm:py-5">
                <span className="fill-inset grid size-10 shrink-0 place-items-center rounded-xl text-accent-strong">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">{h.title}</span>
                  <span className="block truncate font-mono text-[0.72rem] tracking-wide text-ink-3">{h.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Entrance>
      </div>
    </section>
  );
}
