import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProjects, secondaryProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/AnimatedSection";
import { ProjectCard, ProjectRow } from "@/components/projects/ProjectCard";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Glow, LightSphere } from "@/components/layout/AmbientBackground";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          id="projects-title"
          eyebrow="02 — Projects"
          title="Selected work"
          subtitle="Applied AI, sustainability, energy, and IoT—from hackathon builds to working prototypes, with the reasoning behind each decision."
        />
        <Reveal delay={0.1}>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-medium text-accent-ink hover:underline hover:underline-offset-4"
          >
            All projects
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <div className="relative mt-12 sm:mt-14">
        <Glow className="top-10 -left-32" color="rgba(79,140,255,0.22)" size="32rem" />
        <Glow className="-right-32 bottom-1/3" color="rgba(170,150,255,0.2)" size="30rem" />
        <LightSphere tone="blue" className="-top-10 -left-4 size-28 sm:-left-8 sm:size-36" />
        <LightSphere tone="lavender" className="top-[38%] -right-4 size-24 sm:-right-8 sm:size-32" />

        {/* Phones: square grid, like a profile's posts */}
        <ProjectGrid className="relative md:hidden" />

        <ul className="relative hidden gap-6 md:grid lg:grid-cols-2 lg:gap-7">
          {featuredProjects.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>

        {secondaryProjects.length > 0 && (
          <div className="relative mt-16 hidden md:block">
            <Reveal>
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em] text-ink">Also built</h3>
            </Reveal>
            <ul className="mt-5 flex flex-col gap-6">
              {secondaryProjects.map((project) => (
                <Reveal as="li" key={project.slug}>
                  <ProjectRow project={project} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
