import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Gab's logo — the icy glass eye with a sideways G.
 * Source: public/brand/logo.webp (cropped from references/originals/).
 */
export function BrandMark({ size = 32, className, priority = false }: { size?: number; className?: string; priority?: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-white/80 shadow-[0_2px_8px_-2px_rgba(37,99,235,0.35)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={size <= 48 ? "/brand/logo-96.webp" : "/brand/logo.webp"}
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
