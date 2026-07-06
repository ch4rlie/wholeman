import { siteConfig } from "@/lib/site";
import { BrandLink } from "@/components/site/BrandLink";
import { MobileMenu } from "@/components/site/MobileMenu";
import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink2/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <BrandLink className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wholeman-icon.svg" alt="WholeMan" className="h-11 w-auto invert" />
        </BrandLink>

        <div className="hidden gap-7 font-sans text-xs uppercase tracking-[0.15em] text-muted md:flex">
          {siteConfig.nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-bone">
              {n.label}
            </Link>
          ))}
        </div>

        <a
          href={siteConfig.lumaUrl}
          target="_blank"
          rel="noopener"
          className="hidden rounded-md bg-copper px-4 py-2 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110 md:inline-block"
        >
          Join the call →
        </a>

        <MobileMenu />
      </nav>
    </header>
  );
}
