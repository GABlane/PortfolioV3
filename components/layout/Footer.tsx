import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navItems, profile } from "@/data/profile";
import { BrandMark } from "@/components/ui/BrandMark";
import { SoundToggle } from "@/components/ui/SoundToggle";

export function Footer() {
  const resumeHref = profile.resume.available ? profile.resume.href : "/resume";
  const elsewhere = [
    { label: "GitHub", href: profile.social.github },
    { label: "LinkedIn", href: profile.social.linkedin },
    { label: "Email", href: `mailto:${profile.email}` },
    { label: "Playground (PSP portfolio)", href: profile.playground },
  ];

  return (
    <footer className="relative mt-24 border-t border-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">
            <BrandMark size={28} />
            {profile.name}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-ink-2">
            {profile.title} based in {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-3">Sections</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={`/#${item.id}`} className="text-ink-2 hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/projects" className="text-ink-2 hover:text-ink">
                All projects
              </Link>
            </li>
            <li>
              <Link href={resumeHref} className="text-ink-2 hover:text-ink">
                Resume
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="flex flex-col gap-2 text-sm">
            {elsewhere.map((link) => {
              const web = link.href.startsWith("http");
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex items-center gap-1 text-ink-2 hover:text-ink"
                  >
                    {link.label}
                    {web && <ArrowUpRight className="size-3.5 opacity-60" aria-hidden />}
                    {web && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 pb-32 text-xs md:pb-10 text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© 2026 {profile.name}</span>
          <SoundToggle />
        </p>
        <p>Designed and built with Next.js, TypeScript, and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
