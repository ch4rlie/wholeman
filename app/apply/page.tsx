import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { ApplyForm } from "@/components/circles/ApplyForm";

export const metadata: Metadata = { title: "Apply for a circle" };

export default function ApplyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container className="max-w-2xl">
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Circles</p>
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Apply for a circle.</span>
            </h1>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
              Circles are by application so we can keep each one safe and committed. Tell us a little
              about you. We read every application personally.
            </p>
            <div className="mt-10">
              <ApplyForm />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
