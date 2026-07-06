export const siteConfig = {
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/wholeman/intro-call",
  lumaUrl: "https://luma.com/ryyv3hx9",
  nextCall: { date: "July 23", time: "6pm PT / 9pm ET" },
  // NOTE: confirm this mailbox exists before launch (used as mailto fallback on the apply form)
  contactEmail: "hello@wholeman.org",
  nav: [
    { label: "Circles", href: "/circles" },
    { label: "Coaching", href: "/coaching" },
    { label: "About", href: "/about" },
    { label: "Podcast", href: "/podcast" },
  ],
  hero: {
    tagline: "Presence over performance.",
    mission:
      "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration.",
    primaryCta: "Join the free brotherhood call",
    secondaryCta: "Explore the circles",
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
      {
        name: "The Nice Guy",
        belief: "If everyone is happy with me, I'll finally be loved.",
        showsUp: [
          "You avoid conflict.",
          "You say yes when you mean no.",
          "You struggle to ask for what you want.",
          "You secretly hope people notice your sacrifices.",
          "You become resentful because no one seems to appreciate everything you do.",
        ],
        wayForward: [
          "Learn that kindness without honesty isn't kindness.",
          "Practice disappointing people.",
          "Speak the truth even when it feels uncomfortable.",
          "Love doesn't require self-abandonment.",
        ],
      },
      {
        name: "The People Pleaser",
        belief: "My needs matter less than everyone else's.",
        showsUp: [
          "You constantly scan other people's emotions.",
          "You change yourself to fit the room.",
          "You fear rejection.",
          "You apologize too much.",
          "You don't know what you actually want anymore.",
        ],
        wayForward: [
          "Reconnect with your own wants.",
          "Practice boundaries.",
          "Let people experience disappointment without rushing to fix it.",
        ],
      },
      {
        name: "The Lone Wolf",
        belief: "I can only rely on myself.",
        showsUp: [
          "You isolate.",
          "You never ask for help.",
          "You carry everything alone.",
          "You feel lonely but don't let anyone close.",
          "You wear independence like armor.",
        ],
        wayForward: [
          "Strength isn't isolation.",
          "Practice being known.",
          "Let trustworthy people help.",
          "Brotherhood begins where self-protection ends.",
        ],
      },
      {
        name: "The Performer",
        belief: "My worth comes from achievement.",
        showsUp: [
          "You're always chasing the next goal.",
          "Rest feels guilty.",
          "You never feel successful enough.",
          "You hide your struggles.",
          "Your identity depends on winning.",
        ],
        wayForward: [
          "You are more than what you produce.",
          "Let people know the man behind the accomplishments.",
        ],
      },
      {
        name: "The Chameleon",
        belief: "I become whoever I need to be.",
        showsUp: [
          "Different personality with different groups.",
          "You struggle to know what you actually believe.",
          "You fear being disliked.",
          "You constantly read the room.",
        ],
        wayForward: [
          "Practice consistency.",
          "Ask yourself: \"What do I actually think?\" Not \"What will they like?\"",
        ],
      },
      {
        name: "The Controller",
        belief: "If I can control everything, I'll finally feel safe.",
        showsUp: [
          "Micromanaging.",
          "Difficulty trusting.",
          "Anxiety when plans change.",
          "Need to always be right.",
          "Difficulty surrendering.",
        ],
        wayForward: [
          "Control creates temporary certainty.",
          "Trust creates peace.",
          "Learn to tolerate uncertainty.",
        ],
      },
      {
        name: "The Stoic",
        belief: "Showing emotion is weakness.",
        showsUp: [
          "You intellectualize everything.",
          "Anger is the only emotion that feels safe.",
          "You shut down during conflict.",
          "You don't know how to express what you feel.",
          "You say \"I'm fine\" even when you're not.",
        ],
        wayForward: [
          "Emotions aren't weakness. They're information.",
          "Practice naming what you're feeling before trying to solve it.",
        ],
      },
      {
        name: "The Rescuer",
        belief: "My value comes from fixing everyone else.",
        showsUp: [
          "You take responsibility for other people's lives.",
          "You give advice no one asked for.",
          "You feel guilty saying no.",
          "You neglect yourself while helping everyone else.",
        ],
        wayForward: [
          "Compassion doesn't require carrying someone else's burden.",
          "Support people. Don't save them.",
        ],
      },
      {
        name: "The Protector",
        belief: "If I stay guarded, I can't be hurt.",
        showsUp: [
          "You joke instead of being vulnerable.",
          "You avoid difficult conversations.",
          "You rarely let people see the real you.",
          "Intimacy feels dangerous.",
        ],
        wayForward: [
          "Protection kept you safe. Connection requires taking the armor off.",
          "Not with everyone. With the right people.",
        ],
      },
      {
        name: "The Perfectionist",
        belief: "If I do everything perfectly, I can't be criticized.",
        showsUp: [
          "Overthinking.",
          "Procrastination.",
          "Fear of failure.",
          "Impossible standards.",
          "Constant self-criticism.",
        ],
        wayForward: [
          "Done is better than perfect.",
          "Growth comes through action. Not flawless performance.",
        ],
      },
      {
        name: "The Victim",
        belief: "My life is happening to me.",
        showsUp: [
          "Blaming circumstances.",
          "Waiting for motivation.",
          "Feeling powerless.",
          "Believing change is for other people.",
        ],
        wayForward: [
          "You may not be responsible for what happened. But you are responsible for what happens next.",
          "Agency changes everything.",
        ],
      },
      {
        name: "The Avoider",
        belief: "If I avoid discomfort, I'll be okay.",
        showsUp: [
          "Endless scrolling.",
          "Porn.",
          "Gaming.",
          "Drinking.",
          "Overworking.",
          "Busyness.",
          "Never slowing down enough to feel.",
        ],
        wayForward: [
          "Healing begins where distraction ends.",
          "Turn toward what you've been running from. Not alone. Together.",
        ],
      },
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
    ] as readonly { name: string; role: string; photo: string | null; bio: string | null }[],
  },
} as const;

export type SiteConfig = typeof siteConfig;
