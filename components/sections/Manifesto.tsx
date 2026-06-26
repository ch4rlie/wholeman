import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Manifesto() {
  const { is, isNot } = siteConfig.manifesto;
  return (
    <section className="bg-ink2 py-16 md:py-28">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>✦</span>}>What this is</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            The <span className="italic text-copperlight">WholeMan</span> manifesto
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {/* Is column */}
          <div>
            <Reveal>
              <h3 className="mb-6 font-sans text-xs uppercase tracking-[0.2em] text-copper">
                WholeMan is
              </h3>
            </Reveal>
            <ul className="space-y-4">
              {is.map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 text-copper" aria-hidden>
                      ✦
                    </span>
                    <span className="font-sans text-[15px] leading-relaxed text-bone">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          {/* Is not column */}
          <div>
            <Reveal>
              <h3 className="mb-6 font-sans text-xs uppercase tracking-[0.2em] text-faint">
                WholeMan is not
              </h3>
            </Reveal>
            <ul className="space-y-4">
              {isNot.map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 text-faint" aria-hidden>
                      ✕
                    </span>
                    <span className="font-sans text-[15px] leading-relaxed text-faint">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
