# WholeMan

A rebuild of [wholeman.org](https://wholeman.org) — a bold, cinematic movement site for **WholeMan**, a recovery mission calling men out of shame and fragmentation back into integration. By Ty Humphries (Ccowl).

**v1 scope:** marketing site + auto-updating podcast hub, with private 1:1 coaching as the primary call-to-action.

- **Primary CTA:** book a private coaching call
- **Secondary draw:** the WholeMan Podcast (auto-pulled from RSS)
- **Look:** bold / cinematic, dark, outdoor photography, earthy palette
- **Stack:** Next.js + Tailwind + Framer Motion, deployed on Vercel
- **Podcast feed:** `https://anchor.fm/s/10bb68134/podcast/rss`

Design spec lives in `docs/superpowers/specs/`.

## Assets

`assets/` holds source brand assets (logo, photos of Ty). Production-ready,
processed images will live under the app's `public/` directory once the build
begins.

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
