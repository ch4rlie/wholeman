import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink2 px-6 py-12 text-center md:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/wholeman-icon.svg" alt="WholeMan" className="mx-auto mb-4 h-14 w-auto opacity-90 invert" />
      <div className="mb-3 flex flex-wrap justify-center gap-4 font-sans text-xs uppercase tracking-[0.15em] text-faint">
        {siteConfig.social.map((s) => (
          <a key={s.label} href={s.href} className="transition hover:text-bone">{s.label}</a>
        ))}
      </div>
      <p className="font-sans text-xs text-faint">© WholeMan {new Date().getFullYear()} · Presence over performance.</p>
    </footer>
  );
}
