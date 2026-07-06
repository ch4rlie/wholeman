# WholeMan × Brotherhood Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Absorb the Conscious Brotherhood men's-circles offering into the WholeMan site as "Circles" (+ free monthly brotherhood call), add Charlie Grove as co-founder, and shift the site's primary CTA from coaching to the brotherhood call.

**Architecture:** All copy lives in `lib/site.ts` (`siteConfig as const`); section components in `components/sections/` (homepage) and `components/circles/` (/circles page) are thin wrappers reading from it. The apply funnel (form → `/api/apply` → Resend email) is ported from `~/consciousbro` and restyled. A new shared `Accordion` UI component powers both the 12-archetype section and the circles FAQ.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, Tailwind CSS 3.4, Framer Motion 11, Vitest + Testing Library, Zod v4, Resend.

**Spec:** `docs/superpowers/specs/2026-07-06-circles-merge-design.md`

## Global Constraints

- Work on branch `feat/circles-merge`. **NEVER push to origin** — Vercel auto-deploys `main`. Charlie pushes after final review.
- Next.js 16.2.9 has breaking changes vs. training data: read the relevant guide in `node_modules/next/dist/docs/` before using unfamiliar APIs (per AGENTS.md).
- Design tokens (tailwind.config.ts): `ink #0a0a0b`, `ink2`, `bone`, `muted`, `faint`, `copper`, `copperlight`, `charcoal`, `cardline`. Fonts: `font-display` (Cormorant Garamond, headlines, often `italic text-copperlight` on pivotal words), `font-sans` (Inter). Section eyebrows use `SectionLabel`; scroll reveals use `Reveal`; page width uses `Container`.
- The **988** crisis-line copy is verbatim and non-negotiable: it appears in the footer disclaimer and in two FAQ answers exactly as written in Task 1.
- Migrated copy keeps its direct, grounded tone; only brand references change ("The Conscious Brotherhood" → WholeMan framing).
- Source repo for ported content/code: `//wsl.localhost/Ubuntu-24.04/home/charlie/consciousbro` (read-only — never modify it).
- Run tests with `npm test` (vitest run). Lint with `npm run lint`. All existing tests must stay green.
- Commit after every task (conventional commits, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`).

---

### Task 0: Branch + dependencies

**Files:** none (git + npm only)

- [ ] **Step 1: Create the branch**

```bash
cd ~/wholeman && git checkout -b feat/circles-merge
```

- [ ] **Step 2: Install new dependencies**

```bash
npm install resend zod
```

Expected: `resend` and `zod` (v4.x) added to `package.json` dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add resend + zod for circle application funnel"
```

---

### Task 1: Extend `lib/site.ts` with all circles/founders content

**Files:**
- Modify: `lib/site.ts`
- Test: `test/site.test.ts`

**Interfaces (Produces — later tasks rely on these exact paths):**
- `siteConfig.lumaUrl: string`, `siteConfig.nextCall: { date: string; time: string }`, `siteConfig.contactEmail: string`
- `siteConfig.nav` (now Circles/Coaching/About/Podcast)
- `siteConfig.hero.primaryCta: string`, `siteConfig.hero.secondaryCta: string`
- `siteConfig.brotherhoodCall: { header; body; cost; who; where }`
- `siteConfig.circles: { headline; header; body; bullets: readonly string[]; note }`
- `siteConfig.agreements: { header; intro; items: readonly (readonly [string, string])[] }`
- `siteConfig.whoFor: { forHeader; forItems; notHeader; notItems }`
- `siteConfig.survival: { header; lede: readonly string[]; prompt; recognize; strategies: readonly { name; belief; showsUp: readonly string[]; wayForward: readonly string[] }[] }` (12 strategies)
- `siteConfig.circlesFaq: readonly { q: string; a: string }[]` (7 items)
- `siteConfig.finalCta: { header; subhead }`
- `siteConfig.disclaimer: string`
- `siteConfig.founders: { header; intro; people: readonly { name: string; role: string; photo: string | null; bio: string | null }[] }`
- `siteConfig.coaching.label: string`, `siteConfig.coaching.photoCaption: string` (added fields)

- [ ] **Step 1: Write the failing test**

Create `test/site.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site";

describe("siteConfig circles content", () => {
  it("has 12 survival strategies", () => {
    expect(siteConfig.survival.strategies).toHaveLength(12);
    expect(siteConfig.survival.strategies[0].name).toBe("The Nice Guy");
    expect(siteConfig.survival.strategies[11].name).toBe("The Avoider");
  });

  it("keeps the 988 guardrails verbatim", () => {
    expect(siteConfig.disclaimer).toContain("call/text 988 (US)");
    const faq988 = siteConfig.circlesFaq.filter((f) => f.a.includes("988 (US)"));
    expect(faq988).toHaveLength(2);
  });

  it("has six agreements", () => {
    expect(siteConfig.agreements.items).toHaveLength(6);
    expect(siteConfig.agreements.items[0][0]).toBe("Confidentiality.");
  });

  it("lists both founders with equal billing", () => {
    const names = siteConfig.founders.people.map((p) => p.name);
    expect(names).toEqual(["Ccowl", "Charlie Grove"]);
    expect(siteConfig.founders.people.every((p) => p.role === "Co-founder")).toBe(true);
  });

  it("navigates to circles, coaching, about, podcast", () => {
    expect(siteConfig.nav.map((n) => n.href)).toEqual([
      "/circles",
      "/coaching",
      "/about",
      "/podcast",
    ]);
  });

  it("has the brotherhood call config", () => {
    expect(siteConfig.lumaUrl).toMatch(/^https:\/\/luma\.com\//);
    expect(siteConfig.nextCall.date).toBeTruthy();
    expect(siteConfig.brotherhoodCall.cost).toBe("Free");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/site.test.ts`
Expected: FAIL — `survival`, `disclaimer`, etc. do not exist on `siteConfig`.

- [ ] **Step 3: Extend `lib/site.ts`**

Apply these edits to the existing `siteConfig` object (keep everything not mentioned):

**3a.** Add config values at the top (after `calendlyUrl`):

```ts
  lumaUrl: "https://luma.com/ryyv3hx9",
  nextCall: { date: "July 23", time: "6pm PT / 9pm ET" },
  // NOTE: confirm this mailbox exists before launch (used as mailto fallback on the apply form)
  contactEmail: "hello@wholeman.org",
```

**3b.** Replace the `nav` array:

```ts
  nav: [
    { label: "Circles", href: "/circles" },
    { label: "Coaching", href: "/coaching" },
    { label: "About", href: "/about" },
    { label: "Podcast", href: "/podcast" },
  ],
```

**3c.** Add CTAs to `hero` (keep `tagline` and `mission` unchanged):

```ts
  hero: {
    tagline: "Presence over performance.",
    mission:
      "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration.",
    primaryCta: "Join the free brotherhood call",
    secondaryCta: "Explore the circles",
  },
```

**3d.** Replace `coaching` (adds `label` + `photoCaption`, reframes body to two guides):

```ts
  coaching: {
    label: "Private coaching",
    heading: "Walk the path with a guide.",
    body:
      "Two men, one mission: to help you stop performing and come home to yourself. Direct, embodied, unflinching 1:1 work with Charlie or Ccowl — body, breath, and belief, not just talk.",
    perks: [
      "Deep 1:1 work tailored to where you're stuck",
      "A brotherhood of accountability and honesty",
      "From despair to integration — the phoenix path",
    ],
    photoCaption: "Ccowl · co-founder",
  },
```

**3e.** Add the new content blocks before the closing `} as const;`:

```ts
  brotherhoodCall: {
    header: "Start here: the free monthly brotherhood call.",
    body:
      "Once a month, men gather on a call to get something off their chest, hear from other men, and leave a little less alone. No experience needed. No pressure to talk before you're ready. Come exactly as you are.",
    cost: "Free",
    who: "Any man who's tired of doing it alone",
    where: "Zoom (link after you RSVP)",
  },
  circles: {
    headline: "You were never meant to carry it alone.",
    header: "Go deeper: join a circle.",
    body:
      "A circle is a small group of men (6 to 8) who meet regularly with a trained facilitator. Same men, every session. That's where the real trust and accountability get built. This is where the work goes from \"a good call\" to a brotherhood that has your back week after week.",
    bullets: [
      "Small, consistent group of 6 to 8 men",
      "Facilitated sessions with clear agreements",
      "A private group thread for support and accountability between meetings",
      "$99/month (month to month, cancel anytime)",
    ],
    note: "Circles are by application so we can keep each one safe and committed.",
  },
  agreements: {
    header: "How we keep it real and safe.",
    intro: "We run on a few agreements every man commits to:",
    items: [
      ["Confidentiality.", "What's said here stays here."],
      ["Ownership.", "Each man speaks from his own experience and owns it."],
      ["Consent before feedback.", "We ask before offering a reflection or advice."],
      ["No rescuing.", "We let a man feel what he feels instead of rushing to fix him."],
      ["Presence.", "Phones down. Fully here."],
      ["Safety.", "Anyone can call \"safety\" and everything stops."],
    ],
  },
  whoFor: {
    forHeader: "This is for you if…",
    forItems: [
      "You're ready to stop doing your life on hard mode, alone.",
      "You're willing to be honest, even when it's uncomfortable.",
      "You want to take ownership of your life, your marriage, your kids.",
      "You can show up consistently and listen as well as you talk.",
    ],
    notHeader: "This isn't for you if…",
    notItems: [
      "You're in acute crisis and need clinical care. This is peer support, not therapy.",
      "You're looking for a pickup-artist or red-pill space. That's not what we do.",
      "You want a one-time fix without showing up.",
      "You're looking for someone to blame instead of something to own.",
    ],
  },
  survival: {
    header: "What's your survival strategy?",
    lede: [
      "Every man has a survival strategy. At some point, it probably kept you safe.",
      "But what protected you as a boy may be limiting you as a man. You don't need to become someone new. You need the courage to stop pretending to be someone you're not.",
      "None of these mean something is wrong with you. Most of us learned, often as children, that we had to become someone in order to be loved, accepted, safe, or successful. Those strategies may have protected you once. But if they're running your life today, they may be keeping you from the life and relationships you actually want.",
    ],
    prompt: "See if you recognize yourself.",
    recognize:
      "You won't fit just one. Most men recognize themselves in several of these. That's normal, not a diagnosis. Open any that feel familiar.",
    strategies: [
      // MIGRATE VERBATIM: copy the full 12-entry `strategies` array from
      // //wsl.localhost/Ubuntu-24.04/home/charlie/consciousbro/lib/copy.ts lines 92–277
      // (survivalStrategy.strategies). Shape per entry:
      //   { name: string, belief: string, showsUp: string[], wayForward: string[] }
      // First entry is "The Nice Guy" (belief: "If everyone is happy with me, I'll finally be loved."),
      // last is "The Avoider" (belief: "If I avoid discomfort, I'll be okay.").
      // Copy all 12 objects exactly — no edits, no summarizing.
    ],
  },
  circlesFaq: [
    { q: "Is this therapy?", a: "No. This is peer support and personal-growth work among men. It complements clinical care but doesn't replace it. If you're in crisis, please reach out to a professional or call/text 988 (US)." },
    { q: "Is it religious?", a: "No. Men of any faith or none are welcome. We don't push a doctrine." },
    { q: "What actually happens on the call?", a: "We open, men share what's alive for them, others listen and reflect, and we close. You can pass. Many men say nothing their first time and still leave lighter." },
    { q: "Do I have to talk?", a: "No. Show up, listen, breathe. Speak when you're ready." },
    { q: "Is this a red-pill or pickup thing?", a: "No. We're not here to blame anyone or \"win\" at anything. We're here to get honest and grow up well." },
    { q: "Online or in person?", a: "Calls and circles are online for now." },
    { q: "What if I'm really struggling right now?", a: "You're welcome here, and if you're in acute crisis, peer support isn't enough on its own. Please contact a licensed professional or 988 (US). We'll still be here." },
  ],
  finalCta: {
    header: "You don't have to do this alone anymore.",
    subhead: "Start with one call. See what it's like to be heard.",
  },
  disclaimer:
    "WholeMan offers peer support and personal-growth experiences among men. It is not therapy, counseling, or a substitute for professional mental health treatment. If you are in crisis or thinking about harming yourself, contact emergency services or call/text 988 (US) right away.",
  founders: {
    header: "Who's leading this.",
    intro:
      "We're in this together, because we believe what we're asking of you: no man should do it alone.",
    people: [
      { name: "Ccowl", role: "Co-founder", photo: "/photos/ccowl.jpeg", bio: null },
      { name: "Charlie Grove", role: "Co-founder", photo: null, bio: null },
    ],
  },
```

Note on types: `photo: string | null` / `bio: string | null` inside `as const` — annotate the `people` entries so `null` fields don't narrow to `never`-ish literal types. If TypeScript complains downstream, type the array explicitly:

```ts
people: [
  { name: "Ccowl", role: "Co-founder", photo: "/photos/ccowl.jpeg", bio: null },
  { name: "Charlie Grove", role: "Co-founder", photo: null, bio: null },
] as readonly { name: string; role: string; photo: string | null; bio: string | null }[],
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run test/site.test.ts`
Expected: PASS (6 tests). Also run `npx tsc --noEmit` — no type errors.

- [ ] **Step 5: Commit**

```bash
git add lib/site.ts test/site.test.ts
git commit -m "feat: add circles, founders, and brotherhood-call content to siteConfig"
```

---

### Task 2: Apply schema + validation (ported)

**Files:**
- Create: `lib/apply-schema.ts`
- Test: `lib/apply-schema.test.ts`

**Interfaces:**
- Produces: `applySchema` (Zod object), `type ApplyInput`, `validateApply(data: Record<string, unknown>): { ok: true; value: ApplyInput } | { ok: false; errors: Record<string, string>; botDetected: boolean }`

- [ ] **Step 1: Write the failing test**

Create `lib/apply-schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateApply } from "@/lib/apply-schema";

const valid = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true,
};

describe("validateApply", () => {
  it("accepts a valid application", () => {
    const r = validateApply(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe("Test Man");
  });

  it("rejects missing required fields with per-field errors", () => {
    const r = validateApply({ ...valid, name: "", email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBeTruthy();
      expect(r.errors.email).toBeTruthy();
      expect(r.botDetected).toBe(false);
    }
  });

  it("rejects when agreement is not accepted", () => {
    const r = validateApply({ ...valid, agreement: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.agreement).toBeTruthy();
  });

  it("flags the honeypot without field errors", () => {
    const r = validateApply({ ...valid, website: "spam.example" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });

  it("defaults optional priorExperience to empty string", () => {
    const { priorExperience: _omit, ...rest } = valid;
    const r = validateApply(rest);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.priorExperience).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/apply-schema.test.ts`
Expected: FAIL — cannot resolve `@/lib/apply-schema`.

- [ ] **Step 3: Create `lib/apply-schema.ts`** (ported verbatim from consciousbro — Zod v4 syntax):

```ts
import { z } from "zod";

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required."),
  email: z.string().email("Enter a valid email."),
  drawingIn: z.string().min(1, "Tell us what's drawing you in."),
  availability: z.string().min(1, "Let us know your availability."),
  priorExperience: z.string().optional().default(""),
  // Zod v4: `errorMap` is deprecated; use `error` (string shorthand) instead.
  agreement: z.literal(true, { error: "Please accept the agreement." }),
});

export type ApplyInput = z.infer<typeof applySchema>;

type Result =
  | { ok: true; value: ApplyInput }
  | { ok: false; errors: Record<string, string>; botDetected: boolean };

export function validateApply(data: Record<string, unknown>): Result {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, errors: { form: "Invalid submission." }, botDetected: false };
  }
  // Honeypot: a hidden "website" field humans never see. Filled => bot.
  if (data.website != null && String(data.website).trim() !== "") {
    return { ok: false, errors: {}, botDetected: true };
  }
  const parsed = applySchema.safeParse(data);
  if (parsed.success) return { ok: true, value: parsed.data };
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors, botDetected: false };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/apply-schema.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/apply-schema.ts lib/apply-schema.test.ts
git commit -m "feat: port circle application schema + honeypot validation"
```

---

### Task 3: Application email sender

**Files:**
- Create: `lib/apply-email.ts`
- Test: `lib/apply-email.test.ts`

**Interfaces:**
- Consumes: `ApplyInput` from `lib/apply-schema.ts`
- Produces: `isEmailConfigured(): boolean`, `sendApplicationEmail(input: ApplyInput): Promise<void>`
- Env contract: `RESEND_API_KEY` (secret), `APPLY_TO_EMAIL` (comma-separated recipients — both founders), `APPLY_FROM_EMAIL` (optional, defaults to `applications@wholeman.org`).

- [ ] **Step 1: Write the failing test**

Create `lib/apply-email.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn(async () => ({ error: null }));
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: sendMock } })),
}));

import { isEmailConfigured, sendApplicationEmail } from "@/lib/apply-email";

const input = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true as const,
};

describe("apply email", () => {
  beforeEach(() => {
    sendMock.mockClear();
    vi.stubEnv("RESEND_API_KEY", "re_test_123");
    vi.stubEnv("APPLY_TO_EMAIL", "a@example.com,b@example.com");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("is configured only when both env vars are set", () => {
    expect(isEmailConfigured()).toBe(true);
    vi.stubEnv("APPLY_TO_EMAIL", "");
    expect(isEmailConfigured()).toBe(false);
  });

  it("sends to all recipients with reply-to set to the applicant", async () => {
    await sendApplicationEmail(input);
    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.to).toEqual(["a@example.com", "b@example.com"]);
    expect(arg.replyTo).toBe("test@example.com");
    expect(String(arg.subject)).toContain("Test Man");
    expect(String(arg.text)).toContain("Weekday evenings");
  });

  it("throws when env vars are missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendApplicationEmail(input)).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/apply-email.test.ts`
Expected: FAIL — cannot resolve `@/lib/apply-email`.

- [ ] **Step 3: Create `lib/apply-email.ts`**:

```ts
import { Resend } from "resend";
import type { ApplyInput } from "@/lib/apply-schema";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.APPLY_TO_EMAIL);
}

export async function sendApplicationEmail(input: ApplyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.APPLY_TO_EMAIL;
  if (!apiKey || !to) throw new Error("RESEND_API_KEY / APPLY_TO_EMAIL not set");
  const resend = new Resend(apiKey);
  const from = process.env.APPLY_FROM_EMAIL ?? "applications@wholeman.org";
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((s) => s.trim()).filter(Boolean),
    replyTo: input.email,
    subject: `New circle application from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What's drawing you in: ${input.drawingIn}`,
      `Availability: ${input.availability}`,
      `Prior men's-work experience: ${input.priorExperience || "(none given)"}`,
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run lib/apply-email.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/apply-email.ts lib/apply-email.test.ts
git commit -m "feat: Resend application email sender with multi-recipient support"
```

---

### Task 4: `/api/apply` route handler

**Files:**
- Create: `app/api/apply/route.ts`
- Test: `app/api/apply/route.test.ts`

**Interfaces:**
- Consumes: `validateApply` (Task 2), `isEmailConfigured`/`sendApplicationEmail` (Task 3)
- Produces: `POST /api/apply` — 200 `{ok:true}` on success or bot (silent drop); 400 `{ok:false, errors}` on validation failure; 400 `{ok:false, error:"bad_json"}`; 502 `{ok:false, error:"send_failed"}` on email failure. Dev-mode soft-success when email unconfigured.

- [ ] **Step 1: Write the failing test**

Create `app/api/apply/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMock = vi.fn(async () => undefined);
const configuredMock = vi.fn(() => true);
vi.mock("@/lib/apply-email", () => ({
  sendApplicationEmail: sendMock,
  isEmailConfigured: configuredMock,
}));

import { POST } from "@/app/api/apply/route";

const valid = {
  name: "Test Man",
  email: "test@example.com",
  drawingIn: "Tired of doing it alone.",
  availability: "Weekday evenings",
  priorExperience: "",
  agreement: true,
};

function req(body: unknown) {
  return new Request("http://localhost/api/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/apply", () => {
  beforeEach(() => {
    sendMock.mockClear();
    configuredMock.mockReturnValue(true);
  });

  it("returns 200 and sends email for a valid application", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("returns 400 with field errors for invalid input", async () => {
    const res = await POST(req({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors.email).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently drops bots with a 200", async () => {
    const res = await POST(req({ ...valid, website: "spam" }));
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 on malformed JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/apply", { method: "POST", body: "{nope" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 502 when the email send fails", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/api/apply/route.test.ts`
Expected: FAIL — cannot resolve `@/app/api/apply/route`.

- [ ] **Step 3: Create `app/api/apply/route.ts`** (ported, imports adjusted):

```ts
import { NextResponse } from "next/server";
import { validateApply } from "@/lib/apply-schema";
import { isEmailConfigured, sendApplicationEmail } from "@/lib/apply-email";

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const result = validateApply(data);
  if (!result.ok) {
    if (result.botDetected) return NextResponse.json({ ok: true }, { status: 200 }); // silently drop
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === "production";

  if (!isEmailConfigured()) {
    if (isProd) {
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    console.warn("[apply] DEV soft-success (email not configured). Payload:", result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendApplicationEmail(result.value);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[apply] send failed:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/api/apply/route.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/api/apply/route.ts app/api/apply/route.test.ts
git commit -m "feat: /api/apply route with validation, honeypot drop, Resend send"
```

---

### Task 5: Shared `Accordion` UI component

**Files:**
- Create: `components/ui/Accordion.tsx`
- Test: `components/ui/Accordion.test.tsx`

**Interfaces:**
- Produces: `Accordion({ items }: { items: { id: string; title: React.ReactNode; content: React.ReactNode }[] })` — multi-open, accessible (`button[aria-expanded]` + labelled region), WholeMan-styled (cardline borders, copper accents).

- [ ] **Step 1: Write the failing test**

Create `components/ui/Accordion.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

const items = [
  { id: "a", title: "First title", content: <p>First content</p> },
  { id: "b", title: "Second title", content: <p>Second content</p> },
];

describe("Accordion", () => {
  it("renders all titles with panels closed", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: /First title/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText("First content")).not.toBeInTheDocument();
  });

  it("opens and closes a panel on click, allowing multiple open", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.click(screen.getByRole("button", { name: /First title/ }));
    await user.click(screen.getByRole("button", { name: /Second title/ }));
    expect(screen.getByText("First content")).toBeInTheDocument();
    expect(screen.getByText("Second content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /First title/ }));
    expect(screen.queryByText("First content")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/Accordion.test.tsx`
Expected: FAIL — cannot resolve `./Accordion`.

- [ ] **Step 3: Create `components/ui/Accordion.tsx`**:

```tsx
"use client";

import { useState } from "react";

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="divide-y divide-cardline border-y border-cardline">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-copperlight"
            >
              <span className="font-display text-xl text-bone md:text-2xl">{item.title}</span>
              <span
                aria-hidden
                className={`flex-shrink-0 text-copper transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div id={`accordion-panel-${item.id}`} className="pb-6">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/ui/Accordion.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Accordion.tsx components/ui/Accordion.test.tsx
git commit -m "feat: accessible multi-open Accordion UI component"
```

---

### Task 6: Survival Strategies homepage section

**Files:**
- Create: `components/sections/SurvivalStrategies.tsx`
- Test: `components/sections/SurvivalStrategies.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.survival` (Task 1), `Accordion` (Task 5), `Container`, `Reveal`, `SectionLabel`
- Produces: `SurvivalStrategies()` server-compatible section component with `id="survival"`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/SurvivalStrategies.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SurvivalStrategies } from "./SurvivalStrategies";

describe("SurvivalStrategies", () => {
  it("renders the heading and all 12 archetype triggers", () => {
    render(<SurvivalStrategies />);
    expect(screen.getByText(/survival strategy\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The Nice Guy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /The Avoider/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(12);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/SurvivalStrategies.test.tsx`
Expected: FAIL — cannot resolve `./SurvivalStrategies`.

- [ ] **Step 3: Create `components/sections/SurvivalStrategies.tsx`**:

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

export function SurvivalStrategies() {
  const { header, lede, prompt, recognize, strategies } = siteConfig.survival;
  return (
    <section id="survival" className="border-t border-white/5 bg-gradient-to-b from-[#0d0c0a] to-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>◈</span>}>The mask</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{header}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 max-w-3xl space-y-4">
            {lede.map((p) => (
              <p key={p} className="font-sans text-[15px] leading-relaxed text-muted">{p}</p>
            ))}
            <p className="font-display text-xl italic text-copperlight">{prompt}</p>
            <p className="font-sans text-sm text-faint">{recognize}</p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10">
            <Accordion
              items={strategies.map((s) => ({
                id: s.name,
                title: s.name,
                content: (
                  <div className="space-y-4">
                    <p className="font-display text-lg italic text-copperlight">&ldquo;{s.belief}&rdquo;</p>
                    <div>
                      <p className="mb-2 font-sans text-[11px] uppercase tracking-label text-copper">How it shows up</p>
                      <ul className="space-y-1.5">
                        {s.showsUp.map((line) => (
                          <li key={line} className="relative pl-6 font-sans text-sm leading-relaxed text-muted">
                            <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-sans text-[11px] uppercase tracking-label text-copper">The way forward</p>
                      <ul className="space-y-1.5">
                        {s.wayForward.map((line) => (
                          <li key={line} className="relative pl-6 font-sans text-sm leading-relaxed text-muted">
                            <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/sections/SurvivalStrategies.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/SurvivalStrategies.tsx components/sections/SurvivalStrategies.test.tsx
git commit -m "feat: 12-archetype Survival Strategies homepage section"
```

---

### Task 7: Circles homepage section (teaser)

**Files:**
- Create: `components/sections/Circles.tsx`
- Test: `components/sections/Circles.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.circles`, `siteConfig.brotherhoodCall`, `siteConfig.nextCall`, `siteConfig.lumaUrl` (Task 1)
- Produces: `Circles()` section with `id="circles"`; primary link → Luma RSVP, secondary → `/circles`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/Circles.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Circles } from "./Circles";
import { siteConfig } from "@/lib/site";

describe("Circles section", () => {
  it("renders the headline and both offers", () => {
    render(<Circles />);
    expect(screen.getByText(/never meant to carry it alone/i)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.brotherhoodCall.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
  });

  it("links the RSVP to Luma and the detail link to /circles", () => {
    render(<Circles />);
    expect(screen.getByRole("link", { name: /rsvp/i })).toHaveAttribute("href", siteConfig.lumaUrl);
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "/circles");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Circles.test.tsx`
Expected: FAIL — cannot resolve `./Circles`.

- [ ] **Step 3: Create `components/sections/Circles.tsx`**:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function Circles() {
  const { circles, brotherhoodCall, nextCall, lumaUrl } = siteConfig;
  return (
    <section id="circles" className="border-t border-white/5 bg-gradient-to-b from-[#12100c] to-ink py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>○</span>}>The brotherhood</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{circles.headline}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
            WholeMan circles are small groups of men who tell the truth, own their lives, and have
            each other&apos;s backs. It starts with one honest conversation.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
              <h3 className="font-display text-2xl text-bone">{brotherhoodCall.header}</h3>
              <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-muted">{brotherhoodCall.body}</p>
              <dl className="mt-5 space-y-1 font-sans text-sm text-faint">
                <div><dt className="inline text-copper">Cost: </dt><dd className="inline">{brotherhoodCall.cost}</dd></div>
                <div><dt className="inline text-copper">Who: </dt><dd className="inline">{brotherhoodCall.who}</dd></div>
                <div><dt className="inline text-copper">Where: </dt><dd className="inline">{brotherhoodCall.where}</dd></div>
              </dl>
              <a
                href={lumaUrl}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-block self-start rounded-md bg-copper px-6 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
              >
                RSVP for {nextCall.date} — free
              </a>
              <p className="mt-2 font-sans text-[11px] text-faint">{nextCall.date} · {nextCall.time}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
              <h3 className="font-display text-2xl text-bone">{circles.header}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted">{circles.body}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {circles.bullets.map((b) => (
                  <li key={b} className="relative pl-6 font-sans text-sm text-muted">
                    <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/circles"
                className="mt-6 inline-block self-start rounded-md border border-copper/60 px-6 py-3 font-sans text-sm font-semibold tracking-wide text-copperlight transition hover:bg-copper/10"
              >
                Explore the circles →
              </Link>
              <p className="mt-2 font-sans text-[11px] text-faint">{circles.note}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/sections/Circles.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Circles.tsx components/sections/Circles.test.tsx
git commit -m "feat: Circles homepage section — brotherhood call + circle offer"
```

---

### Task 8: Founders homepage section

**Files:**
- Create: `components/sections/Founders.tsx`
- Test: `components/sections/Founders.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.founders` (Task 1)
- Produces: `Founders()` section with `id="founders"`. Loud placeholders: missing `photo` renders a visible "Photo coming soon" block; missing `bio` renders "Bio coming soon." — never a blank gap.

- [ ] **Step 1: Write the failing test**

Create `components/sections/Founders.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Founders } from "./Founders";

describe("Founders", () => {
  it("renders both founders with equal billing", () => {
    render(<Founders />);
    expect(screen.getByText("Ccowl")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
    expect(screen.getAllByText("Co-founder")).toHaveLength(2);
  });

  it("renders loud placeholders for missing bio and photo", () => {
    render(<Founders />);
    expect(screen.getAllByText(/bio coming soon/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/photo coming soon/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Founders.test.tsx`
Expected: FAIL — cannot resolve `./Founders`.

- [ ] **Step 3: Create `components/sections/Founders.tsx`**:

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/sections/Founders.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Founders.tsx components/sections/Founders.test.tsx
git commit -m "feat: Founders section with equal billing and loud placeholders"
```

---

### Task 9: Hero + Nav + MobileMenu — circles-first CTAs

**Files:**
- Modify: `components/sections/Hero.tsx` (CTA block, lines 22–29)
- Modify: `components/site/Nav.tsx` (CTA button, lines 24–26)
- Modify: `components/site/MobileMenu.tsx` (CTA button, lines 46–48)
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.hero.primaryCta/secondaryCta`, `siteConfig.lumaUrl` (Task 1)

- [ ] **Step 1: Write the failing test**

Create `components/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { siteConfig } from "@/lib/site";

describe("Hero", () => {
  it("makes the brotherhood call the primary CTA", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: siteConfig.hero.primaryCta });
    expect(primary).toHaveAttribute("href", siteConfig.lumaUrl);
  });

  it("links the secondary CTA to /circles and keeps a podcast link", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "/circles");
    expect(screen.getByRole("link", { name: /listen to the podcast/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Hero.test.tsx`
Expected: FAIL — no link named "Join the free brotherhood call" (current primary is a `BookCall` button).

- [ ] **Step 3: Update `Hero.tsx`**

Replace the CTA block (`<div className="mt-8 flex flex-wrap ...">…</div>`) with:

```tsx
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={siteConfig.lumaUrl}
            target="_blank"
            rel="noopener"
            className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            {siteConfig.hero.primaryCta}
          </a>
          <Link
            href="/circles"
            className="rounded-md border border-white/40 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-bone backdrop-blur-sm transition hover:bg-white/10"
          >
            {siteConfig.hero.secondaryCta} →
          </Link>
        </div>
        <a href="#podcast" className="mt-5 font-sans text-xs uppercase tracking-[0.15em] text-muted transition hover:text-bone">
          ▶ Listen to the podcast
        </a>
```

Add `import Link from "next/link";` and remove the now-unused `BookCall` import.

- [ ] **Step 4: Update `Nav.tsx`**

Replace the `<BookCall …>Book a call →</BookCall>` desktop CTA with:

```tsx
        <a
          href={siteConfig.lumaUrl}
          target="_blank"
          rel="noopener"
          className="hidden rounded-md bg-copper px-4 py-2 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110 md:inline-block"
        >
          Join the call →
        </a>
```

Remove the unused `BookCall` import.

- [ ] **Step 5: Update `MobileMenu.tsx`**

Replace the `<BookCall …>Book a call →</BookCall>` with:

```tsx
            <a
              href={siteConfig.lumaUrl}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-md bg-copper px-4 py-3 text-center font-sans text-xs font-semibold uppercase tracking-wide text-ink"
            >
              Join the call →
            </a>
```

Remove the unused `BookCall` import.

- [ ] **Step 6: Run tests + lint**

Run: `npx vitest run components/sections/Hero.test.tsx && npm run lint`
Expected: PASS, no lint errors (unused imports removed).

- [ ] **Step 7: Commit**

```bash
git add components/sections/Hero.tsx components/site/Nav.tsx components/site/MobileMenu.tsx components/sections/Hero.test.tsx
git commit -m "feat: circles-first CTAs — hero and nav drive the free brotherhood call"
```

---

### Task 10: Footer disclaimer (988 guardrail)

**Files:**
- Modify: `components/site/Footer.tsx`
- Test: `components/site/Footer.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.disclaimer` (Task 1)

- [ ] **Step 1: Write the failing test**

Create `components/site/Footer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the peer-support disclaimer with the 988 crisis line", () => {
    render(<Footer />);
    expect(screen.getByText(/call\/text 988 \(US\)/)).toBeInTheDocument();
    expect(screen.getByText(/not therapy, counseling/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/site/Footer.test.tsx`
Expected: FAIL — disclaimer text not found.

- [ ] **Step 3: Update `Footer.tsx`**

Insert the disclaimer paragraph before the copyright line:

```tsx
      <p className="mx-auto mb-4 max-w-2xl font-sans text-xs leading-relaxed text-faint">
        {siteConfig.disclaimer}
      </p>
      <p className="font-sans text-xs text-faint">© WholeMan {new Date().getFullYear()} · Presence over performance.</p>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run components/site/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/site/Footer.tsx components/site/Footer.test.tsx
git commit -m "feat: site-wide peer-support/988 disclaimer in footer"
```

---

### Task 11: Coaching — two guides

**Files:**
- Modify: `components/sections/Coaching.tsx` (label line 31, caption lines 25–27)
- Modify: `app/coaching/page.tsx` (header lines 17–23)
- Test: `components/sections/Coaching.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.coaching.label`, `siteConfig.coaching.photoCaption`, `siteConfig.coaching.body` (Task 1)

- [ ] **Step 1: Write the failing test**

Create `components/sections/Coaching.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Coaching } from "./Coaching";

describe("Coaching", () => {
  it("frames coaching as two guides, not one man", () => {
    render(<Coaching />);
    expect(screen.getByText(/Two men, one mission/)).toBeInTheDocument();
    expect(screen.queryByText(/One man, one mission/)).not.toBeInTheDocument();
  });

  it("uses the config-driven label and caption", () => {
    render(<Coaching />);
    expect(screen.getByText("Private coaching")).toBeInTheDocument();
    expect(screen.getByText("Ccowl · co-founder")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/sections/Coaching.test.tsx`
Expected: FAIL — "Two men, one mission" comes from Task 1's config, but the label "Private coaching with Ccowl" and caption "Ccowl · founder" are still hardcoded.

- [ ] **Step 3: Update `Coaching.tsx`**

- Change destructuring to `const { label, heading, body, perks, photoCaption } = siteConfig.coaching;`
- Replace the hardcoded eyebrow: `<p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">{label}</p>`
- Replace the hardcoded caption span content with `{photoCaption}`.

- [ ] **Step 4: Update `app/coaching/page.tsx`**

Replace the page header block:

```tsx
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Private coaching</p>
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              Private coaching with Charlie &amp; Ccowl
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
              Direct, embodied 1:1 work with either of us to help you stop performing and come home to yourself.
            </p>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run components/sections/Coaching.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add components/sections/Coaching.tsx app/coaching/page.tsx components/sections/Coaching.test.tsx
git commit -m "feat: coaching reframed as two guides (Charlie & Ccowl)"
```

---

### Task 12: `/circles` page

**Files:**
- Create: `components/circles/MonthlyCall.tsx`
- Create: `components/circles/CircleOffer.tsx`
- Create: `components/circles/Agreements.tsx`
- Create: `components/circles/WhoFor.tsx`
- Create: `components/circles/CirclesFaq.tsx`
- Create: `app/circles/page.tsx`
- Test: `app/circles/page.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.brotherhoodCall/circles/agreements/whoFor/circlesFaq/finalCta/nextCall/lumaUrl` (Task 1), `Accordion` (Task 5), `Container`, `Reveal`, `SectionLabel`, `Nav`, `Footer`
- Produces: route `/circles`; Apply CTAs link to `/apply` (built in Task 13 — `next/link` tolerates the route not existing yet).

- [ ] **Step 1: Write the failing test**

Create `app/circles/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CirclesPage from "./page";
import { siteConfig } from "@/lib/site";

describe("/circles page", () => {
  it("renders call, offer, agreements, who-for, FAQ, and final CTA", () => {
    render(<CirclesPage />);
    expect(screen.getByText(siteConfig.brotherhoodCall.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.agreements.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.whoFor.forHeader)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Is this therapy\?/ })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.finalCta.header)).toBeInTheDocument();
  });

  it("links apply CTAs to /apply", () => {
    render(<CirclesPage />);
    const applyLinks = screen.getAllByRole("link", { name: /apply for a circle/i });
    expect(applyLinks.length).toBeGreaterThanOrEqual(1);
    applyLinks.forEach((l) => expect(l).toHaveAttribute("href", "/apply"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/circles/page.test.tsx`
Expected: FAIL — cannot resolve `./page`.

- [ ] **Step 3: Create the five section components**

`components/circles/MonthlyCall.tsx`:

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function MonthlyCall() {
  const { brotherhoodCall, nextCall, lumaUrl } = siteConfig;
  return (
    <section className="bg-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>○</span>}>Step one</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{brotherhoodCall.header}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{brotherhoodCall.body}</p>
          <dl className="mt-6 space-y-1 font-sans text-sm text-faint">
            <div><dt className="inline text-copper">Cost: </dt><dd className="inline">{brotherhoodCall.cost}</dd></div>
            <div><dt className="inline text-copper">Who: </dt><dd className="inline">{brotherhoodCall.who}</dd></div>
            <div><dt className="inline text-copper">Where: </dt><dd className="inline">{brotherhoodCall.where}</dd></div>
            <div><dt className="inline text-copper">Next call: </dt><dd className="inline">{nextCall.date} · {nextCall.time}</dd></div>
          </dl>
          <a
            href={lumaUrl}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-block rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            Save my seat — free
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
```

`components/circles/CircleOffer.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { siteConfig } from "@/lib/site";

export function CircleOffer() {
  const { circles } = siteConfig;
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-[#12100c] to-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>◎</span>}>Step two</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{circles.header}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">{circles.body}</p>
          <ul className="mt-6 max-w-xl space-y-2">
            {circles.bullets.map((b) => (
              <li key={b} className="relative pl-6 font-sans text-sm text-muted">
                <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/apply"
            className="mt-7 inline-block rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            Apply for a circle →
          </Link>
          <p className="mt-3 font-sans text-[11px] text-faint">{circles.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
```

`components/circles/Agreements.tsx`:

```tsx
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
```

`components/circles/WhoFor.tsx`:

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export function WhoFor() {
  const { whoFor } = siteConfig;
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-[#0d0c0a] to-ink py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl text-bone md:text-3xl">{whoFor.forHeader}</h2>
            <ul className="mt-6 space-y-3">
              {whoFor.forItems.map((item) => (
                <li key={item} className="relative pl-6 font-sans text-[15px] leading-relaxed text-muted">
                  <span className="absolute left-0 text-copper" aria-hidden>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl text-bone md:text-3xl">{whoFor.notHeader}</h2>
            <ul className="mt-6 space-y-3">
              {whoFor.notItems.map((item) => (
                <li key={item} className="relative pl-6 font-sans text-[15px] leading-relaxed text-faint">
                  <span className="absolute left-0 text-faint" aria-hidden>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

`components/circles/CirclesFaq.tsx`:

```tsx
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Accordion } from "@/components/ui/Accordion";
import { siteConfig } from "@/lib/site";

export function CirclesFaq() {
  return (
    <section className="border-t border-white/5 bg-ink py-16 md:py-20">
      <Container>
        <Reveal>
          <SectionLabel icon={<span aria-hidden>?</span>}>Questions</SectionLabel>
          <h2 className="font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">Fair questions, straight answers.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 max-w-3xl">
            <Accordion
              items={siteConfig.circlesFaq.map((f) => ({
                id: f.q,
                title: f.q,
                content: <p className="font-sans text-[15px] leading-relaxed text-muted">{f.a}</p>,
              }))}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Create `app/circles/page.tsx`**:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { MonthlyCall } from "@/components/circles/MonthlyCall";
import { CircleOffer } from "@/components/circles/CircleOffer";
import { Agreements } from "@/components/circles/Agreements";
import { WhoFor } from "@/components/circles/WhoFor";
import { CirclesFaq } from "@/components/circles/CirclesFaq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Circles",
  description:
    "WholeMan circles — small, consistent groups of men who tell the truth, own their lives, and have each other's backs. Start with the free monthly brotherhood call.",
};

export default function CirclesPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Men&apos;s circles</p>
            <h1 className="max-w-3xl font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">{siteConfig.circles.headline}</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
              WholeMan circles are small groups of men who tell the truth, own their lives, and have
              each other&apos;s backs. It starts with one honest conversation.
            </p>
          </Container>
        </section>
        <MonthlyCall />
        <CircleOffer />
        <Agreements />
        <WhoFor />
        <CirclesFaq />
        <section className="border-t border-white/5 bg-gradient-to-b from-[#15120d] to-ink2 py-16 text-center md:py-24">
          <Container>
            <h2 className="font-display text-3xl font-normal md:text-4xl">
              <span className="italic text-copperlight">{siteConfig.finalCta.header}</span>
            </h2>
            <p className="mt-4 font-sans text-[15px] text-muted">{siteConfig.finalCta.subhead}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={siteConfig.lumaUrl}
                target="_blank"
                rel="noopener"
                className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
              >
                Save my seat — free
              </a>
              <Link
                href="/apply"
                className="rounded-md border border-copper/60 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-copperlight transition hover:bg-copper/10"
              >
                Apply for a circle →
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run app/circles/page.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add components/circles app/circles
git commit -m "feat: /circles page — call, offer, agreements, who-for, FAQ, final CTA"
```

---

### Task 13: `/apply` funnel — form, page, thanks

**Files:**
- Create: `components/circles/ApplyForm.tsx`
- Create: `app/apply/page.tsx`
- Create: `app/thanks/page.tsx`
- Test: `components/circles/ApplyForm.test.tsx`

**Interfaces:**
- Consumes: `POST /api/apply` contract (Task 4), `siteConfig.contactEmail` (Task 1)
- Produces: `/apply` and `/thanks` routes; form redirects to `/thanks` on 200.

- [ ] **Step 1: Write the failing test**

Create `components/circles/ApplyForm.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { ApplyForm } from "./ApplyForm";

function fillValidForm() {
  return {
    name: screen.getByLabelText(/your name/i),
    email: screen.getByLabelText(/email/i),
    drawingIn: screen.getByLabelText(/drawing you in/i),
    availability: screen.getByLabelText(/availability/i),
    agreement: screen.getByLabelText(/\$99\/month/i),
  };
}

describe("ApplyForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    vi.restoreAllMocks();
  });

  it("renders all fields including the agreement checkbox", () => {
    render(<ApplyForm />);
    const f = fillValidForm();
    expect(f.name).toBeInTheDocument();
    expect(f.agreement).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send my application/i })).toBeInTheDocument();
  });

  it("redirects to /thanks on successful submit", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "Tired of doing it alone.");
    await user.type(f.availability, "Evenings");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(pushMock).toHaveBeenCalledWith("/thanks");
  });

  it("shows field errors from a 400 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: false, errors: { email: "Enter a valid email." } }), { status: 400 }))
    );
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "x");
    await user.type(f.availability, "x");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(await screen.findByText("Enter a valid email.")).toBeInTheDocument();
  });

  it("shows the mailto fallback on server failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 502 })));
    const user = userEvent.setup();
    render(<ApplyForm />);
    const f = fillValidForm();
    await user.type(f.name, "Test Man");
    await user.type(f.email, "test@example.com");
    await user.type(f.drawingIn, "x");
    await user.type(f.availability, "x");
    await user.click(f.agreement);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/email/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/circles/ApplyForm.test.tsx`
Expected: FAIL — cannot resolve `./ApplyForm`.

- [ ] **Step 3: Create `components/circles/ApplyForm.tsx`** (ported, WholeMan-styled):

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";

export function ApplyForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFailed(false);
    setErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      drawingIn: form.get("drawingIn"),
      availability: form.get("availability"),
      priorExperience: form.get("priorExperience"),
      agreement: form.get("agreement") === "on",
      website: form.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 200) {
        router.push("/thanks");
        return;
      }
      if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-1 w-full rounded-md border border-cardline bg-ink2 px-3 py-2 font-sans text-[15px] text-bone focus:border-copper focus:outline-none";
  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1 font-sans text-sm text-copperlight">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Honeypot: visually hidden, not announced to humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="block font-sans text-sm text-bone">Your name</label>
        <input id="name" name="name" className={field} aria-describedby="name-error" required />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="block font-sans text-sm text-bone">Email</label>
        <input id="email" name="email" type="email" className={field} aria-describedby="email-error" required />
        {err("email")}
      </div>
      <div>
        <label htmlFor="drawingIn" className="block font-sans text-sm text-bone">What&apos;s drawing you in?</label>
        <textarea id="drawingIn" name="drawingIn" rows={4} className={field} aria-describedby="drawingIn-error" required />
        {err("drawingIn")}
      </div>
      <div>
        <label htmlFor="availability" className="block font-sans text-sm text-bone">Availability</label>
        <input id="availability" name="availability" className={field} aria-describedby="availability-error" required />
        {err("availability")}
      </div>
      <div>
        <label htmlFor="priorExperience" className="block font-sans text-sm text-bone">Prior men&apos;s-work experience (optional)</label>
        <textarea id="priorExperience" name="priorExperience" rows={3} className={field} />
      </div>
      <div className="flex items-start gap-3">
        <input id="agreement" name="agreement" type="checkbox" className="mt-1 accent-copper" aria-describedby="agreement-error" required />
        <label htmlFor="agreement" className="font-sans text-sm text-muted">
          I understand circles are $99/month, month to month, cancel anytime, and by application.
        </label>
      </div>
      {err("agreement")}

      {failed && (
        <div role="alert" className="rounded-md border border-copper/40 bg-copper/10 p-4 font-sans text-sm text-bone">
          Something went wrong sending your application. Please{" "}
          <a className="underline" href={`mailto:${siteConfig.contactEmail}?subject=Circle application`}>
            email {siteConfig.contactEmail}
          </a>{" "}
          directly, so your message doesn&apos;t disappear.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send my application"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create `app/apply/page.tsx`**:

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { ApplyForm } from "@/components/circles/ApplyForm";

export const metadata: Metadata = { title: "Apply for a circle" };

export default function ApplyPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container className="max-w-2xl">
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">Circles</p>
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Apply for a circle.</span>
            </h1>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
              Circles are by application so we can keep each one safe and committed. Tell us a little
              about you. We read every application personally.
            </p>
            <div className="mt-10">
              <ApplyForm />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Create `app/thanks/page.tsx`**:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Thank you" };

export default function ThanksPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-24 text-center md:py-32">
          <Container className="max-w-2xl">
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Thank you. We got your application.</span>
            </h1>
            <p className="mx-auto mt-6 font-sans text-[15px] leading-relaxed text-muted">
              We read every application personally and reply within a few days. Keep an eye on your
              inbox (and your spam folder, just in case). You took a real step today, and that matters.
            </p>
            <Link href="/" className="mt-8 inline-block font-sans text-sm text-copperlight underline-offset-4 hover:underline">
              ← Back to home
            </Link>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run components/circles/ApplyForm.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add components/circles/ApplyForm.tsx components/circles/ApplyForm.test.tsx app/apply app/thanks
git commit -m "feat: /apply funnel — ported form, apply page, thanks page"
```

---

### Task 14: `/about` page

**Files:**
- Create: `app/about/page.tsx`
- Test: `app/about/page.test.tsx`

**Interfaces:**
- Consumes: `siteConfig.recovery`, `siteConfig.vision`, `siteConfig.founders` (Task 1), `Founders` section (Task 8)

- [ ] **Step 1: Write the failing test**

Create `app/about/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import { siteConfig } from "@/lib/site";

describe("/about page", () => {
  it("tells the WholeMan story and features both founders", () => {
    render(<AboutPage />);
    expect(screen.getByText(siteConfig.vision.purpose)).toBeInTheDocument();
    expect(screen.getByText("Ccowl")).toBeInTheDocument();
    expect(screen.getByText("Charlie Grove")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run app/about/page.test.tsx`
Expected: FAIL — cannot resolve `./page`.

- [ ] **Step 3: Create `app/about/page.tsx`**:

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { Founders } from "@/components/sections/Founders";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The WholeMan story — a recovery mission for men, led by Charlie Grove and Ccowl.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-ink py-16 md:py-24">
          <Container>
            <p className="mb-4 font-sans text-[11px] uppercase tracking-label text-copper">About WholeMan</p>
            <h1 className="max-w-3xl font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">{siteConfig.recovery.heading}</span>
            </h1>
            <p className="mt-6 max-w-3xl font-sans text-[15px] leading-relaxed text-muted">
              {siteConfig.recovery.body}
            </p>
            <p className="mt-6 max-w-3xl font-sans text-[15px] leading-relaxed text-muted">
              {siteConfig.vision.purpose}
            </p>
            <p className="mt-6 max-w-3xl font-display text-xl italic text-copperlight">
              {siteConfig.vision.closer}
            </p>
          </Container>
        </section>
        <Founders />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run app/about/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/about
git commit -m "feat: /about page — story + founders"
```

---

### Task 15: Homepage assembly, metadata, env docs, final verification

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx` (DESCRIPTION, keywords, authors, OG descriptions)
- Modify or Create: `.env.example`

**Interfaces:**
- Consumes: `SurvivalStrategies` (Task 6), `Circles` (Task 7), `Founders` (Task 8)

- [ ] **Step 1: Update `app/page.tsx`** — insert the three new sections in spec order:

```tsx
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TheCall } from "@/components/sections/TheCall";
import { IsThisYou } from "@/components/sections/IsThisYou";
import { SurvivalStrategies } from "@/components/sections/SurvivalStrategies";
import { RecoveryMission } from "@/components/sections/RecoveryMission";
import { TheWork } from "@/components/sections/TheWork";
import { Circles } from "@/components/sections/Circles";
import { Founders } from "@/components/sections/Founders";
import { Manifesto } from "@/components/sections/Manifesto";
import { Vision } from "@/components/sections/Vision";
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
        <IsThisYou />
        <SurvivalStrategies />
        <RecoveryMission />
        <TheWork />
        <Circles />
        <Founders />
        <Manifesto />
        <Vision />
        <Coaching />
        <PodcastSection podcast={podcast} />
      </main>
      <Footer />
    </>
  );
}
```

(Manifesto and Vision stay — Circles and Founders slot in after TheWork, per spec order: Hero → The Call → Is This You? → Survival Strategies → Recovery Mission → The Work → Circles → Founders → Coaching → Podcast. Manifesto/Vision remain between Founders and Coaching where they already flow.)

- [ ] **Step 2: Update `app/layout.tsx` metadata**

```ts
const DESCRIPTION =
  "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration. Men's circles, a free monthly brotherhood call, private coaching, and the WholeMan Podcast.";
```

In `keywords`, add: `"men's circles"`, `"brotherhood"`, `"men's group"`, `"Charlie Grove"`.
Change `authors` to `[{ name: "Ccowl" }, { name: "Charlie Grove" }]`.
Update both `openGraph.description` and `twitter.description` to:
`"A recovery mission for men. Circles, a free monthly brotherhood call, coaching + the WholeMan Podcast."`

- [ ] **Step 3: Update `.env.example`**

Append (create the file with the existing `NEXT_PUBLIC_CALENDLY_URL` line if it doesn't exist):

```bash
# Circle applications (Resend)
RESEND_API_KEY=
# Comma-separated recipients — both founders
APPLY_TO_EMAIL=
# Optional; defaults to applications@wholeman.org (must be a Resend-verified domain)
APPLY_FROM_EMAIL=
```

- [ ] **Step 4: Full verification**

```bash
npm test          # all suites green (existing + ~14 new test files)
npm run lint      # no errors
npx tsc --noEmit  # no type errors
npm run build     # production build succeeds
```

Expected: all four commands exit 0.

- [ ] **Step 5: Manual smoke check (dev server)**

Run `npm run dev`, then verify in a browser:
- `/` shows the new section order; hero primary CTA opens Luma; "Explore the circles" goes to `/circles`.
- `/circles` renders all six blocks; both "Apply for a circle" links reach `/apply`.
- `/apply` submits (dev soft-success without env vars) and lands on `/thanks`.
- `/about`, `/coaching`, `/podcast` render; nav + mobile menu show Circles/Coaching/About/Podcast.
- Footer shows the 988 disclaimer on every page.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx .env.example
git commit -m "feat: assemble circles-first homepage, update metadata + env docs"
```

---

## Post-merge launch checklist (manual, Charlie — NOT part of implementation)

1. Review the branch, merge `feat/circles-merge` → `main`, push (Vercel deploys).
2. Add Vercel env vars: `RESEND_API_KEY`, `APPLY_TO_EMAIL` (both founders' emails, comma-separated), optionally `APPLY_FROM_EMAIL` (Resend-verified domain).
3. Confirm `hello@wholeman.org` exists (mailto fallback on the apply form) — or change `siteConfig.contactEmail`.
4. Write real bios + add Charlie's photo (`public/photos/`), replace placeholders in `siteConfig.founders`.
5. After the July 23 call: point consciousbrotherhood.org → wholeman.org/circles (301), archive the consciousbro repo.
