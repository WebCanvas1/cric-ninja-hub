import { useEffect, useState, useSyncExternalStore } from "react";
import logoAsset from "@/assets/cric-ninja-logo.jpg.asset.json";

export const LOGO_URL = logoAsset.url;

export type Product = {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  images: string[]; // base64 data URLs or urls
  category: string;
  stock: number;
  weight: string;
  size: string;
  willowGrade: string;
  handleType: string;
  featured?: boolean;
};

export type SiteContent = {
  hero: { title: string; subtitle: string; tagline: string };
  about: { title: string; body: string };
  contact: { email: string; phone: string; address: string };
  social: { instagram: string; facebook: string; youtube: string; twitter: string };
  gallery: string[]; // urls or base64
  testimonials: { name: string; role: string; quote: string; rating: number }[];
  whyChooseUs: { title: string; body: string }[];
};

const DEFAULT_PRODUCTS: Product[] = [
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

const DEFAULT_CONTENT: SiteContent = {
  hero: {
    title: "Strike Like a Ninja.",
    subtitle: "Hand-crafted premium cricket bats engineered for champions.",
    tagline: "Precision willow. Explosive power. Zero compromise.",
  },
  about: {
    title: "The CRIC NINJA Craft",
    body: "Every CRIC NINJA blade is shaped by master craftsmen with decades of experience. We source the finest English and Kashmir willow, hand-press each cleft, and finish every bat to tournament-grade precision. From club cricketers to first-class players — our bats are trusted where it matters most.",
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
    { name: "Rohan Sharma", role: "Ranji Trophy Player", quote: "The Shinobi Pro is a weapon. Massive middle, insane pickup — best blade I've owned.", rating: 5 },
    { name: "Aditya Verma", role: "Club Captain, Mumbai", quote: "Craftsmanship is next level. My Katana Elite has been through two seasons and still pings.", rating: 5 },
    { name: "Sameer Khan", role: "T20 League Batter", quote: "CRIC NINJA bats hit different. Quality you can feel from the first knock-in.", rating: 5 },
  ],
  whyChooseUs: [
    { title: "Hand-Crafted", body: "Every blade shaped by master craftsmen — no shortcuts, no machines finishing the profile." },
    { title: "Premium Willow", body: "Only Grade 1–3 English and premium Kashmir willow, cleft by cleft selected." },
    { title: "Tournament Ready", body: "Pre-knocked, oiled, and match-prepped so you can score from day one." },
    { title: "Lifetime Support", body: "Free repairs on all players-grade bats for the first year. We stand behind every blade." },
  ],
};

// ---------- Storage layer (localStorage + subscribable) ----------

const PRODUCTS_KEY = "cricninja:products";
const CONTENT_KEY = "cricninja:content";
const CART_KEY = "cricninja:cart";
const ADMIN_KEY = "cricninja:admin";

export const ADMIN_PASSWORD = "cricninja2026";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cricninja:store"));
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("cricninja:store", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("cricninja:store", handler);
    window.removeEventListener("storage", handler);
  };
}

// SSR-safe hook
function useStore<T>(key: string, fallback: T): [T, (v: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) ?? "",
    () => "",
  );
  const [ssrValue, setSsrValue] = useState<T>(fallback);
  useEffect(() => {
    setSsrValue(readJSON(key, fallback));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return [ssrValue, (v: T) => writeJSON(key, v)];
}

export function useProducts(): [Product[], (p: Product[]) => void] {
  return useStore<Product[]>(PRODUCTS_KEY, DEFAULT_PRODUCTS);
}

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  return useStore<SiteContent>(CONTENT_KEY, DEFAULT_CONTENT);
}

export function getProduct(id: string, products: Product[]): Product | undefined {
  return products.find((p) => p.id === id);
}

// ---------- Cart ----------

export type CartItem = { productId: string; qty: number };

export function useCart(): {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
} {
  const [items, setItems] = useStore<CartItem[]>(CART_KEY, []);
  return {
    items,
    add: (id, qty = 1) => {
      const existing = items.find((i) => i.productId === id);
      const next = existing
        ? items.map((i) => (i.productId === id ? { ...i, qty: i.qty + qty } : i))
        : [...items, { productId: id, qty }];
      setItems(next);
    },
    remove: (id) => setItems(items.filter((i) => i.productId !== id)),
    setQty: (id, qty) =>
      setItems(items.map((i) => (i.productId === id ? { ...i, qty: Math.max(1, qty) } : i))),
    clear: () => setItems([]),
  };
}

// ---------- Admin auth ----------

export function useAdminAuth(): {
  authed: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
} {
  const [token, setToken] = useStore<string>(ADMIN_KEY, "");
  return {
    authed: token === ADMIN_PASSWORD,
    login: (pw: string) => {
      if (pw === ADMIN_PASSWORD) {
        setToken(pw);
        return true;
      }
      return false;
    },
    logout: () => setToken(""),
  };
}

// ---------- Helpers ----------

export function formatPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function productImage(p: Product): string {
  return p.images[0] || FALLBACK_BAT_IMG;
}

// Inline SVG fallback for bats without images
export const FALLBACK_BAT_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0' stop-color='#1a1a1a'/>
      <stop offset='1' stop-color='#2a2a2a'/>
    </linearGradient>
    <linearGradient id='b' x1='0' x2='0' y1='0' y2='1'>
      <stop offset='0' stop-color='#e8d9b8'/>
      <stop offset='1' stop-color='#c9a97a'/>
    </linearGradient>
  </defs>
  <rect width='400' height='500' fill='url(#g)'/>
  <g transform='translate(200 250) rotate(-15)'>
    <rect x='-45' y='-180' width='90' height='260' rx='10' fill='url(#b)'/>
    <rect x='-10' y='-190' width='20' height='30' fill='#111'/>
    <rect x='-14' y='-160' width='28' height='150' fill='#8b1a1a' opacity='.15'/>
    <line x1='0' y1='-170' x2='0' y2='70' stroke='#d94040' stroke-width='3'/>
  </g>
</svg>`);