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
    { label: "Instagram", href: "#" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
