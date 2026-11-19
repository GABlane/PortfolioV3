import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/utils";

type Variant = "primary" | "glass" | "inset" | "ghost";
type Size = "md" | "lg";

type GlassButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  /** Show the ↗ affordance for links that leave the site. Defaults to true for http(s) links. */
  showExternalIcon?: boolean;
  ariaLabel?: string;
  download?: boolean;
};

const base =
  "press inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap select-none";

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.98rem]",
  lg: "h-14 px-7 text-[1.05rem]",
};

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  glass: "glass glass-strong glass-interactive btn-glass text-ink",
  inset: "fill-inset fill-interactive text-ink",
  ghost: "text-ink-2 hover:text-ink hover:bg-white/50 transition-colors",
};

export function GlassButton({
  href,
  children,
  variant = "glass",
  size = "md",
  className,
  icon,
  showExternalIcon,
  ariaLabel,
  download,
}: GlassButtonProps) {
  const external = isExternal(href);
  const web = /^https?:/.test(href);
  const showArrow = showExternalIcon ?? web;
  const classes = cn(base, sizes[size], variants[variant], className);

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {showArrow && <ArrowUpRight aria-hidden className="size-4 opacity-70" />}
      {web && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  if (external || download) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        download={download || undefined}
        {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
