/**
 * Professional experience — NDA-safe.
 *
 * Source of truth: references/professional/PUBLIC_EXPERIENCE_COPY.md
 * Guardrails:     references/professional/CLAUDE_PORTFOLIO_INSTRUCTIONS.md
 *
 * Do NOT add the employer's name, product name, features, workflows, stack,
 * screenshots, or metrics here unless publication has been cleared in writing.
 */

export type ExperienceRole = {
  title: string;
  /** Public display label for dates. */
  displayDates: string;
  /** Exact dates — fill in once confirmed. Kept out of the UI while null. */
  startDate: string | null;
  endDate: string | null;
  datesConfirmed: boolean;
  description: string;
  current: boolean;
};

export type Experience = {
  employer: string;
  employerConfidential: boolean;
  /** Short line shown on the homepage. */
  headline: string;
  summary: string;
  roles: ExperienceRole[];
  highlights: string[];
  focusAreas: string[];
  disclosure: string;
};

export const experience: Experience = {
  employer: "Confidential Technology Company",
  employerConfidential: true,
  headline: "Professional Software Development",
  summary:
    "From internship to part-time development, I have worked on real software products across web, mobile, and backend engineering—turning requirements into implemented, integrated, and maintained application code.",
  roles: [
    {
      title: "Software Developer (Part-Time)",
      displayDates: "2026 – Present",
      startDate: null, // TODO: confirm transition date
      endDate: null,
      datesConfirmed: false,
      current: true,
      description:
        "I contribute to the development and maintenance of web and mobile software, working across frontend interfaces, backend services, and integrations. My responsibilities include implementing assigned features, improving existing code, resolving technical issues, and collaborating with a multidisciplinary product team.",
    },
    {
      title: "Software Development Intern",
      displayDates: "2026",
      startDate: null, // TODO: confirm internship dates
      endDate: null,
      datesConfirmed: false,
      current: false,
      description:
        "Supported product engineering work while gaining hands-on experience in frontend development, backend APIs, application integration, and collaborative engineering practices. Progressed into a part-time software development position.",
    },
  ],
  highlights: [
    "Developed and refined user interfaces for web and mobile applications.",
    "Implemented backend functionality and integrated application interfaces with APIs.",
    "Took ownership of assigned development work across implementation, debugging, and integration.",
    "Collaborated with other developers and product stakeholders to translate requirements into working software.",
    "Supported software quality through testing, issue investigation, code refinement, and deployment-related work.",
  ],
  focusAreas: [
    "Frontend interfaces",
    "Backend services",
    "API integration",
    "Debugging",
    "Testing",
    "Product iteration",
    "Team collaboration",
  ],
  disclosure: "Specific products, features, architecture, and implementation details are confidential.",
};
