# Circles interest capture — design

**Date:** 2026-08-12
**Status:** Approved (design), pending implementation
**Author:** Charlie + Claude

## Problem

The site is currently built as a two-step funnel:

1. **Step one — a free, dated "monthly brotherhood call"** (Luma RSVP, e.g. "Next call: July 23 · 6pm PT"), and
2. **Step two — a paid, committed circle application** (asks availability + prior experience, and forces a checkbox agreeing to $99/month "by application").

We are not ready to run an open, scheduled monthly call yet. What we want right now is simply to **capture men who are interested** — whether they want to join a men's circle, learn more, or just chat honestly — with the lowest possible friction.

## Goal

Collapse the two-step funnel into **one soft invitation to reach out**, where the person tells us which of three doors they're walking through. Remove every trace of the dated call. Keep circles described richly, but make pricing a light touch rather than a checkout gate.

## Decisions (locked)

- **Form framing:** soften to an interest form. Drop availability, prior-experience, and the $99 agreement gate.
- **Pricing:** keep circles described richly, but move `$99/month` out of the feature bullets into one quiet, reassuring line ("reach out first; we'll figure out fit").
- **Hero primary CTA label:** **"Start the conversation."**
- **URLs unchanged:** keep `/apply` and `/api/apply` to avoid breaking existing links/bookmarks; only the user-facing language changes from "application" to "reaching out."

## Scope

### 1. Remove the dated-call scaffolding

In `lib/site.ts`, delete these keys and every consumer of them:

- `lumaUrl`
- `nextCall`
- `brotherhoodCall`

Consumers to update or remove:

| File | Current | Change |
|------|---------|--------|
| `components/circles/MonthlyCall.tsx` | Whole "Step one" call section on `/circles` | **Delete component**, remove from `app/circles/page.tsx` |
| `components/sections/Circles.tsx` | Two cards on homepage: *call* (RSVP) + *circle* | Rebuild as two soft doors (see §3) |
| `components/site/Nav.tsx` | `Join the call →` button → `lumaUrl` | `Join a circle →` → `/apply` |
| `components/site/MobileMenu.tsx` | `Join the call →` button → `lumaUrl` | `Join a circle →` → `/apply` |
| `components/sections/Hero.tsx` | Primary CTA → `lumaUrl` (external) | Primary CTA → `/apply` (internal `Link`) |
| `app/circles/page.tsx` | `MonthlyCall` + final "Save my seat — free" (Luma) button | Remove both; keep a single "Start the conversation" CTA |

**Explicitly NOT removed:**
- `components/sections/TheCall.tsx` — despite the name, this is the emotional "you've achieved the things / you still feel empty" callout, not the Zoom call. Keep as-is.
- `components/ui/BookCall.tsx` and the Calendly coaching flow — a separate offer, untouched.

### 2. Soften the capture form + backend

**`components/circles/ApplyForm.tsx`** — new field set:

- `name` (required)
- `email` (required)
- `interest` (required) — radio, one of:
  - `join` — "I'd like to join a men's circle"
  - `learn` — "I want to learn more"
  - `chat` — "I just want to chat honestly"
- `message` (optional) — open textarea, "Anything you want us to know?"
- Honeypot `website` field stays.
- **Removed:** `drawingIn`, `availability`, `priorExperience`, `agreement` checkbox.
- Submit button: "Send my application" → **"Send"** (or "Send my note"). Error-state mailto subject → "WholeMan — reaching out".

**`lib/apply-schema.ts`** — new Zod shape:

```ts
export const applySchema = z.object({
  name: z.string().min(1, "Your name is required.").max(200, ...),
  email: z.string().email("Enter a valid email.").max(254, ...),
  interest: z.enum(["join", "learn", "chat"], { error: "Let us know what brings you here." }),
  message: z.string().max(5000, "Please keep this under 5000 characters.").optional().default(""),
});
```

Honeypot + `validateApply` control flow are unchanged.

**`lib/apply-email.ts`** — update `sendApplicationEmail`:
- Subject: `New circle interest from ${input.name}` (was "New circle application from …").
- Body: map `interest` to a human label and include `message`:
  ```
  Name: …
  Email: …
  What brings them here: <label for join|learn|chat>
  Message: <message or "(none given)">
  ```
- Transport/env logic (`isEmailConfigured`, Gmail SMTP) unchanged.

**`app/api/apply/route.ts`** — no change (already schema-driven).

### 3. Reframe copy (invitation-first, pricing light-touch)

`lib/site.ts`:

- `hero.primaryCta`: `"Join the free brotherhood call"` → `"Start the conversation"`.
- `hero.secondaryCta`: keep "Explore the circles".
- `circles`: keep `headline`, `intro`, `header`, `body` describing circles richly. Remove the `$99/month` bullet from `circles.bullets`; add a single quiet line (new `circles.pricingNote`, e.g. *"Circles run $99/month, month to month — but reach out first; we'll figure out fit before anything else."*). Reword `circles.header`/`note` to drop "Step two"/"by application" framing.
- New `circles.interest` block for the form: the three option labels + intro copy.
- `circlesFaq`: reword "What actually happens on the call?" → "What actually happens in a circle?"; keep "Do I have to talk?"; scrub any "the call" phrasing that implied the dated RSVP call.
- `finalCta`: `header`/`subhead` from "Start with one call. See what it's like to be heard." → reach-out framing (e.g. "Reach out. We'll take it from there.").

`components/sections/Circles.tsx` — homepage section rebuilt as two soft doors:
- **Card A — "Join a circle":** `circles.header`/`body`, bullets (no price), quiet pricing line, primary CTA `Start the conversation` → `/apply`.
- **Card B — "Not ready for that?":** short copy inviting them to just learn more or chat, secondary CTA → `/apply` (or `/circles`). Removes the RSVP card entirely.

`components/circles/CircleOffer.tsx` — drop the "Step two" `SectionLabel`; move price out of bullets into the quiet line; keep the "Start the conversation" CTA (was "Apply for a circle").

`app/circles/page.tsx` — remove `MonthlyCall`; remove the Luma "Save my seat — free" button in the final CTA; keep one internal "Start the conversation" → `/apply` CTA.

`app/apply/page.tsx` — heading "Apply for a circle." → e.g. "Start the conversation." Intro reworded from "Circles are by application…" to a warm "Tell us a little about you and what you're looking for. We read every note personally."

`app/thanks/page.tsx` — "Thank you. We got your application." → "Thank you. We got your note." Body reworded from "We read every application…" to reach-out language.

### 4. Tests

Update the tests that assert the old wiring, and follow TDD for the schema/email logic:

- `test/site.test.ts` — remove `lumaUrl`/`nextCall`/`brotherhoodCall` assertions (lines ~38–40); assert new `circles.interest` options and `hero.primaryCta === "Start the conversation"`.
- `components/sections/Hero.test.tsx` — primary CTA now links to `/apply`, not `siteConfig.lumaUrl`.
- `components/sections/Circles.test.tsx` — remove `brotherhoodCall.header` + RSVP-link assertions; assert the two new door cards and that both CTAs point to `/apply`.
- `app/circles/page.test.tsx` — remove `brotherhoodCall.header` assertion; assert circle content + "Start the conversation" CTA, and that no Luma link is present.
- `lib/apply-email.test.ts` — update to the new subject + body (interest label + message), using the new `ApplyInput` shape.
- **New:** schema test for `applySchema` — valid `interest` values accepted, invalid rejected, `message` optional, honeypot still drops.

## Out of scope

- Routing/URL changes (keep `/apply`, `/api/apply`).
- Coaching / Calendly flow, podcast, survival strategies, founders, visual system.
- Any real re-introduction of a scheduled group call (a future phase).

## Risks / notes

- `interest` enum values (`join`/`learn`/`chat`) are stored/emailed as codes; the human-readable label lives in one map shared by the form and the email builder to avoid drift.
- Deleting `siteConfig` keys is a compile-time break surface — TypeScript + the test suite will catch every stale consumer, so run `npm run build` and `npm test` as the completion gate.
