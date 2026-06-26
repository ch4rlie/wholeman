import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function IsThisYou() {
  const { heading, items } = siteConfig.isThisYou;
  return (
    <section className="bg-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>✦</span>}>The mirror</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{heading}</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-copper" aria-hidden>
                  ✦
                </span>
                <p className="font-sans text-[15px] leading-relaxed text-muted">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
