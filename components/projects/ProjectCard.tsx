import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/types";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { ProjectPreview } from "./ProjectPreview";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
  maxTech?: number;
  headingLevel?: "h3" | "h2";
};

export function ProjectCard({ project, className, maxTech = 5, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const shown = project.tech.slice(0, maxTech);
  const extra = project.tech.length - shown.length;
  const caseStudyHref = `/projects/${project.slug}`;
  const titleId = `project-${project.slug}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "glass glass-interactive group relative flex h-full flex-col rounded-[var(--radius-card)] p-2.5 sm:p-3",
        "hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <ProjectPreview project={project} className="rounded-[18px] sm:rounded-[16px]" />

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3 sm:px-4">
        <p className="eyebrow">{project.category}</p>
        <Heading id={titleId} className="mt-2 text-[1.4rem] font-semibold tracking-[-0.03em] text-ink">
          {/* Stretched link: the whole card opens the case study */}
          <Link href={caseStudyHref} className="after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-strong">
            {project.name}
          </Link>
          {project.alias && <span className="ml-2 align-middle text-[0.8rem] font-medium text-ink-3">{project.alias}</span>}
        </Heading>
        <p className="mt-1 text-[0.82rem] text-ink-3">
          {project.team}
          {project.period ? ` · ${project.period}` : ""}
        </p>
        <p className="mt-3 text-pretty leading-relaxed text-ink-2">{project.tagline}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {shown.map((tech) => (
            <li key={tech} className="rounded-full bg-white/60 px-2.5 py-1 text-[0.76rem] font-medium text-ink-2 ring-1 ring-ink/[0.06]">
              {tech}
            </li>
          ))}
          {extra > 0 && (
            <li className="rounded-full px-2 py-1 text-[0.76rem] font-medium text-ink-3">+{extra} more</li>
          )}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/[0.06] pt-4 text-[0.9rem]">
            <span className="inline-flex items-center gap-1.5 font-medium text-accent-ink">
              Case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
            </span>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex min-h-10 items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
              >
                {link.kind === "github" ? <GitHubIcon className="size-4" /> : <ArrowUpRight className="size-4" aria-hidden />}
                {link.label}
                <span className="sr-only">for {project.name} (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Compact horizontal card for secondary work. */
export function ProjectRow({ project }: { project: Project }) {
  const titleId = `project-${project.slug}-row-title`;
  return (
    <article
      aria-labelledby={titleId}
      className="glass glass-interactive group relative grid gap-5 rounded-[var(--radius-card)] p-2.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:p-3"
    >
      <ProjectPreview project={project} className="rounded-[18px] sm:rounded-[16px]" />
      <div className="px-3 pb-3 sm:px-4 sm:py-4">
        <p className="eyebrow">{project.category}</p>
        <h3 id={titleId} className="mt-2 text-[1.3rem] font-semibold tracking-[-0.03em] text-ink">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent-strong">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-pretty leading-relaxed text-ink-2">{project.tagline}</p>
        <p className="mt-4 text-[0.82rem] text-ink-3">{project.tech.join(" · ")}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/[0.06] pt-4 text-[0.9rem]">
          <span className="inline-flex items-center gap-1.5 font-medium text-accent-ink">
            Case study
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </span>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex min-h-10 items-center gap-1.5 text-ink-2 hover:text-ink"
            >
              <GitHubIcon className="size-4" />
              {link.label}
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
