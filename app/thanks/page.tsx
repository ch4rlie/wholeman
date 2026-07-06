import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Thank you" };

export default function ThanksPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-24 text-center md:py-32">
          <Container className="max-w-2xl">
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Thank you. We got your application.</span>
            </h1>
            <p className="mx-auto mt-6 font-sans text-[15px] leading-relaxed text-muted">
              We read every application personally and reply within a few days. Keep an eye on your
              inbox (and your spam folder, just in case). You took a real step today, and that matters.
            </p>
            <Link href="/" className="mt-8 inline-block font-sans text-sm text-copperlight underline-offset-4 hover:underline">
              ← Back to home
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
