import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

export type ExternalLink = {
  label: string;
  href: string;
};

export type ProjectLinkKind = "github" | "demo" | "case-study";

export type ProjectLink = {
  kind: ProjectLinkKind;
  label: string;
  href: string;
};

/** How a project preview should be labelled so illustrations are never mistaken for screenshots. */
export type MediaKind = "screenshot" | "demo-capture" | "pitch-deck" | "illustration";

export type ProjectMedia = {
  /** Static import: dimensions and a blur placeholder come for free. */
  src: StaticImageData;
  alt: string;
  kind: MediaKind;
  caption?: string;
  /** Transparent artwork (e.g. a mascot) should not show a blurred placeholder. */
  transparent?: boolean;
};

export type FeatureStatus = "implemented" | "proposed";

export type ProjectFeature = {
  title: string;
  description: string;
  status: FeatureStatus;
};

export type ArchitectureLayer = {
  name: string;
  detail: string;
  tech: string[];
};

export type ProjectBrand = {
  /** Surface used behind previews */
  surface: string;
  /** Primary brand color */
  primary: string;
  /** Secondary brand color */
  secondary: string;
  /** Text color that reads on `surface` */
  ink: string;
  /** Whether the brand surface is dark */
  dark?: boolean;
};

export type PreviewVariant = "bentabuddy" | "freshly" | "eelio" | "smartvault" | "freshguide";

export type Project = {
  slug: string;
  name: string;
  /** Alternate or formal name, e.g. FRESHVII */
  alias?: string;
  category: string;
  /** One sentence for cards */
  tagline: string;
  /** Short paragraph for the case-study header */
  summary: string;
  featured: boolean;
  order: number;
  context?: string;
  /** "Solo project", "Team project", etc. */
  team: string;
  /** Year or period. Keep null if unconfirmed. */
  period: string | null;
  tech: string[];
  links: ProjectLink[];
  brand: ProjectBrand;
  preview: PreviewVariant;
  cover?: ProjectMedia;
  gallery: ProjectMedia[];
  caseStudy: {
    problem: string[];
    role: string[];
    /** Set true when the role wording still needs the owner's confirmation. */
    roleNeedsConfirmation?: boolean;
    solution: string[];
    features: ProjectFeature[];
    architecture: ArchitectureLayer[];
    architectureNote?: string;
    decisions: { title: string; body: string }[];
    outcomes: string[];
    limitations: string[];
  };
  notice?: string;
};

export type ExpertiseArea = {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
};
