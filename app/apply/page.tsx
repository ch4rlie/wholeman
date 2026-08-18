import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { ApplyForm } from "@/components/circles/ApplyForm";

export const metadata: Metadata = { title: "Start the conversation" };

export default function ApplyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container className="max-w-2xl">
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Get in touch</p>
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Start the conversation.</span>
            </h1>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
              Tell us a little about you and what you&apos;re looking for — whether that&apos;s
              joining a circle, asking about 1:1 coaching, learning more, or just getting
              something off your chest. We read every note personally.
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
