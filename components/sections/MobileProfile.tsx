import { ArrowUpRight, BriefcaseBusiness, FileText, FolderGit2, Gamepad2, Layers, Link2, Mail, MapPin, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { profile, resumeLink } from "@/data/profile";
import { projects } from "@/data/projects";
import { expertise } from "@/data/skills";
import { GlassButton } from "@/components/glass/GlassButton";
import { Entrance } from "@/components/motion/AnimatedSection";
import { HeroPortrait } from "./HeroPortrait";

/**
 * Phone-only profile header in a social-profile layout: avatar + counts,
 * name and bio, an action row, then a swipeable row of highlights.
 * Counts are derived from real data — nothing invented.
 */
export function MobileProfile() {
  const hackathons = projects.filter((p) => /hackathon/i.test(`${p.team} ${p.context ?? ""}`)).length;

  const stats = [
    { value: String(projects.length), label: "Projects", href: "#projects" },
    { value: String(hackathons), label: "Hackathons", href: "#projects" },
    { value: String(expertise.length), label: "Focus areas", href: "#expertise" },
  ];

  const highlights: { label: string; href: string; icon: ReactNode; external?: boolean }[] = [
    { label: "Experience", href: "#experience", icon: <BriefcaseBusiness className="size-[22px]" aria-hidden /> },
    { label: "Projects", href: "#projects", icon: <FolderGit2 className="size-[22px]" aria-hidden /> },
    { label: "Expertise", href: "#expertise", icon: <Layers className="size-[22px]" aria-hidden /> },
    { label: "About", href: "#about", icon: <UserRound className="size-[22px]" aria-hidden /> },
    { label: "Contact", href: "#contact", icon: <Mail className="size-[22px]" aria-hidden /> },
    { label: "Resume", href: resumeLink.href, icon: <FileText className="size-[22px]" aria-hidden /> },
    { label: "Playground", href: profile.playground, icon: <Gamepad2 className="size-[22px]" aria-hidden />, external: true },
  ];

  return (
    <div className="md:hidden">
      {/* Avatar + counts */}
      <Entrance>
        <div className="flex items-center gap-5">
          <HeroPortrait variant="avatar" />
          <ul className="grid flex-1 grid-cols-3 text-center" aria-label="At a glance">
            {stats.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="press flex min-h-14 flex-col items-center justify-center rounded-2xl">
                  <span className="text-[1.15rem] leading-tight font-semibold tracking-[-0.02em] text-ink">{s.value}</span>
                  <span className="text-[0.78rem] text-ink-2">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Entrance>

      {/* Name + bio */}
      <Entrance delay={0.06}>
        <h1 id="hero-title-mobile" className="mt-4 text-[1.05rem] leading-snug font-semibold tracking-[-0.015em] text-ink">
          {profile.name}
        </h1>
        <p className="text-[0.82rem] text-ink-3">{profile.title}</p>
        <div className="mt-2 flex flex-col gap-1 text-[0.94rem] leading-snug text-ink">
          <p>Part-time developer · BS Computer Science</p>
          <p className="text-pretty">
            I build web &amp; mobile apps, the backend services behind them, and practical AI — turning complex ideas
            into polished digital products.
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[0.85rem] text-ink-3">
            <MapPin className="size-3.5" aria-hidden />
            {profile.location}
          </p>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 w-fit items-center gap-1 text-[0.88rem] font-medium text-accent-ink"
          >
            <Link2 className="size-3.5" aria-hidden />
            github.com/{profile.social.githubHandle}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Entrance>

      {/* Actions */}
      <Entrance delay={0.12}>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <GlassButton href="#projects" variant="primary" className="h-10 px-2 text-[0.86rem]" showExternalIcon={false}>
            Explore
          </GlassButton>
          <GlassButton href={resumeLink.href} variant="glass" className="h-10 px-2 text-[0.86rem]" showExternalIcon={false}>
            Resume
          </GlassButton>
          <GlassButton
            href={`mailto:${profile.email}`}
            variant="glass"
            className="h-10 px-2 text-[0.86rem]"
            showExternalIcon={false}
          >
            Message
          </GlassButton>
        </div>
      </Entrance>

      {/* Highlights — swipe sideways */}
      <Entrance delay={0.18}>
        <nav aria-label="Highlights" className="-mx-4 mt-6">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {highlights.map((h) => (
              <li key={h.label} className="snap-start">
                <a
                  href={h.href}
                  {...(h.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="press flex w-[68px] flex-col items-center gap-1.5"
                >
                  <span className="rounded-full bg-[conic-gradient(from_210deg,#6ec8ff,#a99bff,#ffc9ec,#4f8cff,#6ec8ff)] p-[2.5px]">
                    <span className="grid size-[60px] place-items-center rounded-full border-2 border-white bg-white/75 text-accent-strong">
                      {h.icon}
                    </span>
                  </span>
                  <span className="flex max-w-full items-center gap-0.5 truncate text-[0.72rem] text-ink-2">
                    {h.label}
                    {h.external && <ArrowUpRight className="size-3 shrink-0 opacity-60" aria-hidden />}
                  </span>
                  {h.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Entrance>
    </div>
  );
}
