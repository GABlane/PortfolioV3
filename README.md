# PortfolioV3 — John Gabrielle Ofiangga

Personal portfolio built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and Motion.
Apple-inspired "Light Glass" design.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm run start
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.com`) in production to enable canonical URLs,
the sitemap, and absolute Open Graph URLs.

## Editing content

All copy lives in `data/` — components never hard-code content.

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, links, phone, photo, résumé toggle, about text, milestones |
| `data/experience.ts` | NDA-safe experience copy, role titles, dates (exact dates still `null`) |
| `data/projects.ts` | Projects, case studies, implemented vs proposed features, media |
| `data/skills.ts` | "How I Build" expertise tiles and toolbelt |

- **Photo:** add `public/images/profile.webp`, then set `profile.photo = "/images/profile.webp"`.
- **Résumé:** add the PDF to `public/resume/`, set `profile.resume.href` and `available: true`.
  Until then, résumé links show a temporary "updated résumé on its way" page at `/resume`.
- **Eelio demo:** add `{ kind: "demo", label: "Live demo", href: "…" }` to Eelio's `links` once hosted.

## Confidentiality

`references/` holds private source material and is git-ignored. Never move anything from it into `public/`.
The Experience section follows `references/professional/CLAUDE_PORTFOLIO_INSTRUCTIONS.md`:
the employer is shown as "Confidential Technology Company" with no product, feature, or stack details.

## AI assistant ("Ask about Gab")

1. Put your Gemini key in `.env.local` (git-ignored): `GEMINI_API_KEY=...`
   (create one at https://aistudio.google.com/apikey). Optional: `GEMINI_MODEL`.
2. Restart `npm run dev`. The assistant appears only when a key is set.

The browser talks only to `/api/chat`; the key never leaves the server. Answers are grounded
on the same data the site renders (`lib/chat/knowledge.ts`), including the NDA rules.

### Security & cost controls

| Layer | Where |
| --- | --- |
| Same-origin + `x-portfolio-chat` header + JSON-only, 16 KB body cap | `app/api/chat/route.ts` |
| Strict validation (roles, ≤12 messages, ≤600 chars each), control chars stripped | `app/api/chat/route.ts` |
| Per-visitor limit (`CHAT_RATE_LIMIT_PER_IP`, default 12 / 10 min) + daily cap (`CHAT_DAILY_LIMIT`, default 500) | `lib/chat/rate-limit.ts` |
| Answer cache for identical first questions (6 h) | `lib/chat/store.ts` |
| 25 s timeout, 700-token output cap, temperature 0.4 | `lib/chat/config.ts` |
| Generic errors; logs never include visitor text; IPs hashed | route + `rate-limit.ts` |
| CSP, HSTS, frame-ancestors, Referrer-Policy, Permissions-Policy, nosniff | `next.config.ts` |

**For production:** limits and cache live in memory per server instance unless you add a shared
store — set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Upstash via the Vercel
Marketplace) and they become global automatically. Also consider a Vercel Firewall rate-limit rule
on `/api/chat`, and set a budget/quota alert on your Gemini key in Google AI Studio.
