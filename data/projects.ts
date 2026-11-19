import type { Project } from "./types";
import freshlyHome from "@/public/projects/freshly/home.webp";
import freshlyHomeCrop from "@/public/projects/freshly/home-crop.webp";
import eelioMascot from "@/public/projects/eelio/mascot.webp";
import eelioSlide1 from "@/public/projects/eelio/slide-1.webp";
import eelioSlide2 from "@/public/projects/eelio/slide-2.webp";
import eelioSlide3 from "@/public/projects/eelio/slide-3.webp";
import smartvaultDemo from "@/public/projects/smartvault/unlock-demo.webp";

/**
 * Project content. Sources: the project READMEs on GitHub, the Eelio pitch deck,
 * the KuryenteKo concept brief, and the KilosWatt proposal.
 *
 * Rules kept here:
 * - Implemented vs proposed features are labelled explicitly.
 * - Illustrations are labelled as illustrations; no invented screenshots.
 * - No invented metrics, awards, adoption, or dates.
 */

export const projects: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "bentabuddy",
    name: "BentaBuddy",
    category: "Applied AI / Full-Stack Development",
    tagline:
      "A local-first AI business assistant that turns customer conversations into structured, owner-reviewed orders and bookings.",
    summary:
      "Filipino small businesses that sell through Facebook Pages take orders inside chat threads. BentaBuddy reads those conversations with a language model running on the owner's own computer, drafts a structured order or booking, and waits for the owner to approve it before anything enters the workflow.",
    featured: true,
    order: 1,
    team: "Hackathon project",
    period: "2026",
    tech: ["React", "TypeScript", "Vite", "Python", "FastAPI", "SQLite", "Qwen3 (local)", "llama.cpp"],
    links: [{ kind: "github", label: "GitHub", href: "https://github.com/GABlane/BentaBuddy" }],
    brand: {
      surface: "linear-gradient(160deg,#fff7ec 0%,#ffeeda 100%)",
      primary: "#e07a1f",
      secondary: "#2f6b4f",
      ink: "#2b1a0b",
    },
    preview: "bentabuddy",
    gallery: [],
    caseStudy: {
      problem: [
        "For sellers who take orders through Facebook Pages, the conversation is the order form. Customers write in Taglish, change quantities, move pickup times, and add details across several messages.",
        "The owner has to reconstruct the latest version of each request while also preparing goods or serving customers—which makes copying mistakes and missed corrections easy.",
      ],
      role: [
        "Built the application across the React frontend, the FastAPI backend, and the local-inference integration.",
        "Designed the review-first workflow: the model proposes, the application validates, and the owner approves.",
      ],
      solution: [
        "New Page messages (or pasted conversations) are read by a local model against the active business catalog. The model returns schema-constrained JSON: items, quantities, schedule, fulfillment details, clarification questions, and the source excerpts it relied on.",
        "Application code then validates every field and computes everything that has to be exact—prices, dozen conversions, nights, booking conflicts, and analytics—before the owner sees a draft to edit and approve.",
      ],
      features: [
        { title: "Conversation interpretation", description: "Reads Taglish messages and applies later corrections, e.g. “2 dozen bukas, 8am” then “gawin na lang 3 dozen, 9am” becomes 36 pieces at 9am.", status: "implemented" },
        { title: "Structured order drafts", description: "Drafts include supporting message excerpts and clarification questions instead of silent guesses.", status: "implemented" },
        { title: "Business-specific catalogs", description: "Bakery, gadget shop, staycation, and general product or service modes, each with its own catalog and fulfillment board.", status: "implemented" },
        { title: "Owner approval workflow", description: "Nothing affects orders, bookings, or schedules until the owner reviews and approves the draft.", status: "implemented" },
        { title: "Order and booking management", description: "Revisions, filters, CSV export, activity history, manual payment recording, and transactional booking-overlap checks.", status: "implemented" },
        { title: "Local AI inference", description: "Qwen3-4B-Instruct runs through llama.cpp on the owner's machine. No cloud AI API is used.", status: "implemented" },
        { title: "Human-in-the-loop validation", description: "Invalid or incomplete model output fails visibly rather than being patched over.", status: "implemented" },
      ],
      architecture: [
        { name: "Interface", detail: "Responsive web app, also opened from a phone over the local network", tech: ["React 19", "TypeScript", "Vite"] },
        { name: "API & rules", detail: "Validation, workflows, pricing, conflicts, analytics", tech: ["Python", "FastAPI", "Pydantic"] },
        { name: "Local inference", detail: "Schema-constrained JSON extraction on the owner's computer", tech: ["Qwen3-4B-Instruct (Q4_K_M)", "llama.cpp", "Ollama (optional)"] },
        { name: "Storage", detail: "Catalogs, conversations, customers, orders, payments, events", tech: ["SQLite"] },
        { name: "Messaging", detail: "Webhook-only relay for incoming Page messages", tech: ["Messenger webhooks", "cloudflared"] },
      ],
      architectureNote: "The web app, database, and model run on the owner's computer. Only the webhook route is exposed through the tunnel.",
      decisions: [
        { title: "The model interprets; code decides", body: "The language model only reads and proposes. Catalog IDs, units, quantities, dates, and quoted source excerpts are validated in code, and all arithmetic happens in code—so a confident-sounding model answer can never set a price." },
        { title: "Local-first by design", body: "Running inference locally avoids sending customer conversations to another cloud AI provider and keeps extraction, review, and order management working offline after setup." },
        { title: "Fail visibly, never silently", body: "Repeated item lines ask for clarification instead of inflating totals, and stale proposals are rejected. There is no cloud fallback that could quietly change behaviour." },
        { title: "A pretrained model, used carefully", body: "The model was not trained or fine-tuned for this project. Reliability comes from task instructions, schema-constrained output, bounded context, and validation." },
      ],
      outcomes: [
        "Working prototype covering conversation intake, local extraction, owner review, fulfillment boards, customers, and analytics across four business types.",
        "Per the project README (Oct 10, 2026): 87 automated tests and the production build pass, plus separate real local-model checks on fictional data.",
      ],
      limitations: [
        "Single-owner prototype: no sign-in or multi-shop isolation.",
        "New Messenger messages need internet; public customer access depends on Meta permissions and approval.",
        "No payment verification, courier integration, or inventory forecasting. Customer payment claims are not treated as verified.",
        "The bundled setup targets Apple silicon; other platforms need their own local runtime.",
      ],
    },
    notice: "No real customer adoption or business savings are claimed. Demo records are fictional.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "freshly",
    name: "Freshly",
    alias: "FRESHVII",
    category: "AI Integration / Sustainability / PWA",
    tagline:
      "A mobile-first food inventory PWA that helps households waste less with freshness estimates, AI food scanning, and recipe suggestions.",
    summary:
      "Developed during a hackathon, Freshly keeps a live inventory of a household's fridge, freezer, and pantry, estimates how fresh each item is, and turns what needs eating first into rescue plans and recipe ideas.",
    featured: true,
    order: 2,
    context: "Seventh Stack AppCon hackathon project",
    team: "Team project · Team lead",
    period: "2026",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Firebase Auth", "Cloud Firestore", "Gemini API", "PWA"],
    links: [
      { kind: "demo", label: "Live demo", href: "https://seventh-stack-freshly.vercel.app" },
      { kind: "github", label: "GitHub", href: "https://github.com/GABlane/Seventh-Stack-Freshly" },
    ],
    brand: {
      surface: "linear-gradient(160deg,#ecf9fd 0%,#dff3fb 100%)",
      primary: "#1aa7c4",
      secondary: "#f0a43a",
      ink: "#123440",
    },
    preview: "freshly",
    cover: {
      src: freshlyHomeCrop,
      alt: "Freshly home screen showing a kitchen summary bar, food search, and Fridge, Freezer, and Pantry tabs.",
      kind: "screenshot",
    },
    gallery: [
      {
        src: freshlyHome,
        alt: "Freshly home screen on desktop: greeting, kitchen freshness summary, search, storage tabs, and bottom navigation.",
        kind: "screenshot",
        caption: "Home — kitchen summary, search, and storage tabs",
      },
    ],
    caseStudy: {
      problem: [
        "Households buy food they don't finish. Items get pushed to the back of the fridge, opened food is forgotten, and nobody remembers what is in the pantry.",
        "It is a visibility and timing problem: people don't know what they have, what is about to expire, or what they could cook with it.",
      ],
      role: [
        "Led the hackathon team and was involved in full-stack development of the app.",
      ],
      solution: [
        "See it: food is shown on virtual fridge, freezer, and pantry shelves. Time it: every item gets an estimated expiry and freshness state, so the most urgent food rises to the top.",
        "Use it: a Rescue view and recipe suggestions are built from what's already at home. Measure it: consumption and discards are logged so Insights shows what is actually used and wasted.",
      ],
      features: [
        { title: "Fridge, freezer, and pantry", description: "Illustrated shelves with named positions; each item links to its detail page.", status: "implemented" },
        { title: "Food inventory management", description: "Open, freeze, move, consume a quantity, or discard. Every change is logged as an activity event.", status: "implemented" },
        { title: "AI-assisted food scanning", description: "Photograph one or several items; Gemini returns typed JSON that pre-fills the form or a review list.", status: "implemented" },
        { title: "Freshness estimates", description: "Deterministic shelf-life rules by category, storage, and opened state—clearly labelled as estimates.", status: "implemented" },
        { title: "Rescue suggestions", description: "Food to use today or soon, plus an on-demand AI rescue plan with practical steps.", status: "implemented" },
        { title: "Food waste insights", description: "Wasted vs. saved, most-wasted categories, weekly recap, and a pre-grocery checklist.", status: "implemented" },
        { title: "Recipe recommendations", description: "Recipes ranked by how much urgent food they use, with a step-through cooking flow that updates stock.", status: "implemented" },
      ],
      architecture: [
        { name: "Pages & layouts", detail: "Mobile-first UI, installable as a PWA", tech: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Radix UI"] },
        { name: "State", detail: "Context providers with real-time listeners", tech: ["React Context"] },
        { name: "Domain logic", detail: "Pure functions for freshness, rescue matching, lifecycle, and impact", tech: ["TypeScript"] },
        { name: "Data & auth", detail: "Per-user items and an append-only activity log", tech: ["Firebase Auth", "Cloud Firestore"] },
        { name: "AI functions", detail: "Server-side calls for photo scanning and rescue plans", tech: ["Vercel Functions", "Gemini API"] },
      ],
      architectureNote: "The Gemini key stays in a server-side function; the browser never sees it.",
      decisions: [
        { title: "Freshness is rules, not AI", body: "Expiry estimates come from simple shelf-life tables (category × closed/opened/frozen). The model is explicitly told not to estimate exact expiry dates." },
        { title: "Typed AI output with guardrails", body: "Scans use a JSON schema, low-confidence guesses are dropped or flagged, and the rescue endpoint discards any “used item” that wasn't in the request—so the AI can't invent ingredients." },
        { title: "Small, fast uploads", body: "Photos are resized to 1024px and re-encoded in the browser before upload, keeping scans quick without losing the detail needed to separate multiple items." },
        { title: "Append-only activity log", body: "Insights are computed from immutable events, and security rules prevent users from editing or deleting history." },
      ],
      outcomes: [
        "A deployed, working PWA with sign-up, inventory, AI scanning, rescue plans, recipes, and insights.",
      ],
      limitations: [
        "Expiry dates are estimates. Quantities aren't converted to a common weight, and no environmental impact (e.g. CO₂) is estimated.",
        "AI suggestions can be wrong; the app reminds users of this on the Rescue page.",
      ],
    },
    notice: "No competition ranking or production usage metrics are claimed.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "eelio",
    name: "Eelio",
    category: "UI/UX / Product Design / EnergyTech",
    tagline:
      "A mobile-first concept that explains why a household's electricity bill changed—to the peso—and helps it use less next month.",
    summary:
      "Built for Challenge #2 of the Meralco IDOL Hackathon 2026, “Know Your Bill, Manage Your Usage.” Eelio combines two earlier team concepts—KuryenteKo and KilosWatt—into one product: understand your own bill line by line, then save with missions that reward measured savings.",
    featured: true,
    order: 3,
    context: "Meralco IDOL Hackathon 2026 · Challenge #2 · One of 14 participating teams",
    team: "Team LarpItOut · University of Caloocan City",
    period: "2026",
    tech: ["UI/UX design", "Product planning", "Mobile-first PWA", "OCR workflow design"],
    links: [],
    brand: {
      surface: "linear-gradient(160deg,#fdf1e7 0%,#fbe6d6 100%)",
      primary: "#c4510d",
      secondary: "#13716a",
      ink: "#211a14",
    },
    preview: "eelio",
    cover: {
      src: eelioMascot,
      transparent: true,
      alt: "Eelio's mascot: a friendly blue eel wearing an orange cap with a lightning bolt and an orange vest.",
      kind: "pitch-deck",
    },
    gallery: [
      {
        src: eelioSlide1,
        alt: "Pitch slide: “Why is my bill like this?” with four problems—the bill shows what not why, no one knows the cause, no way to check it, saving has no payoff.",
        kind: "pitch-deck",
        caption: "The problem — from the team pitch deck",
      },
      {
        src: eelioSlide2,
        alt: "Pitch slide introducing Eelio: a phone-first app that tells a household why its bill changed, with the eel mascot.",
        kind: "pitch-deck",
        caption: "Meet Eelio — from the team pitch deck",
      },
      {
        src: eelioSlide3,
        alt: "Pitch slide of six proposed features: Scan & link, Bill Wrapped, Ask about a charge, 5% Missions, Points & Rewards, Leaderboards.",
        kind: "pitch-deck",
        caption: "Proposed features — from the team pitch deck",
      },
    ],
    caseStudy: {
      problem: [
        "The bill shows what, not why: one peso total, with nothing that says which charges a household controls or that generation and transmission are pass-through.",
        "No one knows the cause—rate, more billing days, hotter weather, or household usage—so households guess, blame Meralco, or call the hotline. They have no basis to check whether a charge is right.",
        "And “save electricity” says nothing about which change matters, with nothing rewarding the effort.",
      ],
      role: [
        "Developed the application's UI/UX.",
        "Planned the bill-scanning workflow.",
        "Helped plan features for the unified experience and shaped how features from the two original proposals fit together.",
      ],
      solution: [
        "Eelio explains the household's own bill, not bills in general. Each charge shows its share of the bill and who receives it: the grid, Meralco, government, or subsidies.",
        "Saving is rewarded on measured results: points come from the kWh a home actually saves, not from self-reports.",
      ],
      features: [
        { title: "Scan & link", description: "Snap the latest bill; AI reads it, links the household by account number, and loads 12 months of history.", status: "proposed" },
        { title: "Bill Wrapped", description: "A five-story recap that ranks what moved the bill: rate, billing days, weather, household usage.", status: "proposed" },
        { title: "Ask about a charge", description: "Tap any charge line and ask why it moved; answers use its own figures and the official bill guide.", status: "proposed" },
        { title: "5% Missions", description: "Pick appliances and one routine to get up to five missions that cut about 5%.", status: "proposed" },
        { title: "Points & Rewards", description: "Earn points for kWh actually saved, then spend them in a rewards shop.", status: "proposed" },
        { title: "Leaderboards", description: "See how a home and its barangay rank by kWh saved.", status: "proposed" },
      ],
      architecture: [],
      decisions: [
        { title: "One product, not two pitches", body: "KuryenteKo answered “why is my bill like this?”; KilosWatt answered “how do I use less?”. Merging them gave Challenge #2 a single loop: understand the bill, then act on it." },
        { title: "AI reads, code decides", body: "A rule carried over from the original concepts: the AI explains figures the system already computed. It never invents a number, and points come only from measured data." },
        { title: "Bill scanning as the front door", body: "The scan-and-link flow had to make a photo of a paper bill the start of everything—reading it, linking the account, and loading history before any explanation appears." },
        { title: "Plain language first", body: "Peso amounts instead of kWh where possible, one clear answer before detail, and Tagalog or English explanations." },
      ],
      outcomes: [
        "Competed as one of 14 participating teams in the Meralco IDOL Hackathon 2026.",
        "A unified product concept, brand, and mascot, with the bill-scanning flow and app UI designed for the pitch.",
      ],
      limitations: [
        "Features above are from the pitch and are shown as proposed, not as a shipped product.",
        "The hosted build is still being prepared; a demo link will be added when it is live.",
      ],
    },
    notice: "Features are labelled as proposed. Team contributions are shared; OCR and AI inference are not claimed as personal implementation.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "smartvault",
    name: "SmartVault",
    category: "IoT / Backend Engineering / Mobile",
    tagline:
      "An IoT-connected smart vault prototype with PIN and biometric unlocking, a mobile app, backend APIs, and real-time communication.",
    summary:
      "SmartVault connects a physical vault to a mobile app and a backend service that handles secure access workflows, vault state, and real-time coordination between mobile, web, and hardware clients.",
    featured: true,
    order: 4,
    team: "Team project",
    period: null,
    tech: ["React Native", "Python", "FastAPI", "PostgreSQL", "Redis", "WebSockets", "Docker"],
    links: [{ kind: "github", label: "Backend on GitHub", href: "https://github.com/GABlane/smartvault-backend" }],
    brand: {
      surface: "linear-gradient(160deg,#121417 0%,#07080a 100%)",
      primary: "#c8f43a",
      secondary: "#8a8f98",
      ink: "#f4f6f8",
      dark: true,
    },
    preview: "smartvault",
    cover: {
      src: smartvaultDemo,
      alt: "Split view: the SmartVault mobile app's PIN unlock dialog with a lime Unlock button, next to the physical vault being opened with its keypad.",
      kind: "demo-capture",
    },
    gallery: [
      {
        src: smartvaultDemo,
        alt: "The SmartVault app's unlock dialog (vault PIN field, face or fingerprint option, Unlock button) beside the physical vault's keypad.",
        kind: "demo-capture",
        caption: "App unlock flow beside the physical prototype",
      },
    ],
    caseStudy: {
      problem: [
        "A connected vault has to coordinate a phone, a backend, and hardware in real time—while treating every unlock attempt as a security event.",
      ],
      role: [
        "Worked on the backend architecture and the integration between the mobile app, the API, and the vault hardware.",
      ],
      roleNeedsConfirmation: true,
      solution: [
        "A FastAPI service, refactored around Clean Architecture, owns access control and vault state. The mobile app talks to it over REST and WebSockets, so unlocks and state changes reach every connected client in real time.",
      ],
      features: [
        { title: "PIN-based unlocking", description: "Hashed PIN validation with lockout after repeated failures.", status: "implemented" },
        { title: "Biometric authentication", description: "Face recognition integration alongside the PIN flow.", status: "implemented" },
        { title: "Real-time communication", description: "WebSocket channels keep the app, web, and hardware in sync.", status: "implemented" },
        { title: "Mobile app", description: "React Native app for unlocking and monitoring the vault.", status: "implemented" },
        { title: "Observability", description: "Metrics, structured logs with sensitive-field redaction, and health checks.", status: "implemented" },
      ],
      architecture: [
        { name: "API layer", detail: "HTTP endpoints, WebSocket handlers, validation, dependency injection", tech: ["FastAPI"] },
        { name: "Application layer", detail: "Use cases, services, and ports", tech: ["Python"] },
        { name: "Domain layer", detail: "Users, vaults, access logs, PIN and status value objects", tech: ["Pure Python"] },
        { name: "Infrastructure", detail: "Repositories, cache and rate limiting, biometrics, notifications", tech: ["PostgreSQL", "SQLAlchemy", "Alembic", "Redis"] },
        { name: "Runtime", detail: "Containerised services with metrics and error tracking", tech: ["Docker Compose", "Prometheus", "Grafana", "Sentry"] },
      ],
      architectureNote: "Dependency rule: inner layers know nothing about outer layers. The domain has no infrastructure dependencies.",
      decisions: [
        { title: "Clean Architecture refactor", body: "Separating domain rules from FastAPI, the database, and Redis made the security-critical logic testable in isolation with in-memory fakes." },
        { title: "Security events are first-class", body: "PIN lockouts, authentication failures, and unlock operations are tracked explicitly, and logs redact PINs, passwords, and tokens." },
        { title: "Real-time over polling", body: "WebSockets push vault state changes to clients instead of having each device poll the API." },
      ],
      outcomes: [
        "A working prototype: the mobile app unlocking the physical vault, backed by the API.",
      ],
      limitations: [
        "A student project and prototype—not a certified or audited security product.",
      ],
    },
    notice: "SmartVault is a prototype and is not presented as a certified security product.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "freshguide",
    name: "FreshGuide",
    category: "Android / Full-Stack Development",
    tagline:
      "A campus navigation app for the University of Caloocan City with room discovery, directions, class schedules, and offline data.",
    summary:
      "FreshGuide helps students find buildings and rooms, follow directions, and manage class schedules—online or offline—while administrators manage and publish campus data from a Laravel backend.",
    featured: false,
    order: 5,
    team: "Team project",
    period: "2026",
    tech: ["Java", "Android", "MVVM", "Room", "Retrofit", "Laravel", "MySQL"],
    links: [
      { kind: "github", label: "Android app", href: "https://github.com/GABlane/Fresh_Guide" },
      { kind: "github", label: "Backend", href: "https://github.com/GABlane/Fresh_Guide_BackEnd" },
    ],
    brand: {
      surface: "linear-gradient(160deg,#f2fbf0 0%,#fff6e3 100%)",
      primary: "#1da61d",
      secondary: "#f5a300",
      ink: "#14301a",
    },
    preview: "freshguide",
    gallery: [],
    caseStudy: {
      problem: [
        "New students lose time finding buildings, floors, and rooms—and campus information isn't always reachable when the connection is poor.",
      ],
      role: [
        "Built the Laravel backend and admin API, and contributed to the Android app.",
      ],
      roleNeedsConfirmation: true,
      solution: [
        "Students search rooms, view details and facilities, follow step-by-step directions, and keep a class schedule. Administrators manage buildings, floors, rooms, facilities, and routes, then publish a data version that the app syncs for offline use.",
      ],
      features: [
        { title: "Room and building discovery", description: "Search and browse campus locations with facilities and details.", status: "implemented" },
        { title: "Directions", description: "Route steps with visualisation from defined campus origins.", status: "implemented" },
        { title: "Class schedules", description: "Schedule management with reminders.", status: "implemented" },
        { title: "Offline access", description: "Campus data is synced from the backend and stored locally.", status: "implemented" },
        { title: "Admin management", description: "CRUD for buildings, floors, rooms, facilities, origins, and routes, plus publishing.", status: "implemented" },
        { title: "QR room lookup", description: "Scan a QR code for quick room access.", status: "implemented" },
      ],
      architecture: [
        { name: "Android app", detail: "MVVM with repositories", tech: ["Java", "Material Design 3", "Navigation"] },
        { name: "Local data", detail: "Offline campus data and schedules", tech: ["Room"] },
        { name: "Networking", detail: "Typed API client with token injection", tech: ["Retrofit", "OkHttp"] },
        { name: "Backend", detail: "Admin CRUD, publishing, and a public sync API", tech: ["Laravel", "MySQL"] },
      ],
      decisions: [
        { title: "Publish, then sync", body: "Admins publish versioned campus data; the app checks the latest version and pulls a full bootstrap payload, keeping offline data consistent." },
      ],
      outcomes: ["A working Android app and Laravel backend for campus navigation."],
      limitations: ["Built for the University of Caloocan City campus data."],
    },
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);

export const secondaryProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 2): Project[] {
  const ordered = [...projects].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((p) => p.slug === slug);
  const others = ordered.filter((p) => p.slug !== slug);
  if (index < 0) return others.slice(0, count);
  // Prefer the next projects in order, wrapping around.
  return [...others.slice(index), ...others.slice(0, index)].slice(0, count);
}

/** Concept evolution data for Eelio's case study. */
export const eelioEvolution = {
  sources: [
    {
      name: "KuryenteKo",
      question: "“Bakit ganito?” — why is my bill like this?",
      focus: "Understand the bill",
      points: [
        "Bill scan with OCR",
        "Plain-language bill explanations",
        "Meter check against the bill",
        "Tap-to-explain charge lines",
        "Forecasts and heat-wave alerts",
      ],
    },
    {
      name: "KilosWatt",
      question: "“How do we use less?”",
      focus: "Conserve and get rewarded",
      points: [
        "Gamified peak-hour missions",
        "AI mission coach",
        "Points and rewards",
        "Family and barangay leaderboards",
        "Savings shown in pesos",
      ],
    },
  ],
  result: {
    name: "Eelio",
    meaning: [
      { part: "Eel", gloss: "nature's living battery" },
      { part: "Elio", gloss: "light and clarity" },
      { part: "-io", gloss: "made for you" },
    ],
    points: ["Scan & link", "Bill Wrapped", "Ask about a charge", "5% Missions", "Points & Rewards", "Leaderboards"],
  },
} as const;
