import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/AnimatedSection";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl",
        className,
      )}
    >
      <p className="eyebrow flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-6 bg-gradient-to-r from-accent to-accent-cyan" />
        {eyebrow}
      </p>
      <Heading
        id={id}
        className="text-balance text-[clamp(1.75rem,1.1rem+2.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-ink"
      >
        {title}
      </Heading>
      {subtitle && (
        <p className="text-pretty text-[1.075rem] leading-relaxed text-ink-2 sm:text-[1.2rem]">{subtitle}</p>
      )}
    </Reveal>
  );
}
