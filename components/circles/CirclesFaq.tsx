import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

export function CirclesFaq() {
  return (
    <section className="border-t border-white/5 bg-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>?</span>}>Questions</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">Fair questions, straight answers.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 max-w-3xl">
            <Accordion
              items={siteConfig.circlesFaq.map((f) => ({
                id: f.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                title: f.q,
                content: <p className="font-sans text-[15px] leading-relaxed text-muted">{f.a}</p>,
              }))}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
