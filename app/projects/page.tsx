import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/AnimatedSection";
import { Glow } from "@/components/layout/AmbientBackground";
import { hasCanonicalDomain } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies by John Gabrielle Ofiangga: BentaBuddy, Freshly, Eelio, SmartVault, and FreshGuide—applied AI, sustainability, energy, IoT, and campus navigation.",
  alternates: hasCanonicalDomain ? { canonical: "/projects" } : undefined,
};

export default function ProjectsPage() {
  const ordered = [...projects].sort((a, b) => a.order - b.order);
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-36 pb-12 sm:px-6 sm:pt-44">
      <SectionHeading
        as="h1"
        eyebrow="Archive"
        title="All projects"
        subtitle="Every project here links to a case study covering the problem, my role, the architecture, and what's still missing."
      />
      <div className="relative mt-12">
        <Glow className="top-0 -left-24" color="rgba(79,140,255,0.22)" size="30rem" />
        <Glow className="-right-24 bottom-0" color="rgba(170,150,255,0.2)" size="30rem" />
        <ul className="relative grid gap-6 md:grid-cols-2 lg:gap-7">
          {ordered.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={(i % 2) * 0.06}>
              <ProjectCard project={project} headingLevel="h2" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
