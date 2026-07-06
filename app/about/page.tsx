import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Founders } from "@/components/sections/Founders";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The WholeMan story — a recovery mission for men, led by Charlie Grove and Ccowl.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">About WholeMan</p>
            <h1 className="max-w-3xl font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">{siteConfig.recovery.heading}</span>
            </h1>
            <p className="mt-6 max-w-3xl font-sans text-[15px] leading-relaxed text-muted">
              {siteConfig.recovery.body}
            </p>
            <p className="mt-6 max-w-3xl font-sans text-[15px] leading-relaxed text-muted">
              {siteConfig.vision.purpose}
            </p>
            <p className="mt-6 max-w-3xl font-display text-xl italic text-copperlight">
              {siteConfig.vision.closer}
            </p>
          </Container>
        </section>
        <Founders />
      </main>
      <Footer />
    </>
  );
}
