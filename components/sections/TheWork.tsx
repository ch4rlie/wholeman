import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function TheWork() {
  return (
    <section className="bg-gradient-to-b from-charcoal to-[#100e0a] py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>✦</span>}>The work</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            Practices, tools &amp; <span className="italic text-copperlight">pursuits</span>
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {siteConfig.work.map((w, i) => (
            <Reveal key={w.key} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-cardline bg-white/[0.02] p-6">
                <h3 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-copperlight">{w.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-faint">{w.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
