import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Agreements() {
  const { agreements } = siteConfig;
  return (
    <section className="border-t border-white/5 bg-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>⬡</span>}>The container</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{agreements.header}</span>
          </h2>
          <p className="mt-4 font-sans text-[15px] text-muted">{agreements.intro}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agreements.items.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-cardline bg-ink2/60 p-6">
                <h3 className="font-display text-xl text-copperlight">{title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
