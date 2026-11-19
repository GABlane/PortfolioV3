import { getProject, projects } from "@/data/projects";
import { ogSize, renderOg } from "@/lib/og";

export const alt = "Project case study by John Gabrielle Ofiangga";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOg({
    eyebrow: project ? `Case study · ${project.category}` : "Case study",
    title: project?.name ?? "Project",
    subtitle: project?.tagline ?? "",
    accent: project && !project.brand.dark ? project.brand.primary : "#4F8CFF",
  });
}
