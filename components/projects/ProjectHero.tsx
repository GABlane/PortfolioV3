import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Info } from "lucide-react";
import type { Project } from "@/data/types";
import { GlassButton } from "@/components/glass/GlassButton";
import { Entrance } from "@/components/motion/AnimatedSection";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { ProjectPreview } from "./ProjectPreview";

export function ProjectHero({ project }: { project: Project }) {
  const meta = [
    { label: "Category", value: project.category },
    { label: "Team", value: project.team },
    ...(project.context ? [{ label: "Context", value: project.context }] : []),
    ...(project.period ? [{ label: "Year", value: project.period }] : []),
  ];

  return (
    <header className="relative mx-auto max-w-6xl px-4 pt-32 sm:px-6 sm:pt-40">
      <Entrance>
        <Link
          href="/#projects"
          className="inline-flex min-h-10 items-center gap-1.5 text-[0.9rem] font-medium text-ink-2 hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All work
        </Link>
      </Entrance>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-14">
        <div>
          <Entrance delay={0.05}>
            <p className="eyebrow flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-full" style={{ background: project.brand.primary }} />
              Case study
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,1.4rem+4vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-ink">
              {project.name}
              {project.alias && (
                <span className="ml-3 align-middle text-[0.32em] font-medium tracking-[-0.01em] text-ink-3">
                  {project.alias}
                </span>
              )}
            </h1>
          </Entrance>
          <Entrance delay={0.12}>
            <p className="mt-6 max-w-2xl text-pretty text-[1.0625rem] leading-relaxed text-ink-2 sm:text-[1.125rem]">
              {project.summary}
            </p>
          </Entrance>
          <Entrance delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((link, i) =>
                link.kind === "demo" ? (
                  <GlassButton key={link.href} href={link.href} variant="primary">
                    {link.label}
                  </GlassButton>
                ) : (
                  <GlassButton
                    key={link.href}
                    href={link.href}
                    variant={i === 0 ? "primary" : "glass"}
                    icon={<GitHubIcon className="size-4" />}
                  >
                    {link.label}
                  </GlassButton>
                ),
              )}
              {project.links.length === 0 && (
                <span className="surface inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.9rem] text-ink-2">
                  <ArrowUpRight className="size-4 opacity-60" aria-hidden />
                  Demo link coming soon
                </span>
              )}
            </div>
          </Entrance>
        </div>

        <Entrance delay={0.14}>
          <dl className="surface grid gap-4 rounded-[24px] p-5 sm:grid-cols-2 lg:grid-cols-1">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow !text-[0.66rem]">{m.label}</dt>
                <dd className="mt-1 text-[0.94rem] leading-snug text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Entrance>
      </div>

      <Entrance delay={0.2} className="mt-12">
        <div className="glass rounded-[calc(var(--radius-media)+12px)] p-2.5 sm:p-3">
          <ProjectPreview project={project} size="hero" priority />
        </div>
      </Entrance>

      {project.notice && (
        <p className="mt-4 flex items-start gap-2 text-sm text-ink-3">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {project.notice}
        </p>
      )}
    </header>
  );
}
