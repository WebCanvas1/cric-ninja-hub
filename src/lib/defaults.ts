import type { Product, SiteContent } from "./types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "shinobi-pro",
    name: "Shinobi Pro",
    price: 24999,
    shortDescription: "Grade 1 English Willow — tournament-ready powerhouse.",
    description:
      "The Shinobi Pro is our flagship blade — hand-pressed from premium Grade 1 English willow with 8-10 straight grains. Massive sweet spot, thick edges, and a balanced pickup engineered for aggressive stroke-play.",
    images: [],
    category: "English Willow",
    stock: 12,
    weight: "1150–1200g",
    size: "SH (Short Handle)",
    willowGrade: "Grade 1 English Willow",
    handleType: "Oval — Sarawak Cane",
    featured: true,
  },
  {
    id: "katana-elite",
    name: "Katana Elite",
    price: 18499,
    shortDescription: "Grade 2 English Willow — precision and power balanced.",
    description:
      "Crafted for the modern batter who wants both control and carry. The Katana Elite features a mid-to-high middle, concave spine, and rounded edges for maximum swing speed.",
    images: [],
    category: "English Willow",
    stock: 20,
    weight: "1180–1220g",
    size: "SH",
    willowGrade: "Grade 2 English Willow",
    handleType: "Semi-Oval Cane",
    featured: true,
  },
  {
    id: "ronin-x",
    name: "Ronin X",
    price: 8999,
    shortDescription: "Premium Kashmir Willow — durability meets performance.",
    description:
      "The Ronin X is built for club cricketers and enthusiasts. Traditional shape, deep bow, thick edges — engineered to deliver at every level.",
    images: [],
    category: "Kashmir Willow",
    stock: 35,
    weight: "1200–1250g",
    size: "SH",
    willowGrade: "Premium Kashmir Willow",
    handleType: "Round Cane",
    featured: true,
  },
  {
    id: "sensei-classic",
    name: "Sensei Classic",
    price: 14999,
    shortDescription: "Grade 3 English Willow — the trusted all-rounder.",
    description:
      "A timeless profile with a mid middle, ideal for players who value versatility. Naturally air-dried willow with 6-8 grains.",
    images: [],
    category: "English Willow",
    stock: 18,
    weight: "1150–1200g",
    size: "SH",
    willowGrade: "Grade 3 English Willow",
    handleType: "Oval Cane",
  },
  {
    id: "kunai-junior",
    name: "Kunai Junior",
    price: 4499,
    shortDescription: "Kashmir Willow — perfectly sized for young ninjas.",
    description:
      "Purpose-built for junior players. Lightweight pickup, balanced profile, and durable Kashmir willow construction.",
    images: [],
    category: "Junior",
    stock: 40,
    weight: "900–1000g",
    size: "Harrow / 6 / 5",
    willowGrade: "Kashmir Willow",
    handleType: "Round Cane",
  },
  {
    id: "assassin-players",
    name: "Assassin Players Edition",
    price: 32999,
    shortDescription: "Players-grade English Willow — 10+ grains, ultra-limited.",
    description:
      "Reserved for the elite. Hand-selected players-grade willow with 10+ straight grains, minimal blemishes, and a hand-shaped pro profile.",
    images: [],
    category: "Players Edition",
    stock: 5,
    weight: "1150–1180g",
    size: "SH / LH",
    willowGrade: "Players Grade English Willow",
    handleType: "Oval Sarawak Premium",
    featured: true,
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "Strike Like a Ninja.",
    subtitle: "Hand-crafted premium cricket bats engineered for champions.",
    tagline: "Precision willow. Explosive power. Zero compromise.",
    image: "",
  },
  about: {
    title: "The CRIC NINJA Craft",
    body: "Every CRIC NINJA blade is shaped by master craftsmen with decades of experience. We source the finest English and Kashmir willow, hand-press each cleft, and finish every bat to tournament-grade precision. From club cricketers to first-class players — our bats are trusted where it matters most.",
    image: "",
  },
  contact: {
    email: "hello@cricninja.com",
    phone: "+91 98765 43210",
    address: "CRIC NINJA Workshop, Meerut, Uttar Pradesh, India",
  },
  social: {
    instagram: "https://instagram.com/cricninja",
    facebook: "https://facebook.com/cricninja",
    youtube: "https://youtube.com/@cricninja",
    twitter: "https://twitter.com/cricninja",
  },
  gallery: [],
  testimonials: [
    {
      name: "Rohan Sharma",
      role: "Ranji Trophy Player",
      quote: "The Shinobi Pro is a weapon. Massive middle, insane pickup — best blade I've owned.",
      rating: 5,
    },
    {
      name: "Aditya Verma",
      role: "Club Captain, Mumbai",
      quote: "Craftsmanship is next level. My Katana Elite has been through two seasons and still pings.",
      rating: 5,
    },
    {
      name: "Sameer Khan",
      role: "T20 League Batter",
      quote: "CRIC NINJA bats hit different. Quality you can feel from the first knock-in.",
      rating: 5,
    },
  ],
  whyChooseUs: [
    {
      title: "Hand-Crafted",
      body: "Every blade shaped by master craftsmen — no shortcuts, no machines finishing the profile.",
    },
    {
      title: "Premium Willow",
      body: "Only Grade 1–3 English and premium Kashmir willow, cleft by cleft selected.",
    },
    {
      title: "Tournament Ready",
      body: "Pre-knocked, oiled, and match-prepped so you can score from day one.",
    },
    {
      title: "Lifetime Support",
      body: "Free repairs on all players-grade bats for the first year. We stand behind every blade.",
    },
  ],
};
