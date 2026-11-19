import Image from "next/image";
import type { ProjectMedia } from "@/data/types";
import { MediaBadge } from "./MediaBadge";

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {media.map((item) => (
        <li key={item.src.src}>
          <figure className="glass rounded-[var(--radius-card)] p-2.5 sm:p-3">
            <div className="relative overflow-hidden rounded-[18px] bg-white/50 sm:rounded-[16px]">
              <Image
                src={item.src}
                alt={item.alt}
                placeholder={item.transparent ? "empty" : "blur"}
                sizes="(min-width: 1024px) 760px, 100vw"
                className="h-auto w-full"
                loading="lazy"
              />
              <MediaBadge kind={item.kind} className="absolute top-3 left-3" />
            </div>
            {item.caption && <figcaption className="px-2 pt-3 pb-1 text-sm text-ink-3">{item.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  );
}
