import type { CommandItem } from "@/components/layout/CommandMenu";
import { navItems, profile } from "@/data/profile";
import { projects } from "@/data/projects";

/** Built on the server so the client menu only receives a small, flat list. */
export function getCommandItems({ chat = false }: { chat?: boolean } = {}): CommandItem[] {
  const resumeHref = profile.resume.available ? profile.resume.href : "/resume";
  return [
    ...(chat
      ? [
          {
            id: "ask-ai",
            group: "Links" as const,
            label: "Ask about Gab (AI)",
            hint: "Chat with the portfolio assistant",
            href: "action:chat",
            icon: "ai" as const,
          },
        ]
      : []),
    ...navItems.map((n) => ({
      id: `section-${n.id}`,
      group: "Sections" as const,
      label: n.label,
      href: `/#${n.id}`,
      icon: "section" as const,
    })),
    ...[...projects]
      .sort((a, b) => a.order - b.order)
      .map((p) => ({
        id: `project-${p.slug}`,
        group: "Case studies" as const,
        label: p.name,
        hint: p.category,
        href: `/projects/${p.slug}`,
        icon: "project" as const,
      })),
    { id: "all-projects", group: "Case studies", label: "All projects", href: "/projects", icon: "project" },
    { id: "link-resume", group: "Links", label: "Résumé", href: resumeHref, icon: "resume" },
    { id: "link-email", group: "Links", label: "Email", hint: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
    { id: "link-github", group: "Links", label: "GitHub", hint: `@${profile.social.githubHandle}`, href: profile.social.github, icon: "github" },
    { id: "link-linkedin", group: "Links", label: "LinkedIn", href: profile.social.linkedin, icon: "linkedin" },
    { id: "link-playground", group: "Links", label: "Playground", hint: "Earlier PSP-inspired portfolio", href: profile.playground, icon: "playground" },
  ];
}
