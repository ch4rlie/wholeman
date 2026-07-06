# WholeMan × Brotherhood Merge — Design Spec

**Date:** 2026-07-06
**Status:** Approved by Charlie
**Owner:** Charlie Grove (building; co-founder with Ty "Ccowl" Humphries)

## Summary

WholeMan absorbs the men's circles offering from The Conscious Brotherhood
(`~/consciousbro`, consciousbrotherhood.org). The Conscious Brotherhood name is
retired; the offering becomes **Circles**, with a free monthly **brotherhood
call** as the on-ramp. Charlie Grove joins the site as co-founder with equal
billing. The site's center of gravity shifts from 1:1 coaching to the circles
community; coaching remains, now offered by both founders.

Content ports from consciousbro; presentation is rebuilt entirely in WholeMan's
design system (Tailwind 3.4, ink/copper/bone, Cormorant Garamond + Inter,
Framer Motion reveals, SectionLabel eyebrows). No consciousbro components are
copied verbatim — consciousbro runs Tailwind v4 with different tokens.

## Decisions (locked)

| Question | Decision |
|---|---|
| Branding | Fully absorb. "Conscious Brotherhood" name retired. |
| Offering name | **Circles** (paid), free monthly **brotherhood call** (on-ramp). |
| Structure | Homepage section + dedicated `/circles` page + `/apply` form. |
| Archetypes | The 12 survival-strategy archetypes migrate to the **homepage**. |
| Hero CTA | Primary: "Join the free brotherhood call" (Luma RSVP). Secondary: "Explore the circles". |
| Founders | Homepage "Who's leading this" section, both side by side, equal billing. Plus an `/about` page. |
| Coaching | Both Charlie and Ccowl coach. One shared Calendly intro link (unchanged env var). |
| Apply flow | Port consciousbro's Resend-powered form (Zod + honeypot). |
| Old site | consciousbro stays live and untouched until after the July 23 call; redirect handled later, out of scope here. |

## Site map (after)

```
/            Hero → The Call → Is This You? → Survival Strategies (NEW)
             → Recovery Mission → The Work → Circles (NEW) → Founders (NEW)
             → Coaching (revised) → Podcast
/circles     Full offering: brotherhood call, circle structure, six agreements,
             who-for / not-for, FAQ (with 988 references), Apply CTA   (NEW)
/apply       Circle application form → POST /api/apply → Resend email  (NEW)
/thanks      Application confirmation                                   (NEW)
/about       WholeMan story + longer founder bios (placeholder-ready)   (NEW)
/coaching    Revised: both founders, shared intro-call link
/podcast     Unchanged
```

Nav: **Circles · Coaching · About · Podcast** (+ existing home anchors as
appropriate). Footer gains the mental-health disclaimer (see Guardrails).

## Homepage changes

### Hero
- Keep tagline "Presence over performance.", mission line, Colorado imagery.
- Primary CTA (copper): **"Join the free brotherhood call"** → Luma RSVP URL
  (config value; currently `https://luma.com/ryyv3hx9`, next call July 23,
  6pm PT / 9pm ET).
- Secondary CTA: **"Explore the circles"** → `/circles`.
- Podcast listen link demoted to tertiary or nav-only.

### Survival Strategies (new, after "Is This You?")
- The 12 archetypes from consciousbro `lib/copy.ts` (lines ~82–278): The Nice
  Guy, The People Pleaser, The Lone Wolf, The Performer, The Chameleon, The
  Controller, The Stoic, The Rescuer, The Protector, The Perfectionist, The
  Victim, The Avoider. Each: belief / how it shows up / the way forward.
- Interactive accordion, built WholeMan-style (no Radix/shadcn import from
  consciousbro; use a small accessible accordion consistent with the existing
  component idiom, animated with Framer Motion).
- Framing copy adapted to WholeMan voice: the mirror section shows you the
  symptoms; this section names the mask.

### Circles (new, after "The Work")
- Intro the free monthly brotherhood call (what it is, free, Zoom, RSVP CTA)
  and the paid circles (6–8 men, same men every session, trained facilitator,
  private group thread, $99/month month-to-month, by application).
- Headline candidate (migrated): "You were never meant to carry it alone."
- Links to `/circles` for full detail and `/apply`.

### Founders (new, after Circles)
- "Who's leading this" — Charlie Grove and Ty "Ccowl" Humphries side by side,
  equal billing as co-founders. Photos + short bios.
- Loud-placeholder philosophy: unwritten bios render a visible "Bio coming
  soon" block, never a blank gap. Ccowl's existing photo
  (`public/photos/ccowl.jpeg`) is used; Charlie's photo is a visible
  placeholder until provided.
- Public naming: Ccowl is the public-facing alias on the current site; keep
  "Ccowl" with real name available in about copy when bios are written.

### Coaching (revised)
- Reframe from "One man, one mission" to both founders as guides.
- Keep the free 30-minute intro call; one shared Calendly link
  (`NEXT_PUBLIC_CALENDLY_URL`, unchanged).

## /circles page

Composed of (content migrated from consciousbro, restyled):
1. Header + the monthly brotherhood call ("Start here…"; free; Zoom; RSVP CTA)
2. The circles offer ("Go deeper: join a circle." — group of 6–8, same men,
   facilitated, clear agreements, private thread, $99/month, cancel anytime,
   by application)
3. The six agreements ("How we keep it real and safe."): Confidentiality,
   Ownership, Consent before feedback, No rescuing, Presence, Safety.
4. Who it's for / not for (four bullets each, migrated verbatim; includes the
   "acute crisis → clinical care" line).
5. FAQ (migrated): Is this therapy? (988) · Is it religious? · What happens on
   the call? · Do I have to talk? · Red-pill? · Online or in person? · What if
   I'm really struggling right now? (988)
6. Final CTA → `/apply` + RSVP link.

Brand references in migrated copy rewritten from "The Conscious Brotherhood"
to WholeMan framing. Tone stays direct and grounded; light touch only.

## /apply funnel

Ported from consciousbro:
- Form fields: Name, Email, "What's drawing you in?", Availability, "Prior
  men's-work experience (optional)", required agreement checkbox
  ("I understand circles are $99/month, month to month, cancel anytime, and by
  application.").
- Honeypot field + server-side Zod validation (`lib/apply-schema.ts` ported).
- `POST /api/apply` route handler → Resend email to both founders.
- `/thanks` confirmation page.
- New deps: `resend`, `zod`. New env vars on WholeMan's Vercel project:
  `RESEND_API_KEY` (required in prod), `APPLY_FROM_EMAIL`, recipient
  address(es) in config. Update `.env.example`.
- No public checkout: applications vetted, private Stripe link sent manually
  (off-site process, unchanged).

## /about page

- The WholeMan story (mission/vision copy already in `lib/site.ts` can seed
  it) + longer bios for both founders.
- Scaffolded with loud placeholders where content is unwritten; Charlie and
  Ccowl fill in later.

## Guardrails (non-negotiable, verbatim)

- Footer, site-wide: "WholeMan offers peer support and personal-growth
  experiences among men. It is not therapy, counseling, or a substitute for
  professional mental health treatment. If you are in crisis or thinking about
  harming yourself, contact emergency services or call/text 988 (US) right
  away." (Adapted only in brand name from consciousbro's footer.)
- Both FAQ answers referencing **988** migrate intact.
- Positioning stays: peer support not therapy; non-religious; explicitly not
  red-pill/pickup.

## Data & code conventions

- All new copy lives in `lib/site.ts` extending the existing `siteConfig`
  `as const` object: `circles`, `brotherhoodCall`, `archetypes`, `founders`,
  `circlesFaq`, `agreements`, plus config values (Luma URL, next call date,
  apply recipients).
- Section components stay thin presentational wrappers in
  `components/sections/`, reading from `siteConfig`.
- Fix while touching: the hardcoded "Ccowl · founder" caption in
  `Coaching.tsx` moves to config.
- New pages follow the established pattern: `Nav` → `main` with `Container` →
  `Footer`.
- Next.js 16.2.9 / React 19.2.4 — consult `node_modules/next/dist/docs/` per
  AGENTS.md before using APIs that may have changed.

## Testing

Vitest + Testing Library, matching existing patterns:
- Port consciousbro's apply-schema tests; add tests for the apply form
  (validation errors, honeypot, success path) and `/api/apply` handler
  (mock Resend).
- Render tests for new sections (Circles, Founders, Survival Strategies
  accordion open/close, /circles page composition).
- Existing podcast/coaching tests updated where copy changes break them.

## Out of scope

- consciousbrotherhood.org redirect / repo archival (later, after July 23).
- Payments, auth, CMS, newsletter/email capture, "the Contingent" membership.
- Writing the founders' final bios (placeholders ship first).
