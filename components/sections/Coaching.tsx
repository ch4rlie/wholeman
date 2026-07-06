import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BookCall } from "@/components/ui/BookCall";
import { siteConfig } from "@/lib/site";

export function Coaching() {
  const { label, heading, body, perks, photoCaption } = siteConfig.coaching;
  return (
    <section
      id="coaching"
      className="border-t border-white/5 bg-gradient-to-b from-[#15120d] to-[#100e0a] py-16 md:py-24"
    >
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-cardline md:mx-0 md:max-w-md">
              <Image
                src="/photos/ccowl.jpeg"
                alt="Ccowl"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 rounded-md bg-ink/60 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-wider text-copperlight">
                {photoCaption}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">{label}</p>
            <h2 className="font-display text-3xl font-normal md:text-4xl">
              {heading.includes("with a guide") ? (
                <>
                  Walk the path <span className="italic text-copperlight">with a guide.</span>
                </>
              ) : (
                heading
              )}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-muted">{body}</p>
            <ul className="my-6 space-y-2">
              {perks.map((p) => (
                <li key={p} className="relative pl-6 font-sans text-sm text-muted">
                  <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                  {p}
                </li>
              ))}
            </ul>
            <BookCall className="inline-block rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110">
              Book your free intro call →
            </BookCall>
            <p className="mt-3 font-sans text-[11px] text-faint">Opens calendar · 30 minutes · no pressure</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
