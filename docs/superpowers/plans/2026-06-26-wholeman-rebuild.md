# WholeMan.org Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bold, cinematic, outdoor-themed marketing site + auto-updating podcast hub for WholeMan (Ty Humphries), with private 1:1 coaching booking as the primary CTA, deployed on Vercel.

**Architecture:** Next.js App Router app. Server components fetch + parse the podcast RSS feed at build time with ISR (hourly revalidation). The homepage is a composition of focused section components; the podcast also has its own `/podcast` index page. Booking uses Calendly's official embed script (no React-version coupling), configured via env var. Pure presentational styling via Tailwind with a small custom design-token palette; cinematic motion via Framer Motion `whileInView` reveals.

**Tech Stack:** Next.js 15 (App Router, TypeScript), React (as scaffolded by create-next-app), Tailwind CSS 3.4, Framer Motion 11, fast-xml-parser 4 (RSS parsing), Vitest 2 + @testing-library/react 16 (tests), next/font (Cormorant Garamond display + Inter UI). Deployed to Vercel from GitHub `ch4rlie/wholeman`.

## Global Constraints

- **Node:** v20+ (v24.15.0 is the default via nvm). nvm does NOT auto-load in non-interactive shells — every shell command that runs node/npm MUST be prefixed with: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";` (or run inside a login shell). All `Run:` commands below assume this prefix is applied.
- **Working directory:** `~/wholeman` (WSL: `/home/charlie/wholeman`). Run all commands there.
- **Package manager:** npm.
- **Language:** TypeScript, strict mode.
- **Tailwind:** v3.4 with a JS config file (`tailwind.config.ts`) — do NOT use Tailwind v4.
- **Design tokens (use these exact values):** background ink `#0a0a0b`, darker nav/footer ink `#08080a`, warm off-white text `#f0ede7`, muted body text `#cfc7b9`, faint text `#9b9384`, copper-gold accent `#d2a86a`, light copper `#e0bd86`, warm charcoal panel `#14110c`, card border `#2e2a22`.
- **Type:** display/headlines = serif (Cormorant Garamond) via CSS var `--font-display`; labels/nav/UI = sans (Inter) via `--font-sans`.
- **Podcast feed URL:** `https://anchor.fm/s/10bb68134/podcast/rss`.
- **Booking:** Calendly. URL from `NEXT_PUBLIC_CALENDLY_URL`, falling back to `https://calendly.com/wholeman/intro-call`.
- **Copy rule:** reuse the validated copy from the design spec verbatim (tagline "Presence over performance.", the mission line, section copy). Do not invent new marketing claims.
- **Scope:** v1 = homepage + `/podcast`. NO email capture, NO auth, NO payments, NO store. Keep components and data boundaries clean so those can be added later.
- **Commits:** frequent, conventional-commit style. End every commit message body with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Each task ends green:** `npm run build` must pass and `npm test` must pass before the task's final commit.

---

## File Structure

```
wholeman/
  app/
    layout.tsx              # root layout, fonts, metadata
    globals.css             # tailwind directives + base styles
    page.tsx                # homepage (server component, fetches podcast)
    podcast/page.tsx        # all-episodes index (server component)
  components/
    site/
      Nav.tsx               # top navigation + Book a call button
      Footer.tsx            # logo lockup + links
    sections/
      Hero.tsx              # full-bleed landscape + centered brand lockup
      TheCall.tsx           # emotional hook section
      TheWork.tsx           # Practices/Tools/Pursuits cards
      Coaching.tsx          # Ty photo + coaching pitch + Book CTA
      PodcastSection.tsx    # featured + recent episodes (homepage)
    podcast/
      EpisodeCard.tsx       # compact episode row
      FeaturedEpisode.tsx   # large featured episode card
    ui/
      Reveal.tsx            # framer-motion whileInView wrapper
      SectionLabel.tsx      # icon + uppercase label
      BookCall.tsx          # Calendly popup trigger (client)
      Container.tsx         # max-width wrapper
  lib/
    podcast.ts              # fetch + parse RSS -> typed Podcast
    podcast.types.ts        # Episode, Podcast interfaces
    site.ts                 # site copy/config (nav, sections, social)
  public/
    brand/wholeman-logo.jpg # the WHOLEMAN / I AM mark
    photos/ty-hero.jpg      # mountain sunset portrait
    photos/ty-candid.jpg    # candid cap/snow shot
    photos/ty-featured.jpg  # "as featured on" graphic
  test/
    setup.ts                # testing-library matchers
    fixtures/feed.xml       # sample RSS for podcast tests
  vitest.config.ts
  tailwind.config.ts
  postcss.config.mjs
  next.config.mjs
  .env.example
  tsconfig.json
  package.json
```

---

## Task 1: Scaffold Next.js app, Tailwind, fonts, design tokens

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
- Note: scaffold in a temp dir and merge to preserve existing `assets/`, `docs/`, `.git`, `README.md`, `.gitignore`.

**Interfaces:**
- Produces: a running Next.js app with Tailwind tokens (`bg-ink`, `text-bone`, `text-copper`, `font-display`, `font-sans`) and a placeholder homepage. Later tasks import from `@/components/*` and `@/lib/*` (alias `@/*` → repo root).

- [ ] **Step 1: Scaffold into a temp dir** (create-next-app refuses non-empty dirs)

Run:
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd ~ && rm -rf wm-tmp
npx --yes create-next-app@latest wm-tmp --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm
```
Expected: scaffolds `~/wm-tmp` successfully.

- [ ] **Step 2: Merge scaffold into the repo, preserving existing files**

Run:
```bash
cd ~/wm-tmp
# copy everything except git/readme/node_modules into the repo
rm -f README.md .gitignore
cp -r ./. ~/wholeman/
cd ~ && rm -rf wm-tmp
cd ~/wholeman && rm -rf node_modules && npm install
```
Expected: `~/wholeman/package.json`, `app/`, etc. now present; `assets/`, `docs/`, `.git`, `README.md` intact.

- [ ] **Step 3: Install Tailwind 3.4, Framer Motion, fast-xml-parser**

Run:
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npm install framer-motion@^11 fast-xml-parser@^4
npx tailwindcss init -p
```
Expected: `tailwind.config.js` + `postcss.config.js` created (we replace config in next step).

- [ ] **Step 4: Write `tailwind.config.ts`** (replace the generated `tailwind.config.js`; delete the `.js`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        ink2: "#08080a",
        bone: "#f0ede7",
        muted: "#cfc7b9",
        faint: "#9b9384",
        copper: "#d2a86a",
        copperlight: "#e0bd86",
        charcoal: "#14110c",
        cardline: "#2e2a22",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { label: "0.3em" },
    },
  },
  plugins: [],
};
export default config;
```
Then: `rm -f ~/wholeman/tailwind.config.js`

- [ ] **Step 5: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }

html, body { background-color: #0a0a0b; color: #f0ede7; }

body { font-family: var(--font-sans), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

::selection { background: #d2a86a; color: #161310; }
```

- [ ] **Step 6: Write `app/layout.tsx`** with fonts + base metadata

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WholeMan — Presence over performance",
  description:
    "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Write a minimal `app/page.tsx`** (placeholder, replaced later)

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="font-display text-5xl text-bone">WholeMan</h1>
    </main>
  );
}
```

- [ ] **Step 8: Verify dev build compiles**

Run:
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run build
```
Expected: build succeeds; route `/` compiled.

- [ ] **Step 9: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: scaffold Next.js app with Tailwind tokens and fonts

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Testing harness (Vitest + Testing Library)

**Files:**
- Create: `vitest.config.ts`, `test/setup.ts`, `lib/__smoke__.test.ts` (temporary sample)
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: working `npm test` with jsdom env, `@/` alias, and jest-dom matchers. Later tasks add `*.test.ts(x)` files.

- [ ] **Step 1: Install test deps**

Run:
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman
npm install -D vitest@^2 @vitejs/plugin-react jsdom @testing-library/react@^16 @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
});
```

- [ ] **Step 3: Write `test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add `test` script to `package.json`**

In `"scripts"`, add: `"test": "vitest run"` and `"test:watch": "vitest"`.

- [ ] **Step 5: Write a temporary sample test `lib/__smoke__.test.ts`**

```ts
import { describe, it, expect } from "vitest";
describe("smoke", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 6: Run tests (verify harness works)**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm test`
Expected: 1 passing test.

- [ ] **Step 7: Delete the sample and commit**

```bash
cd ~/wholeman && rm lib/__smoke__.test.ts && git add -A
git commit -m "test: add Vitest + Testing Library harness

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Podcast types + RSS parsing library (TDD)

**Files:**
- Create: `lib/podcast.types.ts`, `lib/podcast.ts`, `lib/podcast.test.ts`, `test/fixtures/feed.xml`

**Interfaces:**
- Produces:
  - `interface Episode { id: string; title: string; guest: string | null; description: string; pubDate: string; pubDateLabel: string; durationSeconds: number; durationLabel: string; audioUrl: string | null; episodeNumber: number | null; link: string }`
  - `interface Podcast { title: string; description: string; coverImage: string | null; episodes: Episode[] }`
  - `parseDurationToSeconds(raw: string): number`
  - `formatDuration(seconds: number): string`
  - `formatDate(iso: string): string`
  - `extractGuest(title: string): string | null`
  - `parsePodcastFeed(xml: string): Podcast`
  - `getPodcast(): Promise<Podcast>`

- [ ] **Step 1: Write `lib/podcast.types.ts`**

```ts
export interface Episode {
  id: string;
  title: string;
  guest: string | null;
  description: string;
  pubDate: string;       // ISO 8601
  pubDateLabel: string;  // "Jun 17, 2026"
  durationSeconds: number;
  durationLabel: string; // "1h 37m"
  audioUrl: string | null;
  episodeNumber: number | null;
  link: string;
}

export interface Podcast {
  title: string;
  description: string;
  coverImage: string | null;
  episodes: Episode[];
}
```

- [ ] **Step 2: Write the failing test `lib/podcast.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import {
  parseDurationToSeconds,
  formatDuration,
  formatDate,
  extractGuest,
  parsePodcastFeed,
} from "./podcast";

describe("parseDurationToSeconds", () => {
  it("parses HH:MM:SS", () => { expect(parseDurationToSeconds("1:37:25")).toBe(5845); });
  it("parses MM:SS", () => { expect(parseDurationToSeconds("47:10")).toBe(2830); });
  it("parses plain seconds", () => { expect(parseDurationToSeconds("3600")).toBe(3600); });
  it("returns 0 for junk", () => { expect(parseDurationToSeconds("")).toBe(0); });
});

describe("formatDuration", () => {
  it("formats hours and minutes", () => { expect(formatDuration(5845)).toBe("1h 37m"); });
  it("formats minutes only", () => { expect(formatDuration(2830)).toBe("47m"); });
  it("handles zero", () => { expect(formatDuration(0)).toBe("0m"); });
});

describe("formatDate", () => {
  it("formats an ISO date as Mon D, YYYY (UTC)", () => {
    expect(formatDate("2026-06-17T12:00:00Z")).toBe("Jun 17, 2026");
  });
});

describe("extractGuest", () => {
  it("pulls 'w/ Name'", () => {
    expect(extractGuest("The Art of Self Delusion w/ Brent Perkins")).toBe("Brent Perkins");
  });
  it("pulls 'with Name'", () => {
    expect(extractGuest("Prioritizing our Humanity with Sean Harvey")).toBe("Sean Harvey");
  });
  it("returns null when no guest", () => {
    expect(extractGuest("Shame is not your name")).toBeNull();
  });
});

describe("parsePodcastFeed", () => {
  const xml = `<?xml version="1.0"?>
  <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel>
    <title>WholeMan Podcast</title>
    <description>A phoenix rising from despair.</description>
    <itunes:image href="https://img/cover.jpg"/>
    <item>
      <title>Prioritizing our Humanity with Sean Harvey</title>
      <description>Systems thinking and compassion.</description>
      <pubDate>Wed, 17 Jun 2026 12:00:00 GMT</pubDate>
      <itunes:duration>1:37:25</itunes:duration>
      <itunes:episode>21</itunes:episode>
      <enclosure url="https://audio/21.mp3" type="audio/mpeg"/>
      <guid>guid-21</guid>
      <link>https://show/21</link>
    </item>
    <item>
      <title>Shame is not your name</title>
      <description>On shame.</description>
      <pubDate>Wed, 01 May 2026 12:00:00 GMT</pubDate>
      <itunes:duration>2310</itunes:duration>
      <guid>guid-22</guid>
    </item>
  </channel></rss>`;

  it("parses channel metadata", () => {
    const p = parsePodcastFeed(xml);
    expect(p.title).toBe("WholeMan Podcast");
    expect(p.coverImage).toBe("https://img/cover.jpg");
  });
  it("parses episodes newest-first with derived fields", () => {
    const p = parsePodcastFeed(xml);
    expect(p.episodes).toHaveLength(2);
    const first = p.episodes[0];
    expect(first.title).toBe("Prioritizing our Humanity with Sean Harvey");
    expect(first.guest).toBe("Sean Harvey");
    expect(first.episodeNumber).toBe(21);
    expect(first.durationLabel).toBe("1h 37m");
    expect(first.pubDateLabel).toBe("Jun 17, 2026");
    expect(first.audioUrl).toBe("https://audio/21.mp3");
    expect(first.link).toBe("https://show/21");
  });
  it("tolerates missing enclosure/link", () => {
    const p = parsePodcastFeed(xml);
    expect(p.episodes[1].audioUrl).toBeNull();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run lib/podcast.test.ts`
Expected: FAIL — cannot import from `./podcast` (module not found).

- [ ] **Step 4: Write `lib/podcast.ts`**

```ts
import { XMLParser } from "fast-xml-parser";
import type { Episode, Podcast } from "./podcast.types";

const FEED_URL = "https://anchor.fm/s/10bb68134/podcast/rss";

export function parseDurationToSeconds(raw: string): number {
  if (!raw) return 0;
  const parts = raw.split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(d);
}

export function extractGuest(title: string): string | null {
  const m = title.match(/\s+(?:w\/|with)\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]);
  }
  return String(v);
}

export function parsePodcastFeed(xml: string): Podcast {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const data = parser.parse(xml);
  const channel = data?.rss?.channel ?? {};
  const rawItems = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];

  const episodes: Episode[] = rawItems.map((it: Record<string, unknown>, i: number) => {
    const title = text(it.title);
    const durationSeconds = parseDurationToSeconds(text(it["itunes:duration"]));
    const pubRaw = text(it.pubDate);
    const pubDate = pubRaw ? new Date(pubRaw).toISOString() : "";
    const enclosure = it.enclosure as Record<string, string> | undefined;
    const epNum = text(it["itunes:episode"]);
    return {
      id: text(it.guid) || `${i}`,
      title,
      guest: extractGuest(title),
      description: text(it.description) || text(it["itunes:summary"]),
      pubDate,
      pubDateLabel: pubDate ? formatDate(pubDate) : "",
      durationSeconds,
      durationLabel: formatDuration(durationSeconds),
      audioUrl: enclosure?.["@_url"] ?? null,
      episodeNumber: epNum ? parseInt(epNum, 10) : null,
      link: text(it.link),
    };
  });

  episodes.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));

  const coverImg = channel["itunes:image"] as Record<string, string> | undefined;
  return {
    title: text(channel.title) || "WholeMan Podcast",
    description: text(channel.description),
    coverImage: coverImg?.["@_href"] ?? null,
    episodes,
  };
}

export async function getPodcast(): Promise<Podcast> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    return parsePodcastFeed(await res.text());
  } catch (err) {
    console.error("[podcast] failed to load feed:", err);
    return { title: "WholeMan Podcast", description: "", coverImage: null, episodes: [] };
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run lib/podcast.test.ts`
Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: podcast RSS parsing library with tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Site config + copy

**Files:**
- Create: `lib/site.ts`

**Interfaces:**
- Produces: `siteConfig` with `nav`, `social`, `coaching`, and section copy consumed by components. Exact shape:
  - `siteConfig.calendlyUrl: string`
  - `siteConfig.nav: { label: string; href: string }[]`
  - `siteConfig.hero: { tagline: string; mission: string }`
  - `siteConfig.call: { heading: string; emphasis: string; body: string }`
  - `siteConfig.work: { key: string; title: string; items: string }[]`
  - `siteConfig.coaching: { heading: string; body: string; perks: string[] }`
  - `siteConfig.social: { label: string; href: string }[]`

- [ ] **Step 1: Write `lib/site.ts`**

```ts
export const siteConfig = {
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/wholeman/intro-call",
  nav: [
    { label: "Mission", href: "#call" },
    { label: "Coaching", href: "#coaching" },
    { label: "Podcast", href: "#podcast" },
  ],
  hero: {
    tagline: "Presence over performance.",
    mission:
      "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration.",
  },
  call: {
    heading: "You've achieved the things.",
    emphasis: "You still feel empty.",
    body:
      "Raised without emotionally present fathers, many men learned to perform instead of feel — to wear the “nice guy” or the intimidating mask, to suppress desire, to go numb. WholeMan is the path back to the man underneath.",
  },
  work: [
    { key: "practices", title: "Practices", items: "Self-love · self-trust · self-mastery · self-creation" },
    { key: "tools", title: "Tools", items: "Body intelligence · brotherhood · breath · belief reformation" },
    { key: "pursuits", title: "Pursuits", items: "Bliss · awareness · authenticity · connection · creativity" },
  ],
  coaching: {
    heading: "Walk the path with a guide.",
    body:
      "One man, one mission: to help you stop performing and come home to yourself. Direct, embodied, unflinching 1:1 work — body, breath, and belief, not just talk.",
    perks: [
      "Deep 1:1 work tailored to where you're stuck",
      "A brotherhood of accountability and honesty",
      "From despair to integration — the phoenix path",
    ],
  },
  social: [
    { label: "Spotify", href: "https://open.spotify.com/show/2Zmk6EmhKMF64cBc77Fizr" },
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/wholeman-podcast/id1861302139" },
    { label: "Instagram", href: "#" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
```

- [ ] **Step 2: Verify it typechecks**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: site config and validated copy

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Move brand assets into public/

**Files:**
- Create: `public/brand/wholeman-logo.jpg`, `public/photos/ty-hero.jpg`, `public/photos/ty-candid.jpg`, `public/photos/ty-featured.jpg`

**Interfaces:**
- Produces: web-served image paths `/brand/wholeman-logo.jpg`, `/photos/ty-hero.jpg`, `/photos/ty-candid.jpg`, `/photos/ty-featured.jpg`.

- [ ] **Step 1: Copy and rename assets**

Run:
```bash
cd ~/wholeman && mkdir -p public/brand public/photos
cp "assets/622867000_10163925725222427_5127588898853772481_n.jpg" public/brand/wholeman-logo.jpg
cp "assets/622878457_10163925728647427_3603760875928361084_n.jpg" public/photos/ty-hero.jpg
cp "assets/656089313_10164203474182427_1283544851189852893_n.jpg" public/photos/ty-candid.jpg
cp "assets/686552545_18398022475155822_5988694110587540284_n.jpg" public/photos/ty-featured.jpg
ls -la public/brand public/photos
```
Expected: four files present.

- [ ] **Step 2: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "chore: add brand logo and Ty photos to public/

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: UI primitives — Reveal, Container, SectionLabel, BookCall

**Files:**
- Create: `components/ui/Reveal.tsx`, `components/ui/Container.tsx`, `components/ui/SectionLabel.tsx`, `components/ui/BookCall.tsx`, `components/ui/BookCall.test.tsx`

**Interfaces:**
- Produces:
  - `<Reveal delay?: number className?: string>{children}</Reveal>` — client, framer-motion fade/rise on scroll.
  - `<Container className?: string>{children}</Container>` — max-width wrapper.
  - `<SectionLabel icon: React.ReactNode>{label text}</SectionLabel>`
  - `<BookCall className?: string>{children}</BookCall>` — client; opens Calendly popup.

- [ ] **Step 1: Write `components/ui/Container.tsx`**

```tsx
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${className}`}>{children}</div>;
}
```

- [ ] **Step 2: Write `components/ui/Reveal.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";

export function Reveal({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write `components/ui/SectionLabel.tsx`**

```tsx
export function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-sans text-[11px] uppercase tracking-label text-muted">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-copper text-copper">
        {icon}
      </span>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Write the failing test `components/ui/BookCall.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookCall } from "./BookCall";

describe("BookCall", () => {
  it("renders its children as a button", () => {
    render(<BookCall>Book a call</BookCall>);
    expect(screen.getByRole("button", { name: "Book a call" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run components/ui/BookCall.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 6: Write `components/ui/BookCall.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

export function BookCall({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const id = "calendly-widget-script";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function open() {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: siteConfig.calendlyUrl });
    } else {
      window.open(siteConfig.calendlyUrl, "_blank", "noopener");
    }
  }

  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run components/ui/BookCall.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: UI primitives (Reveal, Container, SectionLabel, BookCall)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Nav + Footer

**Files:**
- Create: `components/site/Nav.tsx`, `components/site/Footer.tsx`

**Interfaces:**
- Consumes: `siteConfig` (nav, social), `BookCall`, next/image.
- Produces: `<Nav />`, `<Footer />`.

- [ ] **Step 1: Write `components/site/Nav.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { BookCall } from "@/components/ui/BookCall";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink2/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/wholeman-logo.jpg" alt="WholeMan" width={44} height={44} className="h-11 w-auto invert" />
        </Link>
        <div className="hidden gap-7 font-sans text-xs uppercase tracking-[0.15em] text-muted md:flex">
          {siteConfig.nav.map((n) => (
            <a key={n.href} href={n.href} className="transition hover:text-bone">{n.label}</a>
          ))}
        </div>
        <BookCall className="rounded-md bg-copper px-4 py-2 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110">
          Book a call →
        </BookCall>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Write `components/site/Footer.tsx`**

```tsx
import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink2 px-6 py-12 text-center md:px-10">
      <Image src="/brand/wholeman-logo.jpg" alt="WholeMan" width={60} height={60} className="mx-auto mb-4 h-14 w-auto opacity-90 invert" />
      <div className="mb-3 flex flex-wrap justify-center gap-4 font-sans text-xs uppercase tracking-[0.15em] text-faint">
        {siteConfig.social.map((s) => (
          <a key={s.label} href={s.href} className="transition hover:text-bone">{s.label}</a>
        ))}
      </div>
      <p className="font-sans text-xs text-faint">© WholeMan {new Date().getFullYear()} · Presence over performance.</p>
    </footer>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: Nav and Footer with logo lockup

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `siteConfig.hero`, `BookCall`, next/image.
- Produces: `<Hero />` — full-bleed photo + dark gradient + centered brand lockup.

- [ ] **Step 1: Write `components/sections/Hero.tsx`**

```tsx
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { BookCall } from "@/components/ui/BookCall";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Image
        src="/photos/ty-hero.jpg"
        alt="Colorado mountains at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink/95" />
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/brand/wholeman-logo.jpg"
          alt="WholeMan — I Am"
          width={180}
          height={180}
          priority
          className="mb-6 h-40 w-auto drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)] invert md:h-44"
        />
        <p className="mb-4 font-display text-2xl italic text-bone md:text-3xl">{siteConfig.hero.tagline}</p>
        <p className="max-w-2xl font-sans text-base leading-relaxed text-muted">{siteConfig.hero.mission}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <BookCall className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110">
            Book a private call
          </BookCall>
          <a href="#podcast" className="rounded-md border border-white/40 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-bone backdrop-blur-sm transition hover:bg-white/10">
            ▶ Listen to the podcast
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: cinematic hero with centered brand lockup

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: The Call + The Work sections

**Files:**
- Create: `components/sections/TheCall.tsx`, `components/sections/TheWork.tsx`

**Interfaces:**
- Consumes: `siteConfig.call`, `siteConfig.work`, `Reveal`, `Container`, `SectionLabel`.
- Produces: `<TheCall />` (id `call`), `<TheWork />`.

- [ ] **Step 1: Write `components/sections/TheCall.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `components/sections/TheWork.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function TheWork() {
  return (
    <section className="bg-gradient-to-b from-charcoal to-[#100e0a] py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>✦</span>}>The work</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            Practices, tools &amp; <span className="italic text-copperlight">pursuits</span>
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {siteConfig.work.map((w, i) => (
            <Reveal key={w.key} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-cardline bg-white/[0.02] p-6">
                <h3 className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-copperlight">{w.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-faint">{w.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: The Call and The Work sections

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Coaching section (Ty photo + booking CTA)

**Files:**
- Create: `components/sections/Coaching.tsx`

**Interfaces:**
- Consumes: `siteConfig.coaching`, `BookCall`, `Reveal`, next/image.
- Produces: `<Coaching />` (id `coaching`) — two-column: pulled-back photo + pitch + perks + Book CTA.

- [ ] **Step 1: Write `components/sections/Coaching.tsx`**

```tsx
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
          src="/photos/ty-hero.jpg"
          alt="Ty Humphries"
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover object-[center_38%]"
        />
        <span className="absolute bottom-4 left-4 rounded-md bg-ink/60 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-wider text-copperlight">
          Ty Humphries · founder
        </span>
      </div>
      <div className="flex flex-col justify-center bg-gradient-to-b from-[#15120d] to-[#100e0a] px-6 py-14 md:px-12">
        <Reveal>
          <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Private coaching with Ty</p>
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
          <p className="mt-3 font-sans text-[11px] text-faint">Opens his calendar · 30 minutes · no pressure</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: Coaching section with photo and booking CTA

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Episode components + Podcast section (TDD on rendering)

**Files:**
- Create: `components/podcast/EpisodeCard.tsx`, `components/podcast/FeaturedEpisode.tsx`, `components/podcast/EpisodeCard.test.tsx`, `components/sections/PodcastSection.tsx`

**Interfaces:**
- Consumes: `Episode`, `Podcast` types, `Reveal`, next/image, `siteConfig.social`.
- Produces:
  - `<EpisodeCard episode: Episode />`
  - `<FeaturedEpisode episode: Episode coverImage: string | null />`
  - `<PodcastSection podcast: Podcast />` (id `podcast`)

- [ ] **Step 1: Write the failing test `components/podcast/EpisodeCard.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EpisodeCard } from "./EpisodeCard";
import type { Episode } from "@/lib/podcast.types";

const ep: Episode = {
  id: "1", title: "The Art of Self Delusion w/ Brent Perkins", guest: "Brent Perkins",
  description: "x", pubDate: "2026-05-11T12:00:00Z", pubDateLabel: "May 11, 2026",
  durationSeconds: 5687, durationLabel: "1h 35m", audioUrl: null, episodeNumber: 20,
  link: "https://show/20",
};

describe("EpisodeCard", () => {
  it("shows episode number, title and duration", () => {
    render(<EpisodeCard episode={ep} />);
    expect(screen.getByText(/Ep 20/i)).toBeInTheDocument();
    expect(screen.getByText(/The Art of Self Delusion/i)).toBeInTheDocument();
    expect(screen.getByText(/1h 35m/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run components/podcast/EpisodeCard.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/podcast/EpisodeCard.tsx`**

```tsx
import type { Episode } from "@/lib/podcast.types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const href = episode.link || "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-3 rounded-lg border border-cardline bg-white/[0.02] p-3 transition hover:border-copper/60"
    >
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-copper text-xs text-ink">▶</span>
      <span className="min-w-0">
        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-faint">
          {episode.episodeNumber ? `Ep ${episode.episodeNumber}` : "Episode"}
        </span>
        <span className="block truncate font-display text-[15px] text-bone">{episode.title}</span>
        <span className="font-sans text-[11px] text-faint">
          {episode.pubDateLabel}{episode.durationLabel ? ` · ${episode.durationLabel}` : ""}
        </span>
      </span>
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npx vitest run components/podcast/EpisodeCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write `components/podcast/FeaturedEpisode.tsx`**

```tsx
import type { Episode } from "@/lib/podcast.types";

export function FeaturedEpisode({ episode, coverImage }: { episode: Episode; coverImage: string | null }) {
  return (
    <div className="flex flex-1 overflow-hidden rounded-xl border border-cardline bg-black/40">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="hidden w-36 flex-none object-cover sm:block" />
      )}
      <div className="p-5">
        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-copperlight">
          Newest{episode.episodeNumber ? ` · Ep ${episode.episodeNumber}` : ""}
        </span>
        <h3 className="my-2 font-display text-xl text-bone">
          {episode.guest ? episode.title.replace(new RegExp(`\\s+(?:w/|with)\\s+${episode.guest}$`, "i"), "") : episode.title}
          {episode.guest && <span className="text-copper"> w/ {episode.guest}</span>}
        </h3>
        <p className="mb-3 font-sans text-[11px] text-faint">
          {episode.pubDateLabel}{episode.durationLabel ? ` · ${episode.durationLabel}` : ""}
        </p>
        <a
          href={episode.link || "#"}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-md bg-copper px-5 py-2.5 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110"
        >
          ▶ Play episode
        </a>
      </div>
    </div>
  );
}
```

Note: the featured cover uses a plain `<img>` (remote Anchor CDN URL) to avoid configuring `next.config` remote image domains; it is decorative.

- [ ] **Step 6: Write `components/sections/PodcastSection.tsx`**

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { FeaturedEpisode } from "@/components/podcast/FeaturedEpisode";
import { siteConfig } from "@/lib/site";
import type { Podcast } from "@/lib/podcast.types";

export function PodcastSection({ podcast }: { podcast: Podcast }) {
  const [featured, ...rest] = podcast.episodes;
  const recent = rest.slice(0, 3);

  return (
    <section id="podcast" className="bg-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>●</span>}>
            The WholeMan Podcast
            <span className="ml-2 normal-case tracking-normal text-faint">
              · live from his feed{podcast.episodes.length ? ` · ${podcast.episodes.length} episodes` : ""}
            </span>
          </SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            Conversations on becoming <span className="italic text-copperlight">whole</span>
          </h2>
          {podcast.description && (
            <p className="mt-2 max-w-3xl font-display text-[15px] italic text-faint">{podcast.description}</p>
          )}
        </Reveal>

        {featured ? (
          <div className="mt-7 flex flex-col gap-5 md:flex-row">
            <Reveal className="flex md:flex-[1.4]">
              <FeaturedEpisode episode={featured} coverImage={podcast.coverImage} />
            </Reveal>
            <div className="flex flex-1 flex-col gap-3">
              {recent.map((ep, i) => (
                <Reveal key={ep.id} delay={i * 0.08}>
                  <EpisodeCard episode={ep} />
                </Reveal>
              ))}
              <a href="/podcast" className="rounded-lg border border-cardline px-3 py-3 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-faint transition hover:text-bone">
                View all episodes →
              </a>
            </div>
          </div>
        ) : (
          <p className="mt-6 font-sans text-sm text-faint">Episodes coming soon. Listen on{" "}
            <a className="text-copper" href={siteConfig.social[0].href}>Spotify</a>.
          </p>
        )}

        <div className="mt-6 font-sans text-xs text-faint">
          Listen on:{" "}
          {siteConfig.social.filter((s) => s.label !== "Instagram").map((s, i, arr) => (
            <span key={s.label}>
              <a className="text-copper hover:underline" href={s.href} target="_blank" rel="noopener">{s.label}</a>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: podcast episode components and homepage podcast section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: Assemble homepage + /podcast page (ISR)

**Files:**
- Modify: `app/page.tsx`
- Create: `app/podcast/page.tsx`

**Interfaces:**
- Consumes: `getPodcast`, all section components, `Nav`, `Footer`.
- Produces: full homepage at `/` and all-episodes index at `/podcast`, both ISR (revalidate 3600).

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TheCall } from "@/components/sections/TheCall";
import { TheWork } from "@/components/sections/TheWork";
import { Coaching } from "@/components/sections/Coaching";
import { PodcastSection } from "@/components/sections/PodcastSection";
import { getPodcast } from "@/lib/podcast";

export const revalidate = 3600;

export default async function Home() {
  const podcast = await getPodcast();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TheCall />
        <TheWork />
        <Coaching />
        <PodcastSection podcast={podcast} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create `app/podcast/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { getPodcast } from "@/lib/podcast";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Podcast — WholeMan" };

export default async function PodcastIndex() {
  const podcast = await getPodcast();
  return (
    <>
      <Nav />
      <main className="bg-ink py-16 md:py-24">
        <Container>
          <h1 className="font-display text-4xl font-normal md:text-5xl">{podcast.title}</h1>
          {podcast.description && (
            <p className="mt-3 max-w-3xl font-display text-lg italic text-faint">{podcast.description}</p>
          )}
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {podcast.episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
          {podcast.episodes.length === 0 && (
            <p className="mt-6 font-sans text-sm text-faint">Episodes are loading — check back shortly.</p>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Run full build + tests**

Run:
```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm test && npm run build
```
Expected: tests PASS; build succeeds; `/` and `/podcast` listed as routes. (Build fetches the live feed — confirm episodes are pulled or the graceful fallback logs without failing.)

- [ ] **Step 4: Manual smoke check**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm run dev` then open `http://localhost:3000`.
Verify: hero lockup over the mountain photo, sections render, real episodes appear, "Book a call" opens Calendly popup. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: assemble homepage and /podcast index with ISR

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 13: SEO/metadata, env example, deploy to Vercel

**Files:**
- Modify: `app/layout.tsx` (openGraph metadata, metadataBase)
- Create: `.env.example`
- Modify: `README.md` (deploy notes)

**Interfaces:**
- Produces: production metadata; documented env; live Vercel deployment from `main`.

- [ ] **Step 1: Add OpenGraph + metadataBase to `app/layout.tsx` metadata**

Replace the `metadata` export with:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://wholeman.org"),
  title: "WholeMan — Presence over performance",
  description:
    "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration. Private coaching and the WholeMan Podcast.",
  openGraph: {
    title: "WholeMan — Presence over performance",
    description: "A recovery mission for men. Private coaching + the WholeMan Podcast.",
    url: "https://wholeman.org",
    siteName: "WholeMan",
    images: [{ url: "/photos/ty-hero.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};
```

- [ ] **Step 2: Create `.env.example`**

```bash
# Calendly scheduling link used by all "Book a call" CTAs
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-handle/intro-call
```

- [ ] **Step 3: Add deploy notes to `README.md`** (append section)

```markdown
## Develop & Deploy

```bash
# load node (nvm) then:
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests
npm run build    # production build
```

Deployed on Vercel from `main` (auto-deploy). Set `NEXT_PUBLIC_CALENDLY_URL`
in Vercel project env vars. The podcast section pulls from the RSS feed at
build time and revalidates hourly (ISR).
```

- [ ] **Step 4: Final build + tests green**

Run: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; cd ~/wholeman && npm test && npm run build`
Expected: all green.

- [ ] **Step 5: Commit and push**

```bash
cd ~/wholeman && git add -A
git commit -m "feat: production metadata, env example, deploy docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
GIT_SSH_COMMAND="ssh -o BatchMode=yes" git push origin main
```

- [ ] **Step 6: Connect Vercel (manual, by Charlie)**

In Vercel: New Project → import `ch4rlie/wholeman` → framework auto-detected (Next.js) → add env var `NEXT_PUBLIC_CALENDLY_URL` → Deploy. Subsequent pushes to `main` auto-deploy. Point `wholeman.org` DNS at Vercel when ready to go live.

---

## Self-Review Notes (coverage check)

- **Cinematic/outdoor look, palette, fonts:** Tasks 1, 6–11 (tokens + section styling). ✓
- **Full-bleed hero + centered logo lockup:** Task 8. ✓
- **The Call / The Work / Coaching (Ty photo) / Podcast / Nav / Footer:** Tasks 7–11. ✓
- **Coaching-first CTA (Calendly, env-configurable):** Tasks 4, 6 (BookCall), 8, 10, 13. ✓
- **Podcast from RSS at build w/ ISR + graceful fallback:** Tasks 3, 11, 12. ✓
- **No email/auth/store; extensible structure:** enforced by scope; component/data boundaries are clean. ✓
- **Vercel deploy from main (deploy key set):** Task 13. ✓
- **Tests (TDD on parsing + key component renders):** Tasks 2, 3, 6, 11. ✓

**Open items intentionally deferred (from spec §10):** exact Coaching photo treatment, final typefaces/custom wordmark, Calendly-vs-Cal.com (defaulted to Calendly, swap via env), Mission-as-section-vs-page (chose homepage sections + `/podcast`), Replicate image enhancement pass (pre-launch polish, not a build blocker).
