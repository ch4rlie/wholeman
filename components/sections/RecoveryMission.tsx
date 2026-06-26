import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function RecoveryMission() {
  const { body } = siteConfig.recovery;
  return (
    <section className="bg-gradient-to-b from-[#100f0d] to-[#0c0b0a] py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>♦</span>}>The mission</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            A{" "}
            <span className="italic text-copperlight">recovery</span>{" "}
            mission
          </h2>
          <p className="mt-6 max-w-3xl font-sans text-[17px] leading-loose text-muted">
            {body}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
