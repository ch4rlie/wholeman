"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BookCall } from "@/components/ui/BookCall";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center text-bone"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <>
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-ink2/98 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-3">
            {siteConfig.nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-4 font-sans text-sm uppercase tracking-[0.15em] text-muted transition hover:text-bone"
              >
                {n.label}
              </Link>
            ))}
            <BookCall className="mt-4 rounded-md bg-copper px-4 py-3 text-center font-sans text-xs font-semibold uppercase tracking-wide text-ink">
              Book a call →
            </BookCall>
          </div>
        </div>
      )}
    </div>
  );
}
