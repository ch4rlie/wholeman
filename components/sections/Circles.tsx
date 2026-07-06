import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Circles() {
  const { circles, brotherhoodCall, nextCall, lumaUrl } = siteConfig;
  return (
    <section id="circles" className="border-t border-white/5 bg-gradient-to-b from-[#12100c] to-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>○</span>}>The brotherhood</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{circles.headline}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
            WholeMan circles are small groups of men who tell the truth, own their lives, and have
            each other&apos;s backs. It starts with one honest conversation.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
              <h3 className="font-display text-2xl text-bone">{brotherhoodCall.header}</h3>
              <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-muted">{brotherhoodCall.body}</p>
              <dl className="mt-5 space-y-1 font-sans text-sm text-faint">
                <div><dt className="inline text-copper">Cost: </dt><dd className="inline">{brotherhoodCall.cost}</dd></div>
                <div><dt className="inline text-copper">Who: </dt><dd className="inline">{brotherhoodCall.who}</dd></div>
                <div><dt className="inline text-copper">Where: </dt><dd className="inline">{brotherhoodCall.where}</dd></div>
              </dl>
              <a
                href={lumaUrl}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-block self-start rounded-md bg-copper px-6 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
              >
                RSVP for {nextCall.date} — free
              </a>
              <p className="mt-2 font-sans text-[11px] text-faint">{nextCall.date} · {nextCall.time}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
              <h3 className="font-display text-2xl text-bone">{circles.header}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted">{circles.body}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {circles.bullets.map((b) => (
                  <li key={b} className="relative pl-6 font-sans text-sm text-muted">
                    <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/circles"
                className="mt-6 inline-block self-start rounded-md border border-copper/60 px-6 py-3 font-sans text-sm font-semibold tracking-wide text-copperlight transition hover:bg-copper/10"
              >
                Explore the circles →
              </Link>
              <p className="mt-2 font-sans text-[11px] text-faint">{circles.note}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
