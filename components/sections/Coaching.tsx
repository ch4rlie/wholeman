import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { BookCall } from "@/components/ui/BookCall";
import { siteConfig } from "@/lib/site";

export function Coaching() {
  const { heading, body, perks } = siteConfig.coaching;
  return (
    <section id="coaching" className="grid border-t border-white/5 md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative min-h-[320px] bg-ink md:min-h-[540px]">
        <Image
          src="/photos/ccowl.jpeg"
          alt="Ccowl"
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover object-center"
        />
        <span className="absolute bottom-4 left-4 rounded-md bg-ink/60 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-wider text-copperlight">
          Ccowl · founder
        </span>
      </div>
      <div className="flex flex-col justify-center bg-gradient-to-b from-[#15120d] to-[#100e0a] px-6 py-14 md:px-12">
        <Reveal>
          <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Private coaching with Ccowl</p>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            Walk the path <span className="italic text-copperlight">with a guide.</span>
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
    </section>
  );
}
