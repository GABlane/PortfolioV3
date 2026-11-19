import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, ExternalLink } from "lucide-react";
import type { Project } from "@/data/types";
import { Reveal } from "@/components/motion/AnimatedSection";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { ConceptEvolution } from "./ConceptEvolution";
import { CaseStudyToc } from "./CaseStudyToc";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";

type Section = { id: string; label: string; content: ReactNode };

/** Sections grouped into the three questions a reader asks, in order. */
const CHAPTERS = [
  { id: "context", label: "Context", blurb: "The problem and where I fit in.", sections: ["problem", "evolution", "role"] },
  { id: "build", label: "Build", blurb: "What was made, and why it was made that way.", sections: ["solution", "features", "architecture", "decisions"] },
  { id: "results", label: "Results", blurb: "What came of it, honestly.", sections: ["outcomes", "gallery", "links"] },
] as const;

export function ProjectCaseStudy({ project, related }: { project: Project; related: Project[] }) {
  const cs = project.caseStudy;
  const accent = project.brand.dark ? "#4f8cff" : project.brand.primary;
  const hasProposed = cs.features.some((f) => f.status === "proposed");

  const sections: Section[] = [
    {
      id: "problem",
      label: "Problem",
      content: <Prose paragraphs={cs.problem} />,
    },
    ...(project.slug === "eelio"
      ? [{ id: "evolution", label: "Concept evolution", content: <ConceptEvolution /> }]
      : []),
    {
      id: "role",
      label: "My role",
      content: (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {cs.role.map((r) => (
              <li key={r} className="flex gap-3 text-[1.0625rem] leading-relaxed text-ink-2">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                <span className="text-pretty">{r}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink-3">Team: {project.team}</p>
        </div>
      ),
    },
    { id: "solution", label: "Solution", content: <Prose paragraphs={cs.solution} /> },
    {
      id: "features",
      label: "Features",
      content: (
        <div className="flex flex-col gap-4">
          {hasProposed && (
            <p className="surface flex items-start gap-2 rounded-2xl px-4 py-3 text-sm text-ink-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#7c6cf0]" aria-hidden />
              These features come from the pitch. They are labelled “Proposed” and are not presented as a shipped product.
            </p>
          )}
          <ul className="grid gap-3 sm:grid-cols-2">
            {cs.features.map((f) => (
              <li key={f.title} className="surface flex flex-col rounded-[20px] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold tracking-[-0.015em] text-ink">{f.title}</h4>
                  <StatusBadge status={f.status} />
                </div>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{f.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    ...(cs.architecture.length > 0
      ? [
          {
            id: "architecture",
            label: "Architecture",
            content: (
              <div className="flex flex-col gap-4">
                <ArchitectureDiagram layers={cs.architecture} accent={accent} />
                {cs.architectureNote && <p className="text-sm text-ink-3">{cs.architectureNote}</p>}
              </div>
            ),
          },
        ]
      : []),
    {
      id: "decisions",
      label: project.slug === "eelio" ? "Design decisions" : "Engineering decisions",
      content: (
        <ol className="flex flex-col gap-3">
          {cs.decisions.map((d, i) => (
            <li key={d.title} className="surface grid gap-2 rounded-[20px] p-5 sm:grid-cols-[2.5rem_1fr] sm:gap-4">
              <span className="font-mono text-[0.78rem] text-ink-3" aria-hidden>
                0{i + 1}
              </span>
              <div>
                <h4 className="font-semibold tracking-[-0.015em] text-ink">{d.title}</h4>
                <p className="mt-1.5 text-pretty leading-relaxed text-ink-2">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: "outcomes",
      label: "Outcomes & limits",
      content: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface rounded-[20px] p-5">
            <h4 className="flex items-center gap-2 font-semibold text-ink">
              <CircleCheck className="size-4 text-emerald-600" aria-hidden /> Outcomes
            </h4>
            <ul className="mt-3 flex flex-col gap-2.5 text-[0.94rem] leading-relaxed text-ink-2">
              {cs.outcomes.map((o) => (
                <li key={o} className="text-pretty">
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-[20px] p-5">
            <h4 className="flex items-center gap-2 font-semibold text-ink">
              <CircleAlert className="size-4 text-amber-600" aria-hidden /> Limitations
            </h4>
            <ul className="mt-3 flex flex-col gap-2.5 text-[0.94rem] leading-relaxed text-ink-2">
              {cs.limitations.map((o) => (
                <li key={o} className="text-pretty">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    ...(project.gallery.length > 0
      ? [{ id: "gallery", label: "Gallery", content: <ProjectGallery media={project.gallery} /> }]
      : []),
    {
      id: "links",
      label: "Links",
      content: (
        <div className="flex flex-col gap-3">
          {project.links.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass glass-soft glass-interactive press flex items-center gap-3 rounded-[20px] p-4"
                  >
                    <span className="glass-lens grid size-10 place-items-center rounded-xl text-ink">
                      {link.kind === "github" ? <GitHubIcon className="size-[18px]" /> : <ExternalLink className="size-[18px]" aria-hidden />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{link.label}</span>
                      <span className="block truncate text-[0.8rem] text-ink-3">{link.href.replace(/^https?:\/\//, "")}</span>
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="surface rounded-[20px] p-5 text-ink-2">
              The hosted build is still being prepared. A demo link will be added here once it&apos;s live.
            </p>
          )}
        </div>
      ),
    },
  ];

  const byId = new Map(sections.map((sec) => [sec.id, sec]));
  const chapters = CHAPTERS.map((c) => ({
    ...c,
    items: c.sections.map((id) => byId.get(id)).filter((sec): sec is Section => Boolean(sec)),
  })).filter((c) => c.items.length > 0);
  const numbering = new Map(chapters.flatMap((c) => c.items).map((sec, i) => [sec.id, i + 1]));

  return (
    <div className="relative mx-auto mt-16 grid max-w-6xl gap-12 px-4 sm:mt-20 sm:px-6 lg:grid-cols-[13rem_1fr] lg:gap-16">
      <CaseStudyToc groups={chapters.map((c) => ({ label: c.label, items: c.items.map(({ id, label }) => ({ id, label })) }))} />

      <div className="flex min-w-0 flex-col gap-20 sm:gap-24">
        {chapters.map((chapter, ci) => (
          <section key={chapter.id} aria-labelledby={`chapter-${chapter.id}`} className="flex flex-col gap-14 sm:gap-16">
            <header className="flex items-end gap-4 border-b border-ink/[0.07] pb-4">
              <div>
                <p className="font-mono text-[0.78rem] text-ink-3">
                  Part {ci + 1}
                </p>
                <h2 id={`chapter-${chapter.id}`} className="mt-1 text-[1.05rem] font-semibold tracking-[-0.015em] text-ink">
                  {chapter.label}
                  <span className="ml-2 font-normal text-ink-3">{chapter.blurb}</span>
                </h2>
              </div>
            </header>

            {chapter.items.map((s) => (
              <Reveal key={s.id} className="min-w-0">
                <section id={s.id} aria-labelledby={`${s.id}-heading`}>
                  <h3
                    id={`${s.id}-heading`}
                    className="mb-6 flex items-baseline gap-3 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] font-semibold tracking-[-0.03em] text-ink"
                  >
                    <span className="font-mono text-[0.8rem] font-normal tracking-normal text-ink-3">
                      {String(numbering.get(s.id) ?? 0).padStart(2, "0")}
                    </span>
                    {s.label}
                  </h3>
                  {s.content}
                </section>
              </Reveal>
            ))}
          </section>
        ))}

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="border-t border-ink/[0.06] pt-14">
            <h2 id="related-heading" className="mb-6 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">
              Related projects
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} maxTech={3} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex max-w-2xl flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-2">
      {paragraphs.map((p) => (
        <p key={p} className="text-pretty">
          {p}
        </p>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: "implemented" | "proposed" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.08em] uppercase",
        status === "implemented" ? "bg-emerald-500/10 text-emerald-800" : "bg-[#7c6cf0]/10 text-[#4b3fb3]",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "implemented" ? "bg-emerald-500" : "bg-[#7c6cf0]")} />
      {status === "implemented" ? "Implemented" : "Proposed"}
    </span>
  );
}
