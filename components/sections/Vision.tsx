import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Vision() {
  const { purpose, statement, closer } = siteConfig.vision;
  return (
    <section
      className="bg-[radial-gradient(130%_150%_at_50%_-10%,#2a221a_0%,#140f0a_55%,#0a0a0b_100%)] py-20 md:py-32"
    >
      <Container className="flex flex-col items-center text-center">
        <Reveal>
          <SectionLabel icon={<span aria-hidden>♦</span>}>The vision</SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-2 max-w-3xl font-display text-2xl font-normal italic leading-snug text-bone md:text-3xl">
            {statement}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
            {purpose}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 font-display text-xl text-copper md:text-2xl">
            {closer}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
