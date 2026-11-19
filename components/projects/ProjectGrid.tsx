import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessagesSquare, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Phone layout for projects: a 3-column grid of square tiles (like a profile's
 * posts). Each tile opens the case study, where the full media labels appear.
 */
export function ProjectGrid({ className }: { className?: string }) {
  const ordered = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("glass rounded-[24px] p-1.5", className)}>
      <ul className="grid grid-cols-3 gap-1.5" aria-label="Projects">
        {ordered.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="press group relative block aspect-square overflow-hidden rounded-[18px] ring-1 ring-black/5 ring-inset"
              style={{ background: project.brand.surface }}
              aria-label={`${project.name} — ${project.category}. Open case study`}
            >
              <TileArt project={project} />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,23,42,0.62)] to-transparent px-2 pt-6 pb-1.5 text-[0.7rem] leading-tight font-semibold text-white"
              >
                {project.name}
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/projects"
            className="fill-inset fill-interactive press flex aspect-square flex-col items-center justify-center gap-1 rounded-[18px] text-center text-[0.72rem] font-medium text-accent-ink"
          >
            <ArrowRight className="size-5" aria-hidden />
            All projects
          </Link>
        </li>
      </ul>
    </div>
  );
}

/** A square cover built for small tiles — real media where it exists, a clean mark otherwise. */
function TileArt({ project }: { project: Project }) {
  const sizes = "(max-width: 767px) 33vw, 160px";
  switch (project.preview) {
    case "eelio":
      return project.cover ? (
        <Image src={project.cover.src} alt="" fill sizes={sizes} className="object-contain object-bottom pt-2" />
      ) : null;
    case "freshguide":
      return (
        <span className="absolute inset-0 grid place-items-center pb-4">
          <Image src="/projects/freshguide/logo.webp" alt="" width={512} height={398} className="h-auto w-[68%]" />
        </span>
      );
    case "bentabuddy":
      return (
        <span className="absolute inset-0 grid place-items-center pb-4" style={{ color: project.brand.primary }}>
          <span className="relative">
            <MessagesSquare className="size-10" strokeWidth={1.6} aria-hidden />
            <Sparkles className="absolute -top-2 -right-3 size-4" style={{ color: project.brand.secondary }} aria-hidden />
          </span>
        </span>
      );
    default:
      return project.cover ? (
        <Image
          src={project.cover.src}
          alt=""
          fill
          sizes={sizes}
          placeholder={project.cover.transparent ? "empty" : "blur"}
          className={project.preview === "freshly" ? "object-cover object-left-top" : "object-cover"}
        />
      ) : null;
  }
}
