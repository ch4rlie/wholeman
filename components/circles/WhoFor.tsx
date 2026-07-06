import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export function WhoFor() {
  const { whoFor } = siteConfig;
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-[#0d0c0a] to-ink py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl text-bone md:text-3xl">{whoFor.forHeader}</h2>
            <ul className="mt-6 space-y-3">
              {whoFor.forItems.map((item) => (
                <li key={item} className="relative pl-6 font-sans text-[15px] leading-relaxed text-muted">
                  <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl text-bone md:text-3xl">{whoFor.notHeader}</h2>
            <ul className="mt-6 space-y-3">
              {whoFor.notItems.map((item) => (
                <li key={item} className="relative pl-6 font-sans text-[15px] leading-relaxed text-faint">
                  <span className="absolute left-0 text-faint" aria-hidden>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
