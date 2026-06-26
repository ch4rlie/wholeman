export const siteConfig = {
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/wholeman/intro-call",
  nav: [
    { label: "Mission", href: "/#call" },
    { label: "Coaching", href: "/coaching" },
    { label: "Podcast", href: "/podcast" },
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
      "Raised without emotionally present fathers, many men learned to perform instead of feel — to wear the \"nice guy\" or the intimidating mask, to suppress desire, to go numb. WholeMan is the path back to the man underneath.",
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
    { label: "RSS", href: "https://anchor.fm/s/10bb68134/podcast/rss" },
    { label: "Instagram", href: "https://www.instagram.com/wholemaniam/" },
  ],
  isThisYou: {
    heading: "Is this you?",
    items: [
      "You grew up without emotionally present, grounded men",
      "Your “successes” leave you feeling empty, disconnected",
      "You’re never fully satisfied with your sexual partner or encounters",
      "You can’t connect to emotions of excitement, passion, joy",
      "Your fear, sorrow, and anger are unacceptable",
      "You were taught your desire and sexuality is dangerous",
      "Either everyone says you’re a “nice guy” OR everyone is afraid of you",
      "You know there is more love, adventure, sex and power than this",
      "You’ve wondered if this life is even worth it",
      "You diminish your desires for everyone else’s sake",
    ],
  },
  recovery: {
    heading: "A recovery mission",
    body: "A recovery of the parts of you that were shamed, exiled, buried, and forgotten. A recovery of your power, your softness, your sexuality, your voice. A reMEMBERING of your beliefs, behavior, emotions, awareness and desires. A reMEMBERING of your intelligence and intuition. A recovery of the Being underneath the performance.",
  },
  manifesto: {
    is: [
      "A return to wholeness — the being you were before you performed to earn value",
      "The remembering that you were never broken, only covered",
      "The journey from fragmentation to fullness",
      "The integration of strength and softness, power and peace",
      "A space where men are seen, heard, and witnessed",
      "An invitation to stop striving and start being",
      "Awareness embodied — the meeting of truth and tenderness",
      "Presence over performance",
    ],
    isNot: [
      "A performance or perfection",
      "Fixing or being fixed",
      "Macho, dominance, force, bravado or “toughen up”",
      "Striving to be enough or earning worth",
      "Masking our true emotion or desire",
      "Lone Wolfing",
      "Shame",
      "Self-abandonment",
    ],
  },
  vision: {
    purpose: "WholeMan exists to create protected spaces for us to remember who we truly are.",
    statement: "A world where Whole People live as courageous and curious creators, infusing the art of themSELVES into every present moment.",
    closer: "Because you deserve a whole life.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
