import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

export function SurvivalStrategies() {
  const { header, lede, prompt, recognize, strategies } = siteConfig.survival;
  return (
    <section id="survival" className="border-t border-white/5 bg-gradient-to-b from-[#0d0c0a] to-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>◈</span>}>The mask</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{header}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 max-w-3xl space-y-4">
            {lede.map((p) => (
              <p key={p} className="font-sans text-[15px] leading-relaxed text-muted">{p}</p>
            ))}
            <p className="font-display text-xl italic text-copperlight">{prompt}</p>
            <p className="font-sans text-sm text-faint">{recognize}</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10">
            <Accordion
              items={strategies.map((s) => ({
                id: s.name.toLowerCase().replace(/\s+/g, "-"),
                title: s.name,
                content: (
                  <div className="space-y-4">
                    <p className="font-display text-lg italic text-copperlight">&ldquo;{s.belief}&rdquo;</p>
                    <div>
                      <p className="mb-2 font-sans text-[11px] uppercase tracking-label text-copper">How it shows up</p>
                      <ul className="space-y-1.5">
                        {s.showsUp.map((line) => (
                          <li key={line} className="relative pl-6 font-sans text-sm leading-relaxed text-muted">
                            <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-sans text-[11px] uppercase tracking-label text-copper">The way forward</p>
                      <ul className="space-y-1.5">
                        {s.wayForward.map((line) => (
                          <li key={line} className="relative pl-6 font-sans text-sm leading-relaxed text-muted">
                            <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
