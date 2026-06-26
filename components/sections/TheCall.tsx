import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function TheCall() {
  const { heading, emphasis, body } = siteConfig.call;
  return (
    <section id="call" className="bg-gradient-to-b from-[#100f0d] to-[#0c0b0a] py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>♦</span>}>The call</SectionLabel>
          <div className="border-l-[3px] border-copper pl-6">
            <h2 className="font-display text-3xl font-normal md:text-4xl">
              {heading}
              <br />
              <span className="italic text-copperlight">{emphasis}</span>
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{body}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
