import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Founders() {
  const { header, intro, people } = siteConfig.founders;
  return (
    <section id="founders" className="border-t border-white/5 bg-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>✦</span>}>The founders</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{header}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{intro}</p>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {people.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
                <div className="relative mb-6 aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-cardline">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 60vw, 240px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-charcoal">
                      <span className="font-sans text-[11px] uppercase tracking-label text-faint">
                        Photo coming soon
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl text-bone">{person.name}</h3>
                <p className="mt-1 font-sans text-[11px] uppercase tracking-label text-copper">{person.role}</p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
                  {person.bio ?? "Bio coming soon."}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
