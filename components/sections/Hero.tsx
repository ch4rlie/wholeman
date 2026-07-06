import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Image
        src="/photos/hero-colorado.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink/95" />
      <div className="relative z-10 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/wholeman-logo.svg" alt="WholeMan — I Am" className="mb-6 h-40 w-auto drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)] invert md:h-44" />
        <h1 className="mb-4 font-display text-2xl italic font-normal text-bone md:text-3xl">{siteConfig.hero.tagline}</h1>
        <p className="max-w-2xl font-sans text-base leading-relaxed text-muted">{siteConfig.hero.mission}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={siteConfig.lumaUrl}
            target="_blank"
            rel="noopener"
            className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            {siteConfig.hero.primaryCta}
          </a>
          <Link
            href="/circles"
            className="rounded-md border border-white/40 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-bone backdrop-blur-sm transition hover:bg-white/10"
          >
            {siteConfig.hero.secondaryCta} →
          </Link>
        </div>
        <a href="#podcast" className="mt-5 font-sans text-xs uppercase tracking-[0.15em] text-muted transition hover:text-bone">
          ▶ Listen to the podcast
        </a>
      </div>
    </section>
  );
}
