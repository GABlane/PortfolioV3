import { BrainCircuit, Database, LayoutPanelTop, ServerCog } from "lucide-react";
import type { ExpertiseArea } from "./types";

export const expertise: ExpertiseArea[] = [
  {
    title: "Frontend Engineering",
    description: "Responsive interfaces with clear states, careful typography, and accessible interactions.",
    icon: LayoutPanelTop,
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Responsive UI"],
  },
  {
    title: "Backend Engineering",
    description: "APIs and services where the rules live in code, not in the client.",
    icon: ServerCog,
    items: ["NestJS", "FastAPI", "Laravel", "REST API design", "Authentication", "Business logic"],
  },
  {
    title: "Data and Architecture",
    description: "Modelling data so the application stays honest as features grow.",
    icon: Database,
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "Database modeling"],
  },
  {
    title: "AI and Integrations",
    description: "AI that reads and suggests, with validation and people deciding the outcome.",
    icon: BrainCircuit,
    items: [
      "Gemini API",
      "Local language models",
      "AI-assisted workflows",
      "External API integration",
      "Validation and automation",
    ],
  },
];

export const toolbelt = [
  "Python",
  "Java",
  "PHP",
  "React Native",
  "Expo",
  "Android",
  "SQLite",
  "Docker",
  "WebSockets",
  "Git & GitHub",
  "Postman",
  "Figma",
] as const;
