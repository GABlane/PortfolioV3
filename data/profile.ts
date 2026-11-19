/**
 * Single source of truth for personal details and site-wide links.
 * Edit here; components read from this file.
 */

export const profile = {
  name: "John Gabrielle Ofiangga",
  preferredName: "Gab",
  initials: "GO",
  title: "Full-Stack Software Developer",
  location: "Caloocan City, Philippines",
  locationShort: "Philippines",

  positioning: "I build software that turns complex ideas into polished digital products.",
  secondaryPositioning:
    "Full-stack developer working across web applications, backend systems, mobile experiences, and practical AI integrations.",
  intro:
    "I'm John Gabrielle Ofiangga, a full-stack software developer working across modern web applications, backend services, and AI-powered systems. I care about reliable engineering and thoughtful user experiences.",

  email: "johngabrielleofiangga@gmail.com",
  phone: {
    display: "+63 995 726 9441",
    href: "tel:+639957269441",
  },

  /**
   * Profile photo — Gab's face inside a bubble (cut out from the original in references/originals/).
   * Used for the desktop hero and the phone profile avatar. Set to null to show the styled placeholder.
   */
  photo: "/images/profile-bubble.webp" as string | null,
  /**
   * Empty iridescent bubble (cleaned from references/originals/bubble.png).
   * Used for the phone tab bar's "You" icon.
   */
  bubbleArt: "/images/profile-bubble-clean.webp" as string | null,

  social: {
    github: "https://github.com/GABlane",
    githubHandle: "GABlane",
    linkedin: "https://www.linkedin.com/in/john-gabrielle-ofiangga-b53356334/",
  },

  /** The previous PSP-inspired interactive portfolio. */
  playground: "https://ofiangga-portfolio.vercel.app",

  /**
   * Résumé. The June 2026 résumé is outdated and intentionally NOT published.
   * When an updated PDF is ready: place it at /public/resume/<file>.pdf,
   * set `href` to that path and `available` to true.
   */
  resume: {
    available: false,
    href: "/resume/John-Gabrielle-Ofiangga-Resume.pdf",
    updated: null as string | null,
  },

  education: {
    degree: "Bachelor of Science in Computer Science",
    school: "University of Caloocan City",
    period: "2023 – Present",
  },
} as const;

/**
 * Every résumé link on the site reads from here.
 * Until an updated PDF is published (profile.resume.available = true), links
 * become a "Request Resume" email instead of pointing at a placeholder page.
 */
export const resumeLink = profile.resume.available
  ? { href: profile.resume.href, label: "View Resume", short: "Resume", detail: "Download PDF" }
  : {
      href: `mailto:${profile.email}?subject=${encodeURIComponent("Resume request")}`,
      label: "Request Resume",
      short: "Resume",
      detail: "Request by email",
    };

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "expertise", label: "Expertise" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];



/**
 * Hero introduction, written in a short, conversational rhythm with inline chips.
 * Every claim maps to the brief: full-stack work, web + mobile + backend, AI
 * integrations, part-time developer role, BS Computer Science.
 */
export type IntroIcon = "code" | "web" | "mobile" | "server" | "ai" | "work" | "study" | "idea";
/** `after` is punctuation that must stay on the same line as its chip. */
export type IntroPart = { text: string } | { chip: string; icon: IntroIcon; after?: string };

export const heroIntro: IntroPart[][] = [
  [
    { text: "I'm Gab, a " },
    { chip: "full-stack", icon: "code" },
    { text: " developer. I build web and mobile apps and the backend services behind them, and lately I've been focused on " },
    { chip: "practical AI", icon: "ai", after: "." },
  ],
  [
    { text: "Right now I'm a " },
    { chip: "part-time developer", icon: "work" },
    { text: " while studying Computer Science. I like turning complex ideas into polished digital products." },
  ],
];

/** Factual credentials shown under the hero. No invented metrics. */
export const heroHighlights = [
  { icon: "work", title: "Software Developer", detail: "Part-time · 2026 – Present" },
  { icon: "build", title: "Latest build: BentaBuddy", detail: "Local-first AI · 2026" },
  { icon: "bolt", title: "Meralco IDOL Hackathon", detail: "2026 · Team LarpItOut" },
] as const;

export const about = {
  title: "Beyond the Code",
  paragraphs: [
    "I am currently pursuing a Bachelor of Science in Computer Science at the University of Caloocan City while building professional software development experience.",
    "I enjoy turning ideas into functional products and exploring the intersection of software engineering, product design, and emerging technologies. Hackathons are where I test that most often: small teams, tight deadlines, and a real problem worth explaining well.",
  ],
  /** Grouped by relationship: what I studied, what I was recognised for, where I led. */
  groups: [
    {
      label: "Education",
      items: [
        {
          title: "BS Computer Science",
          detail: "University of Caloocan City",
          date: "2023 – Present",
        },
      ],
    },
    {
      label: "Recognition",
      items: [
        {
          title: "1st Place, University C Programming Competition",
          detail: "University of Caloocan City",
          date: "Feb 2023",
        },
        {
          title: "Meralco IDOL Hackathon 2026",
          detail: "Team LarpItOut · one of 14 participating teams",
          date: "2026",
        },
      ],
    },
    {
      label: "Leadership",
      items: [
        {
          title: "BSCS Representative",
          detail: "Department of Liberal Arts and Sciences (CLAS)",
          date: "2023 – 2025",
        },
      ],
    },
  ],
} as const;
