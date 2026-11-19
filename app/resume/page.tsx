import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FileClock, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GlassButton } from "@/components/glass/GlassButton";
import { LinkedInIcon } from "@/components/ui/BrandIcons";
import { Glow } from "@/components/layout/AmbientBackground";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.title}.`,
  robots: { index: false, follow: true },
};

/**
 * Temporary résumé state. When `profile.resume.available` is true this route
 * forwards to the PDF, so existing links keep working.
 */
export default function ResumePage() {
  if (profile.resume.available) redirect(profile.resume.href);

  return (
    <section className="relative mx-auto flex max-w-3xl flex-col px-4 pt-36 pb-16 sm:px-6 sm:pt-44">
      <Glow className="top-24 -left-20" color="rgba(79,140,255,0.28)" size="26rem" />
      <Glow className="right-0 bottom-0" color="rgba(170,150,255,0.24)" size="24rem" />
      <div className="glass glass-strong relative rounded-[var(--radius-panel)] p-8 sm:p-12">
        <span className="glass-lens grid size-14 place-items-center rounded-2xl text-accent-strong">
          <FileClock className="size-6" aria-hidden />
        </span>
        <h1 className="mt-6 text-[clamp(1.8rem,1.3rem+2vw,2.6rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-ink">
          An updated résumé is on its way.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ink-2">
          I&apos;m refreshing my résumé to reflect my current work as a software developer. In the meantime, this
          site covers my experience and projects, and I&apos;m happy to send a copy directly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <GlassButton
            href={`mailto:${profile.email}?subject=${encodeURIComponent("Résumé request")}`}
            variant="primary"
            icon={<Mail className="size-4" aria-hidden />}
          >
            Request a copy
          </GlassButton>
          <GlassButton href={profile.social.linkedin} variant="inset" icon={<LinkedInIcon className="size-4" />}>
            View LinkedIn
          </GlassButton>
          <GlassButton href="/#experience" variant="ghost">
            Back to experience
          </GlassButton>
        </div>
      </div>
    </section>
  );
}
