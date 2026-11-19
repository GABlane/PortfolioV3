import type { ArchitectureLayer } from "@/data/types";

/** Layered architecture rendered as stacked glass rows joined by a spine. */
export function ArchitectureDiagram({ layers, accent }: { layers: ArchitectureLayer[]; accent: string }) {
  return (
    <ol className="relative flex flex-col gap-3" aria-label="Architecture layers, top to bottom">
      <span
        aria-hidden
        className="absolute top-6 bottom-6 left-[1.4rem] w-px"
        style={{ background: `linear-gradient(to bottom, ${accent}, rgba(79,140,255,0.35), rgba(15,23,42,0.08))` }}
      />
      {layers.map((layer, i) => (
        <li key={layer.name} className="surface relative grid gap-3 rounded-[20px] p-4 pl-12 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
          <span
            aria-hidden
            className="absolute top-[1.15rem] left-[0.95rem] grid size-4 place-items-center rounded-full bg-white shadow-sm ring-1 ring-ink/10 sm:top-1/2 sm:-translate-y-1/2"
          >
            <span className="size-1.5 rounded-full" style={{ background: i === 0 ? accent : "#4f8cff" }} />
          </span>
          <div>
            <p className="font-semibold tracking-[-0.015em] text-ink">{layer.name}</p>
            <p className="text-[0.82rem] leading-snug text-ink-3 sm:hidden">{layer.detail}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="hidden text-[0.88rem] leading-snug text-ink-2 sm:block">{layer.detail}</p>
            <ul className="flex flex-wrap gap-1.5">
              {layer.tech.map((t) => (
                <li key={t} className="rounded-full bg-white/70 px-2.5 py-0.5 text-[0.76rem] font-medium text-ink-2 ring-1 ring-ink/[0.06]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
