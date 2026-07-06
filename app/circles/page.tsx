import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { MonthlyCall } from "@/components/circles/MonthlyCall";
import { CircleOffer } from "@/components/circles/CircleOffer";
import { Agreements } from "@/components/circles/Agreements";
import { WhoFor } from "@/components/circles/WhoFor";
import { CirclesFaq } from "@/components/circles/CirclesFaq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Circles",
  description:
    "WholeMan circles — small, consistent groups of men who tell the truth, own their lives, and have each other's backs. Start with the free monthly brotherhood call.",
};

export default function CirclesPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Men&apos;s circles</p>
            <h1 className="max-w-3xl font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">{siteConfig.circles.headline}</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
              WholeMan circles are small groups of men who tell the truth, own their lives, and have
              each other&apos;s backs. It starts with one honest conversation.
            </p>
          </Container>
        </section>
        <MonthlyCall />
        <CircleOffer />
        <Agreements />
        <WhoFor />
        <CirclesFaq />
        <section className="border-t border-white/5 bg-gradient-to-b from-[#15120d] to-ink2 py-16 text-center md:py-24">
          <Container>
            <h2 className="font-display text-3xl font-normal md:text-4xl">
              <span className="italic text-copperlight">{siteConfig.finalCta.header}</span>
            </h2>
            <p className="mt-4 font-sans text-[15px] text-muted">{siteConfig.finalCta.subhead}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={siteConfig.lumaUrl}
                target="_blank"
                rel="noopener"
                className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
              >
                Save my seat — free
              </a>
              <Link
                href="/apply"
                className="rounded-md border border-copper/60 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-copperlight transition hover:bg-copper/10"
              >
                Apply for a circle →
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
