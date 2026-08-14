# Circles Interest Capture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dated "monthly brotherhood call" funnel with a single low-friction interest-capture flow (join a circle / learn more / just chat).

**Architecture:** Content lives in `lib/site.ts` (`siteConfig` `as const`). A soft interest form at `/apply` posts JSON to `/api/apply`, which validates with a Zod schema (`lib/apply-schema.ts`) and emails via Google Workspace SMTP (`lib/apply-email.ts`). We reshape the schema/email, soften the form, delete the dated-call section, and reword copy. URLs (`/apply`, `/api/apply`) are unchanged.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind 3.4, Zod 4, Vitest + Testing Library, nodemailer.

## Global Constraints

- **Toolchain runs in WSL.** Wrap every git/node command: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; <cmd>'`. Node does NOT auto-load; the `nvm.sh` source line is required before `npm`/`npx`.
- **Test runner:** `npx vitest run <path>` for one file; `npm test` for the whole suite; `npm run build` as the final typecheck gate.
- **Keep URLs stable:** do NOT rename `/apply` or `/api/apply`.
- **Interest values are `"join" | "learn" | "chat"`.** Human-readable labels live in ONE place (`INTEREST_OPTIONS` in `lib/apply-schema.ts`) and are imported everywhere else — never re-typed.
- **Hero primary CTA copy is exactly `"Start the conversation"`.**
- **Do NOT touch:** `components/sections/TheCall.tsx` (emotional callout, not the Zoom call), `components/ui/BookCall.tsx` + Calendly coaching flow, podcast, survival strategies, founders.
- **Preserve the 988 crisis guardrails verbatim** — two `circlesFaq` entries and the `disclaimer` must keep `call/text 988 (US)`.
- Zod 4: use `error` (string) for messages, not `errorMap`. Follow existing `.optional().default("")` pattern.

---

### Task 1: Reshape the apply schema + interest options (TDD)

**Files:**
- Modify: `lib/apply-schema.ts`
- Test: `lib/apply-schema.test.ts` (create)

**Interfaces:**
- Produces:
  - `INTEREST_OPTIONS: readonly { value: "join"|"learn"|"chat"; label: string }[]`
  - `type Interest = "join" | "learn" | "chat"`
  - `INTEREST_LABELS: Record<Interest, string>`
  - `applySchema` (Zod), `type ApplyInput = { name: string; email: string; interest: Interest; message: string }`
  - `validateApply(data): { ok: true; value: ApplyInput } | { ok: false; errors: Record<string,string>; botDetected: boolean }` (unchanged control flow — honeypot on `website`)

- [ ] **Step 1: Write the failing test**

Create `lib/apply-schema.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateApply, INTEREST_OPTIONS } from "@/lib/apply-schema";

describe("validateApply", () => {
  const base = { name: "Sam", email: "sam@example.com", interest: "join" };

  it("accepts a valid interest submission", () => {
    const r = validateApply({ ...base, message: "hello" });
    expect(r.ok).toBe(true);
  });

  it("defaults message to empty when omitted", () => {
    const r = validateApply(base);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.message).toBe("");
  });

  it("rejects an unknown interest", () => {
    const r = validateApply({ ...base, interest: "nope" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.interest).toBeTruthy();
  });

  it("requires name and email", () => {
    const r = validateApply({ interest: "chat" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBeTruthy();
      expect(r.errors.email).toBeTruthy();
    }
  });

  it("silently drops honeypot submissions", () => {
    const r = validateApply({ ...base, website: "spam" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.botDetected).toBe(true);
  });

  it("exposes three interest options in order", () => {
    expect(INTEREST_OPTIONS.map((o) => o.value)).toEqual(["join", "learn", "chat"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run lib/apply-schema.test.ts'`
Expected: FAIL — `INTEREST_OPTIONS` is not exported / old schema rejects `interest`.

- [ ] **Step 3: Replace `lib/apply-schema.ts`**

```ts
import { z } from "zod";

export const INTEREST_OPTIONS = [
  { value: "join", label: "I'd like to join a men's circle" },
  { value: "learn", label: "I want to learn more" },
  { value: "chat", label: "I just want to chat honestly" },
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number]["value"];

export const INTEREST_LABELS: Record<Interest, string> = Object.fromEntries(
  INTEREST_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Interest, string>;

export const applySchema = z.object({
  name: z.string().min(1, "Your name is required.").max(200, "Please keep your name under 200 characters."),
  email: z
    .string()
    .email("Enter a valid email.")
    .max(254, "Please use a shorter email address."),
  interest: z.enum(["join", "learn", "chat"], { error: "Let us know what brings you here." }),
  message: z.string().max(5000, "Please keep this under 5000 characters.").optional().default(""),
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

- [ ] **Step 4: Run test to verify it passes**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run lib/apply-schema.test.ts'`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git add lib/apply-schema.ts lib/apply-schema.test.ts && git commit -q -m "feat: reshape apply schema to interest capture (join/learn/chat)"'
```

---

### Task 2: Update the email builder (TDD)

**Files:**
- Modify: `lib/apply-email.ts`
- Test: `lib/apply-email.test.ts` (modify)

**Interfaces:**
- Consumes: `ApplyInput`, `INTEREST_LABELS` from Task 1.
- Produces: `sendApplicationEmail(input: ApplyInput): Promise<void>` and `isEmailConfigured(): boolean` (signature unchanged).

- [ ] **Step 1: Update the test's input + body assertions**

In `lib/apply-email.test.ts`, replace the `input` const (lines ~18–25) with:

```ts
const input = {
  name: "Test Man",
  email: "test@example.com",
  interest: "join" as const,
  message: "Tired of doing it alone.",
};
```

And in the "sends to all recipients…" test, replace the line asserting `toContain("Weekday evenings")` with:

```ts
    expect(String(arg.text)).toContain("Tired of doing it alone.");
    expect(String(arg.text)).toContain("join a men's circle");
```

(Leave the other tests — env config, transport, throws, propagates — as they are.)

- [ ] **Step 2: Run test to verify it fails**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run lib/apply-email.test.ts'`
Expected: FAIL — old `sendApplicationEmail` body references `input.drawingIn`/`availability` (now absent) and text lacks the interest label.

- [ ] **Step 3: Update `lib/apply-email.ts`**

Change the import at the top from:

```ts
import type { ApplyInput } from "@/lib/apply-schema";
```

to:

```ts
import type { ApplyInput } from "@/lib/apply-schema";
import { INTEREST_LABELS } from "@/lib/apply-schema";
```

Replace the `subject` + `text` block inside `sendMail` with:

```ts
    subject: `New circle interest from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `What brings them here: ${INTEREST_LABELS[input.interest]}`,
      `Message: ${input.message || "(none given)"}`,
    ].join("\n"),
```

(Transport config, `isEmailConfigured`, recipient splitting, `replyTo` unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run lib/apply-email.test.ts'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git add lib/apply-email.ts lib/apply-email.test.ts && git commit -q -m "feat: email builder reports interest + message"'
```

---

### Task 3: Soften the ApplyForm and reword apply/thanks pages

**Files:**
- Modify: `components/circles/ApplyForm.tsx`
- Test: `components/circles/ApplyForm.test.tsx` (create)
- Modify: `app/apply/page.tsx`
- Modify: `app/thanks/page.tsx`

**Interfaces:**
- Consumes: `INTEREST_OPTIONS` from Task 1; posts `{ name, email, interest, message, website }` to `/api/apply`.

- [ ] **Step 1: Write the failing form test**

Create `components/circles/ApplyForm.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ApplyForm } from "./ApplyForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("ApplyForm", () => {
  it("offers the three interest options and no payment gate", () => {
    render(<ApplyForm />);
    expect(screen.getByRole("radio", { name: /join a men's circle/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /learn more/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /chat honestly/i })).toBeInTheDocument();
    expect(screen.queryByText(/\$99\/month/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run components/circles/ApplyForm.test.tsx'`
Expected: FAIL — no interest radios; the `$99/month` agreement label is still present.

- [ ] **Step 3: Replace `components/circles/ApplyForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { INTEREST_OPTIONS } from "@/lib/apply-schema";

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
      interest: form.get("interest"),
      message: form.get("message"),
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

      <fieldset>
        <legend className="block font-sans text-sm text-bone">What brings you here?</legend>
        <div className="mt-2 space-y-2">
          {INTEREST_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-start gap-3 font-sans text-sm text-muted">
              <input type="radio" name="interest" value={opt.value} className="mt-1 accent-copper" required />
              {opt.label}
            </label>
          ))}
        </div>
        {err("interest")}
      </fieldset>

      <div>
        <label htmlFor="message" className="block font-sans text-sm text-bone">Anything you want us to know? (optional)</label>
        <textarea id="message" name="message" rows={4} className={field} />
      </div>

      {failed && (
        <div role="alert" className="rounded-md border border-copper/40 bg-copper/10 p-4 font-sans text-sm text-bone">
          Something went wrong sending your note. Please{" "}
          <a className="underline" href={`mailto:${siteConfig.contactEmail}?subject=WholeMan — reaching out`}>
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
        {submitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run the form test to verify it passes**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run components/circles/ApplyForm.test.tsx'`
Expected: PASS.

- [ ] **Step 5: Reword `app/apply/page.tsx`**

Change `metadata` and the heading/intro block. Replace:

```tsx
export const metadata: Metadata = { title: "Apply for a circle" };
```
with:
```tsx
export const metadata: Metadata = { title: "Start the conversation" };
```

Replace the `<h1>`…`</h1>` and following `<p>` with:

```tsx
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Start the conversation.</span>
            </h1>
            <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
              Tell us a little about you and what you&apos;re looking for — whether that&apos;s
              joining a circle, learning more, or just getting something off your chest. We read
              every note personally.
            </p>
```

(Also change the eyebrow `<p>` text `Circles` → `Reach out` if desired; not required.)

- [ ] **Step 6: Reword `app/thanks/page.tsx`**

Replace the `<h1>` inner span and the body `<p>`:

```tsx
            <h1 className="font-display text-4xl font-normal md:text-5xl">
              <span className="italic text-copperlight">Thank you. We got your note.</span>
            </h1>
            <p className="mx-auto mt-6 font-sans text-[15px] leading-relaxed text-muted">
              We read every note personally and reply within a few days. Keep an eye on your inbox
              (and your spam folder, just in case). You took a real step today, and that matters.
            </p>
```

- [ ] **Step 7: Run the form test again + commit**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run components/circles/ApplyForm.test.tsx'`
Expected: PASS.

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git add components/circles/ApplyForm.tsx components/circles/ApplyForm.test.tsx app/apply/page.tsx app/thanks/page.tsx && git commit -q -m "feat: soften apply form to interest capture; reword apply/thanks"'
```

---

### Task 4: Swap the funnel content in siteConfig + all display consumers (atomic)

This task removes `lumaUrl`/`nextCall`/`brotherhoodCall` from `siteConfig`. That is a compile-time break across every consumer, so all edits below land in one task; the task's gate is a full green build + suite. Delete then update in the order given.

**Files:**
- Modify: `lib/site.ts`
- Delete: `components/circles/MonthlyCall.tsx`
- Modify: `app/circles/page.tsx`, `components/sections/Circles.tsx`, `components/circles/CircleOffer.tsx`, `components/sections/Hero.tsx`, `components/site/Nav.tsx`, `components/site/MobileMenu.tsx`
- Test: `test/site.test.ts`, `components/sections/Hero.test.tsx`, `components/sections/Circles.test.tsx`, `app/circles/page.test.tsx` (modify)

**Interfaces:**
- Consumes: `siteConfig` (edited here). Homepage `Circles` + `/circles` CTAs now link to `/apply`; hero primary CTA `Start the conversation` links to `/apply`.

- [ ] **Step 1: Update the display + config tests (they should fail first)**

`test/site.test.ts` — replace the last `it("has the brotherhood call config", …)` block (lines ~37–41) with:

```ts
  it("leads with the interest CTA, not a dated call", () => {
    expect(siteConfig.hero.primaryCta).toBe("Start the conversation");
    expect(siteConfig.circles.header).toBe("Join a men's circle.");
    expect(siteConfig.circles.interest.header).toBeTruthy();
  });
```

`components/sections/Hero.test.tsx` — replace the first `it(...)`:

```tsx
  it("makes the interest CTA the primary, linking to /apply", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: siteConfig.hero.primaryCta });
    expect(primary).toHaveAttribute("href", "/apply");
  });
```

`components/sections/Circles.test.tsx` — replace the whole `describe` body:

```tsx
  it("renders the headline and both doors", () => {
    render(<Circles />);
    expect(
      screen.getByRole("heading", { name: /a brotherhood that has your back\./i })
    ).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.circles.interest.header)).toBeInTheDocument();
  });

  it("points its interest CTA at /apply and keeps the explore link", () => {
    render(<Circles />);
    const start = screen.getAllByRole("link", { name: /start the conversation/i });
    expect(start.length).toBeGreaterThanOrEqual(1);
    start.forEach((l) => expect(l).toHaveAttribute("href", "/apply"));
    expect(screen.getByRole("link", { name: /explore the circles/i })).toHaveAttribute("href", "/circles");
  });
```

`app/circles/page.test.tsx` — replace the whole `describe` body:

```tsx
  it("renders offer, agreements, who-for, FAQ, and final CTA", () => {
    render(<CirclesPage />);
    expect(screen.getByText(siteConfig.circles.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.agreements.header)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.whoFor.forHeader)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Is this therapy\?/ })).toBeInTheDocument();
    expect(screen.getByText(siteConfig.finalCta.header)).toBeInTheDocument();
  });

  it("links CTAs to /apply and drops the Luma RSVP", () => {
    render(<CirclesPage />);
    const start = screen.getAllByRole("link", { name: /start the conversation/i });
    expect(start.length).toBeGreaterThanOrEqual(1);
    start.forEach((l) => expect(l).toHaveAttribute("href", "/apply"));
    screen.queryAllByRole("link").forEach((l) =>
      expect(l.getAttribute("href") ?? "").not.toContain("luma.com"),
    );
  });
```

- [ ] **Step 2: Edit `lib/site.ts`**

**(a)** Delete these three top-level lines:

```ts
  lumaUrl: "https://luma.com/ryyv3hx9",
  nextCall: { date: "July 23", time: "6pm PT / 9pm ET" },
```
and the entire `brotherhoodCall: { … },` block (the `header`/`body`/`cost`/`who`/`where` object).

**(b)** Change `hero.primaryCta`:

```ts
    primaryCta: "Start the conversation",
```

**(c)** Replace the whole `circles: { … }` block with:

```ts
  circles: {
    headline: "A brotherhood that has your back.",
    intro:
      "WholeMan circles are small groups of men who tell the truth, own their lives, and have each other's backs. It starts with one honest conversation.",
    header: "Join a men's circle.",
    body:
      "A circle is a small group of men (6 to 8) who meet regularly with a trained facilitator. Same men, every session. That's where real trust and accountability get built — a brotherhood that has your back week after week.",
    bullets: [
      "Small, consistent group of 6 to 8 men",
      "Facilitated sessions with clear agreements",
      "A private group thread for support and accountability between meetings",
    ],
    pricingNote:
      "Circles run $99/month, month to month, cancel anytime — but reach out first. We'll figure out fit before anything else.",
    note: "We keep each circle small and committed, so we start with a conversation.",
    interest: {
      header: "Not ready for a circle?",
      body:
        "That's completely fine. Maybe you want to learn more, or you just want to get something off your chest with a man who gets it. Reach out either way — no pressure, no pitch.",
    },
  },
```

**(d)** In `circlesFaq`, change the "on the call" question to a circle question:

```ts
    { q: "What actually happens in a circle?", a: "We open, men share what's alive for them, others listen and reflect, and we close. You can pass. Many men say nothing their first time and still leave lighter." },
```
and change the "Online or in person?" answer from `"Calls and circles are online for now."` to:
```ts
    { q: "Online or in person?", a: "Circles are online for now." },
```
(Leave the two 988 FAQ entries and every other entry untouched.)

**(e)** Replace `finalCta`:

```ts
  finalCta: {
    header: "You don't have to do this alone anymore.",
    subhead: "Reach out and tell us what's going on. We'll take it from there.",
  },
```

- [ ] **Step 3: Delete the MonthlyCall component**

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git rm -q components/circles/MonthlyCall.tsx'
```

- [ ] **Step 4: Update `app/circles/page.tsx`**

Remove the `MonthlyCall` import line (`import { MonthlyCall } from "@/components/circles/MonthlyCall";`) and the `<MonthlyCall />` element (line ~37).

Change `metadata.description` to:

```ts
  description:
    "WholeMan circles — small, consistent groups of men who tell the truth, own their lives, and have each other's backs. Reach out to start a conversation.",
```

Replace the final `<section>`'s button group (the `<div className="mt-8 flex flex-wrap justify-center gap-4">…</div>` containing the Luma `<a>` and the `/apply` `<Link>`) with a single CTA:

```tsx
            <div className="mt-8 flex justify-center">
              <Link
                href="/apply"
                className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
              >
                Start the conversation
              </Link>
            </div>
```

(`Link` is already imported. `siteConfig.lumaUrl` is no longer referenced.)

- [ ] **Step 5: Update `components/circles/CircleOffer.tsx`**

Change the `SectionLabel` from `Step two` to `Join a circle`:

```tsx
          <SectionLabel icon={<span aria-hidden>◎</span>}>Join a circle</SectionLabel>
```

Change the CTA `<Link>` text from `Apply for a circle →` to `Start the conversation →`.

Add the pricing line directly above the existing note `<p>`. Replace:

```tsx
          <p className="mt-3 font-sans text-[11px] text-faint">{circles.note}</p>
```
with:
```tsx
          <p className="mt-4 font-sans text-[13px] text-muted">{circles.pricingNote}</p>
          <p className="mt-2 font-sans text-[11px] text-faint">{circles.note}</p>
```

- [ ] **Step 6: Replace `components/sections/Circles.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EmberBackground } from "@/components/ui/EmberBackground";
import { siteConfig } from "@/lib/site";

export function Circles() {
  const { circles } = siteConfig;
  return (
    <section id="circles" className="relative isolate overflow-hidden border-t border-white/5 py-16 md:py-24">
      <EmberBackground />
      <Container className="relative z-10">
        <Reveal>
          <SectionLabel icon={<span aria-hidden>○</span>}>The brotherhood</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-normal md:text-4xl">
            <span className="italic text-copperlight">{circles.headline}</span>
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-muted">
            {circles.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
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
              <p className="mt-4 font-sans text-[11px] text-faint">{circles.pricingNote}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/apply"
                  className="inline-block rounded-md bg-copper px-6 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
                >
                  Start the conversation
                </Link>
                <Link
                  href="/circles"
                  className="font-sans text-sm text-copperlight underline-offset-4 hover:underline"
                >
                  Explore the circles →
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-cardline bg-ink2/60 p-7">
              <h3 className="font-display text-2xl text-bone">{circles.interest.header}</h3>
              <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-muted">{circles.interest.body}</p>
              <Link
                href="/apply"
                className="mt-6 inline-block self-start rounded-md border border-copper/60 px-6 py-3 font-sans text-sm font-semibold tracking-wide text-copperlight transition hover:bg-copper/10"
              >
                Reach out →
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Update `components/sections/Hero.tsx`**

Replace the primary CTA `<a href={siteConfig.lumaUrl} target="_blank" rel="noopener" …>{siteConfig.hero.primaryCta}</a>` with a `Link`:

```tsx
          <Link
            href="/apply"
            className="rounded-md bg-copper px-7 py-3 font-sans text-sm font-semibold tracking-wide text-ink transition hover:brightness-110"
          >
            {siteConfig.hero.primaryCta}
          </Link>
```

(`Link` is already imported; `siteConfig.lumaUrl` is no longer referenced.)

- [ ] **Step 8: Update `components/site/Nav.tsx`**

Replace the `<a href={siteConfig.lumaUrl} target="_blank" rel="noopener" …>Join the call →</a>` with:

```tsx
        <Link
          href="/apply"
          className="hidden rounded-md bg-copper px-4 py-2 font-sans text-xs font-semibold tracking-wide text-ink transition hover:brightness-110 md:inline-block"
        >
          Join a circle →
        </Link>
```

(`Link` is already imported.)

- [ ] **Step 9: Update `components/site/MobileMenu.tsx`**

Replace the `<a href={siteConfig.lumaUrl} target="_blank" rel="noopener" onClick={() => setOpen(false)} …>Join the call →</a>` with:

```tsx
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-md bg-copper px-4 py-3 text-center font-sans text-xs font-semibold uppercase tracking-wide text-ink"
            >
              Join a circle →
            </Link>
```

(`Link` is already imported.)

- [ ] **Step 10: Run the affected tests**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npx vitest run test/site.test.ts components/sections/Hero.test.tsx components/sections/Circles.test.tsx app/circles/page.test.tsx'`
Expected: PASS (all four files).

- [ ] **Step 11: Commit**

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git add -A && git commit -q -m "feat: replace dated monthly call with circle interest funnel"'
```

---

### Task 5: Full verification gate

**Files:** none (verification only).

- [ ] **Step 1: Run the whole test suite**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npm test'`
Expected: PASS — no test references `lumaUrl`, `nextCall`, or `brotherhoodCall`.

- [ ] **Step 2: Typecheck + production build**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; npm run build'`
Expected: build succeeds; no TypeScript error about missing `siteConfig` properties.

- [ ] **Step 3: Grep for stragglers**

Run: `wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git grep -nE "lumaUrl|nextCall|brotherhoodCall|Save my seat|Join the call|Join the free|luma\.com" -- ":!docs/"'`
Expected: no matches outside `docs/`. If any appear, fix them and re-run Steps 1–2.

- [ ] **Step 4: Final commit (if Step 3 required fixes)**

```bash
wsl.exe -e bash -lc 'cd /home/charlie/wholeman && git add -A && git commit -q -m "chore: remove remaining dated-call references"'
```

---

## Self-Review notes

- **Spec coverage:** dated-call removal (Task 4), soft form + backend (Tasks 1–3), copy reframe incl. hero "Start the conversation" (Tasks 3–4), pricing light-touch via `pricingNote` (Task 4), 5 test updates + new schema/form tests (Tasks 1–4), 988 guardrails preserved (Task 4 leaves them untouched). Covered.
- **Interest label single-source:** `INTEREST_OPTIONS`/`INTEREST_LABELS` in `lib/apply-schema.ts`, imported by the form (Task 3) and email (Task 2) — no re-typing. (Refines the spec, which floated the labels living in `siteConfig`; keeping them in the schema removes the drift risk the spec itself flagged.)
- **Type consistency:** `ApplyInput` is `{ name, email, interest, message }` across schema, email, form, and both tests.
