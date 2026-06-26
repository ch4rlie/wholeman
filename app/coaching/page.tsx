import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Coaching } from "@/components/sections/Coaching";

export const metadata: Metadata = { title: "Coaching — WholeMan" };

export default function CoachingPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Page header */}
        <section className="bg-ink py-16 md:py-24">
          <Container>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Private coaching</p>
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              Private coaching with Ccowl
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
              Direct, embodied 1:1 work to help you stop performing and come home to yourself.
            </p>
          </Container>
        </section>

        {/* Existing coaching section (photo + perks + Book CTA) */}
        <Coaching />

        {/* What to expect */}
        <section className="bg-ink py-16 md:py-20">
          <Container>
            <p className="mb-6 font-sans text-[11px] uppercase tracking-label text-copper">What to expect</p>
            <ul className="space-y-4 max-w-xl">
              <li className="relative pl-6 font-sans text-[15px] leading-relaxed text-muted">
                <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                A free 30-minute intro call to see if we&apos;re a fit
              </li>
              <li className="relative pl-6 font-sans text-[15px] leading-relaxed text-muted">
                <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                Honest, body-based work — not just talk
              </li>
              <li className="relative pl-6 font-sans text-[15px] leading-relaxed text-muted">
                <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                A steady path from despair to integration
              </li>
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
