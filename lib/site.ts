import { profile } from "@/data/profile";

/**
 * Production URL. Set NEXT_PUBLIC_SITE_URL once the domain is known
 * (e.g. https://gab.dev). On Vercel, the production URL is used as a fallback.
 */
// Empty values (e.g. a blank line in .env.local) count as "not set"
const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || undefined;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteUrl = explicitUrl || vercelUrl || "http://localhost:3000";

/** Only emit canonical URLs when a production domain was configured explicitly. */
export const hasCanonicalDomain = Boolean(explicitUrl);

export const siteTitle = `${profile.name} — ${profile.title}`;
export const siteDescription =
  "Portfolio of John Gabrielle “Gab” Ofiangga, a full-stack software developer in the Philippines building web applications, backend systems, mobile experiences, and practical AI integrations.";
