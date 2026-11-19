import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getRelatedProjects, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { JsonLd } from "@/components/seo/JsonLd";
import { hasCanonicalDomain, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name} — Case Study`;
  return {
    title,
    description: project.tagline,
    alternates: hasCanonicalDomain ? { canonical: `/projects/${project.slug}` } : undefined,
    openGraph: {
      type: "article",
      title,
      description: project.tagline,
      url: `/projects/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project.slug, 2);

  const structured = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: `${project.name} — ${project.category}`,
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    keywords: project.tech.join(", "),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    ...(project.links.find((l) => l.kind === "github")
      ? { codeRepository: project.links.find((l) => l.kind === "github")?.href }
      : {}),
  };

  return (
    <article>
      <JsonLd data={structured} />
      <ProjectHero project={project} />
      <ProjectCaseStudy project={project} related={related} />
    </article>
  );
}
