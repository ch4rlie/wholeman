import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function CircleOffer() {
  const { circles } = siteConfig;
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-[#12100c] to-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>◎</span>}>Step two</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{circles.header}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{circles.body}</p>
          <ul className="mt-6 max-w-xl space-y-2">
            {circles.bullets.map((b) => (
              <li key={b} className="relative pl-6 font-sans text-sm text-muted">
                <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/apply"
            className="mt-7 inline-block rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            Apply for a circle →
          </Link>
          <p className="mt-3 font-sans text-[11px] text-faint">{circles.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
