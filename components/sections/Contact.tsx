import Link from "next/link";
import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/motion/AnimatedSection";
import { LightSphere } from "@/components/layout/AmbientBackground";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  const resumeHref = profile.resume.available ? profile.resume.href : "/resume";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="relative">
        {/* Light behind the panel */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <LightSphere tone="blue" className="-top-12 left-[6%] size-48 sm:size-64" />
          <LightSphere tone="lavender" className="right-[4%] -bottom-14 size-40 sm:size-56" />
          <div className="orb -inset-16" style={{ ["--orb-color" as string]: "rgba(186,214,255,0.5)" }} />
        </div>

        <div className="glass glass-strong relative overflow-hidden rounded-[var(--radius-panel)] px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="eyebrow">05 — Contact</p>
            <h2
              id="contact-title"
              className="mt-5 text-balance text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-ink"
            >
              Let&apos;s build something meaningful.
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-[1.0625rem] leading-relaxed text-ink-2">
              Have a project, opportunity, or interesting engineering problem? I&apos;d love to connect.
            </p>

            {/* Direct contact: one primary action, with its alternatives right beside it */}
            <div className="mt-9 flex flex-col items-center" role="group" aria-label="Direct contact">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-primary press inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.98rem] font-medium"
                >
                  <Mail className="size-4" aria-hidden />
                  Email me
                </a>
                <CopyEmail email={profile.email} />
              </div>
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ink-3">
                <span className="break-all">{profile.email}</span>
                <span aria-hidden className="text-ink/20">·</span>
                <a
                  href={profile.phone.href}
                  className="inline-flex min-h-8 items-center gap-1.5 text-ink-2 underline-offset-4 hover:text-ink hover:underline"
                >
                  <Phone className="size-3.5" aria-hidden />
                  {profile.phone.display}
                </a>
              </p>
            </div>
          </div>

          {/* Profiles & documents: places to learn more */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-ink/[0.07]" />
              <h3 className="eyebrow">Profiles &amp; résumé</h3>
              <span className="h-px flex-1 bg-ink/[0.07]" />
            </div>
            <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
              <ContactTile
                href={profile.social.github}
                icon={<GitHubIcon className="size-5" />}
                label="GitHub"
                detail={`@${profile.social.githubHandle}`}
              />
              <ContactTile
                href={profile.social.linkedin}
                icon={<LinkedInIcon className="size-5" />}
                label="LinkedIn"
                detail="Connect"
              />
              <ContactTile
                href={resumeHref}
                icon={<FileText className="size-5" />}
                label="Résumé"
                detail={profile.resume.available ? "Download PDF" : "Updating"}
                internal
              />
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactTile({
  href,
  icon,
  label,
  detail,
  internal,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  detail: string;
  internal?: boolean;
}) {
  const web = href.startsWith("http");
  const className =
    "fill-inset fill-interactive press group flex h-full min-h-[92px] flex-col justify-between gap-3 rounded-[22px] p-4 text-left";
  const body = (
    <>
      <span className="flex items-center justify-between text-ink-2 group-hover:text-ink">
        {icon}
        {web && <ArrowUpRight className="size-4 opacity-50" aria-hidden />}
      </span>
      <span>
        <span className="block text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">{label}</span>
        <span className="block truncate text-[0.8rem] text-ink-3">{detail}</span>
      </span>
      {web && <span className="sr-only">(opens in a new tab)</span>}
    </>
  );
  return (
    <li>
      {internal ? (
        <Link href={href} className={className}>
          {body}
        </Link>
      ) : (
        <a href={href} className={className} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {body}
        </a>
      )}
    </li>
  );
}
