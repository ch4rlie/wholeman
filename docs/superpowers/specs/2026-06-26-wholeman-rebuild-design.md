# WholeMan.org Rebuild — Design Spec

**Date:** 2026-06-26
**Status:** Approved direction; pending final spec review
**Owner:** Charlie (building for Ty Humphries / "Ccowl")

## 1. Purpose

Rebuild [wholeman.org](https://wholeman.org) as a bold, cinematic, fast, modern
"movement" site for **WholeMan** — a recovery mission calling men out of shame,
fragmentation, and despair, back into courageous hope, sacred self-love, and full
integration. The current site (Squarespace) has strong content but does not feel
professional or distinctive. This rebuild elevates it into a premium, custom site.

## 2. Goals & Success Criteria

- **Primary conversion goal:** book a **private 1:1 coaching call** with Ty.
- **Secondary draw:** the **WholeMan Podcast** — listens/subscribes.
- The site feels *badass, clean, fast, cinematic* and unmistakably premium.
- Fast to ship and live on Vercel.

Explicitly **out of scope for v1** (deferred to later phases):
- The "Contingent" membership/community, user accounts/logins, payments, store.
- **Email capture / newsletter** — dropped; Ty has no list to send to. No email
  signup anywhere in v1.

The architecture must not preclude adding membership/store/auth later (see §9).

## 3. Audience & Tone

Men who feel emotionally disconnected despite outward success — raised without
emotionally present fathers, performing instead of feeling, wearing the "nice guy"
or intimidating mask. Tone: introspective, vulnerable, powerful. **Presence over
performance.** Theme of the phoenix rising from despair.

## 4. Visual Direction

- **Bold & cinematic:** dark, dramatic, full-bleed outdoor photography, big
  confident typography, high contrast.
- **Outdoor theme:** mountains, forest, wilderness — matching the embodiment /
  integration message and Ty's real Colorado photography.
- **Palette:** near-black backgrounds (`#0a0a0b`), warm off-white text
  (`#f0ede7`), **copper-gold accent** (`#d2a86a`) on the powerful words and all
  primary CTAs. Earthy, warm.
- **Type:** serif for display/headlines (cinematic, soulful); sans-serif
  (Arial/Helvetica-class) for labels, nav, UI. Final typefaces TBD during build.
- **Section rhythm:** alternating backgrounds + subtle textures (film grain, dot
  grid, faint diagonal lines) and a small circled icon per section label so no two
  adjacent sections look the same.
- **Typographic spice:** italic + copper-gold emphasis on key phrases, bold on
  pivotal words.

### Brand assets (in `assets/`)
- **Logo:** the real **WHOLEMAN / I AM** mark — a yin-yang circle with a "WM"
  monogram and the WHOLEMAN wordmark + "I AM" tagline. Black on transparent/white;
  inverted to white for the dark theme.
- **Photos of Ty:** real Colorado outdoor shots (mountain sunset portrait; candid
  in a cap with snowy peaks). A guest-feature graphic from the *Change Work Life*
  podcast ("A midlife awakening") usable as an "as featured on" credibility note.
- **Image prep:** photos to be enhanced/upscaled via **Replicate** (Real-ESRGAN /
  face restoration, background removal) before production use. **Rule:** never
  AI-generate Ty's likeness — enhance the real photos only. AI generation is
  allowed only for supplemental landscape/texture backgrounds where no real photo
  exists.

## 5. Homepage Structure (canonical)

Single-page homepage, top to bottom:

1. **Nav** — logo + "WholeMan"; links: Mission · Coaching · Podcast; a copper
   "Book a call →" button.
2. **Hero** — full-bleed cinematic mountain landscape; centered brand lockup
   (large WHOLEMAN emblem), tagline *"Presence over performance."*, the mission
   line, and two CTAs: **Book a private call** (primary) and **▶ Listen to the
   podcast** (secondary).
3. **The Call** — the emotional hook ("You've achieved the things. You still feel
   empty.") over a dark forest image, with a copper quote-bar.
4. **The Work** — three cards: **Practices** / **Tools** / **Pursuits**, each with
   an icon and the WholeMan vocabulary.
5. **Coaching** — Ty's **real photo** down the page (exact treatment to be specced
   separately by Charlie), with the private-coaching pitch, what-you-get bullets,
   and the **Book your free intro call** CTA.
6. **Podcast** — pulled live from RSS: featured newest episode (with cover art) +
   a compact list of recent episodes, "View all" link, and "Listen on
   Spotify/Apple/RSS" links. Show tagline included.
7. **Footer** — logo lockup + nav links + social (Instagram), copyright.

Secondary pages (lightweight, v1): full **Podcast** index (all episodes), and a
**Coaching / Book** page hosting the booking embed. Mission/about content may be
sections on the homepage or a dedicated page — finalize during build.

## 6. Podcast Integration

- **Source:** the live RSS feed `https://anchor.fm/s/10bb68134/podcast/rss`
  (Spotify for Podcasters / Anchor). Apple ID `1861302139`, Spotify show
  `2Zmk6EmhKMF64cBc77Fizr`. Currently 24 episodes; interview format (Ty + guests).
- **Behavior:** fetch + parse the feed at **build time** (with periodic
  revalidation / ISR) so new episodes appear automatically with zero manual work.
- **Per episode:** title (incl. guest), publish date, duration, show-notes/
  description, cover art, and a play affordance.
- **Playback:** default to embedded **Spotify** players per episode (simplest,
  reliable); a direct audio player from the RSS enclosure is a fallback option.
- **Resilience:** if the feed is unreachable at build, fail gracefully (cache last
  good data; never break the build/page).

## 7. Coaching / Booking

- Primary CTA across the site routes to **booking a call**.
- **Mechanism:** embed a scheduling tool — **Calendly** (default) or **Cal.com**
  (free/open-source alternative). Decision pending; either embeds cleanly.
- v1 offers a **free intro call** (~30 min). No payments in v1.
- Trust matters for a coaching sale: lean on Ty's real photos, story, and the
  "as featured on" note.

## 8. Tech Stack & Hosting

- **Framework:** Next.js (App Router) + React.
- **Styling:** Tailwind CSS.
- **Motion:** Framer Motion for cinematic scroll/reveal/parallax.
- **Images:** Next.js `<Image>` for optimization; processed assets in `public/`.
- **Hosting:** Vercel, auto-deploy on push to `main` (GitHub:
  `ch4rlie/wholeman`, via dedicated deploy key).
- **Performance targets:** excellent Lighthouse scores; fast LCP despite
  full-bleed imagery (optimized/responsive images, minimal JS).
- **Content:** authored in-repo for v1 (no CMS). Strongest existing wholeman.org
  copy is reused but tightened and professionalized. A friendly CMS (e.g. Sanity)
  is a possible later addition.

## 9. Future-Proofing (later phases, not v1)

Build so these can be layered onto the same app without a rewrite: the Contingent
membership/community, user accounts/auth, payments, and a store. Keep routing and
data boundaries clean to accommodate them.

## 10. Open Items / To Be Specced Separately

- Exact treatment/placement of Ty's photo in the Coaching section (Charlie).
- Final typefaces and any custom wordmark.
- Calendly vs Cal.com decision.
- Whether Mission/About is a homepage section or its own page.
- Replicate image-enhancement pass on the real photos before launch.
