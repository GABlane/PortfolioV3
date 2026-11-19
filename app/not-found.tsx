import { GlassButton } from "@/components/glass/GlassButton";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-44 pb-20 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-[clamp(2rem,1.4rem+2.4vw,3rem)] font-semibold tracking-[-0.04em] text-ink">
        This page drifted out of view.
      </h1>
      <p className="mt-4 text-ink-2">The link may be outdated. Everything else is one tap away.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <GlassButton href="/" variant="primary">
          Back home
        </GlassButton>
        <GlassButton href="/projects">See projects</GlassButton>
      </div>
    </section>
  );
}
