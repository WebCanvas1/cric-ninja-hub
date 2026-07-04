type Env = {
  CRIC_NINJA_KV: KVNamespace;
};

const DEFAULT_CATEGORIES = [
  { id: "english-willow", name: "English Willow" },
  { id: "kashmir-willow", name: "Kashmir Willow" },
  { id: "junior", name: "Junior" },
  { id: "players-edition", name: "Players Edition" },
  { id: "accessories", name: "Accessories" },
];

const DEFAULT_CONTENT = {
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
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
  },
  gallery: [],
  testimonials: [],
  whyChooseUs: [],
};

const DEFAULT_PRODUCTS: unknown[] = [];

const VALID_SECTIONS = ["content", "products", "categories"];

function getDefaultData(section: string) {
  if (section === "content") return DEFAULT_CONTENT;
  if (section === "products") return DEFAULT_PRODUCTS;
  if (section === "categories") return DEFAULT_CATEGORIES;

  return null;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const section = context.params.section as string;

  if (!VALID_SECTIONS.includes(section)) {
    return new Response("Not found", { status: 404 });
  }

  const raw = await context.env.CRIC_NINJA_KV.get(section);

  return Response.json({
    data: raw ? JSON.parse(raw) : getDefaultData(section),
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const section = context.params.section as string;

  if (!VALID_SECTIONS.includes(section)) {
    return new Response("Not found", { status: 404 });
  }

  const body = await context.request.json().catch(() => null);

  if (!body || typeof body !== "object" || !("data" in body)) {
    return new Response("Bad request", { status: 400 });
  }

  await context.env.CRIC_NINJA_KV.put(
    section,
    JSON.stringify((body as { data: unknown }).data),
  );

  return Response.json({ ok: true });
};
