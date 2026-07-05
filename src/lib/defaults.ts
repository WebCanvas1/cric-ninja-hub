import type { Product, SiteContent, Category } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "english-willow", name: "English Willow" },
  { id: "kashmir-willow", name: "Kashmir Willow" },
  { id: "junior", name: "Junior" },
  { id: "players-edition", name: "Players Edition" },
  { id: "accessories", name: "Accessories" },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "shinobi-pro",
    name: "Shinobi Pro",
    price: 249.99,
    shortDescription: "Grade 1 English Willow — tournament-ready powerhouse.",
    description:
      "The Shinobi Pro is our flagship blade — hand-pressed from premium Grade 1 English willow with 8-10 straight grains. Massive sweet spot, thick edges, and a balanced pickup engineered for aggressive stroke-play.",
    images: [],
    category: "english-willow",
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
    price: 184.99,
    shortDescription: "Grade 2 English Willow — precision and power balanced.",
    description:
      "Crafted for the modern batter who wants both control and carry. The Katana Elite features a mid-to-high middle, concave spine, and rounded edges for maximum swing speed.",
    images: [],
    category: "english-willow",
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
    price: 89.99,
    shortDescription: "Premium Kashmir Willow — durability meets performance.",
    description:
      "The Ronin X is built for club cricketers and enthusiasts. Traditional shape, deep bow, thick edges — engineered to deliver at every level.",
    images: [],
    category: "kashmir-willow",
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
    price: 149.99,
    shortDescription: "Grade 3 English Willow — the trusted all-rounder.",
    description:
      "A timeless profile with a mid middle, ideal for players who value versatility. Naturally air-dried willow with 6-8 grains.",
    images: [],
    category: "english-willow",
    stock: 18,
    weight: "1150–1200g",
    size: "SH",
    willowGrade: "Grade 3 English Willow",
    handleType: "Oval Cane",
  },
  {
    id: "kunai-junior",
    name: "Kunai Junior",
    price: 44.99,
    shortDescription: "Kashmir Willow — perfectly sized for young ninjas.",
    description:
      "Purpose-built for junior players. Lightweight pickup, balanced profile, and durable Kashmir willow construction.",
    images: [],
    category: "junior",
    stock: 40,
    weight: "900–1000g",
    size: "Harrow / 6 / 5",
    willowGrade: "Kashmir Willow",
    handleType: "Round Cane",
  },
  {
    id: "assassin-players",
    name: "Assassin Players Edition",
    price: 329.99,
    shortDescription: "Players-grade English Willow — 10+ grains, ultra-limited.",
    description:
      "Reserved for the elite. Hand-selected players-grade willow with 10+ straight grains, minimal blemishes, and a hand-shaped pro profile.",
    images: [],
    category: "players-edition",
    stock: 5,
    weight: "1150–1180g",
    size: "SH / LH",
    willowGrade: "Players Grade English Willow",
    handleType: "Oval Sarawak Premium",
    featured: true,
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  branding: {
    logo: "",
  },

  hero: {
    title: "Strike Like a Ninja.",
    subtitle: "Hand-crafted premium cricket bats engineered for champions.",
    tagline: "Precision willow. Explosive power. Zero compromise.",
    image: "",
  },
  about: {
    title: "The CRIC NINJA Craft",
    body: "Every CRIC NINJA blade is shaped by skilled craftsmen with years of experience. We source the finest English and Kashmir willow, hand-press each cleft, and finish every bat to tournament-grade precision. From Melbourne club cricketers to serious players across Australia — our bats are trusted where it matters most.",
    image: "",
  },
  contact: {
    email: "hello@cricninja.com",
    phone: "+61 400 000 000",
    address: "Melbourne, Victoria, Australia",
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
      name: "James Wilson",
      role: "Victorian Grade Cricketer",
      quote:
        "The Shinobi Pro is a weapon. Massive middle, incredible pickup and outstanding balance.",
      rating: 5,
    },
    {
      name: "Liam Parker",
      role: "Club Captain, Melbourne",
      quote:
        "The craftsmanship is exceptional. My Katana Elite has performed brilliantly throughout the season.",
      rating: 5,
    },
    {
      name: "Ethan Roberts",
      role: "T20 League Batter, Australia",
      quote:
        "CRIC NINJA bats feel amazing straight out of the box. Premium quality from every angle.",
      rating: 5,
    },
  ],
  whyChooseUs: [
    {
      title: "Hand-Crafted",
      body: "Every blade is shaped with care — no shortcuts, no compromise on the final profile.",
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
      title: "Local Support",
      body: "Melbourne-based support for players across Australia. We stand behind every blade.",
    },
  ],
};
