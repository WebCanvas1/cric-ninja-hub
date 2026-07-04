type Env = {
  CRIC_NINJA_KV: KVNamespace;
};

const DEFAULT_CONTENT = {
  hero: {
    title: "Strike Like a Ninja.",
    subtitle: "Hand-crafted premium cricket bats engineered for champions.",
    tagline: "Precision willow. Explosive power. Zero compromise.",
    image: "",
  },
  about: {
    title: "The CRIC NINJA Craft",
    body: "Every CRIC NINJA blade is shaped by master craftsmen with decades of experience. We source the finest English and Kashmir willow, hand-press each cleft, and finish every bat to tournament-grade precision.",
    image: "",
  },
  contact: {
    email: "hello@cricninja.com",
    phone: "+91 98765 43210",
    address: "CRIC NINJA Workshop, Meerut, Uttar Pradesh, India",
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const section = context.params.section as string;

  if (!["content", "products"].includes(section)) {
    return new Response("Not found", { status: 404 });
  }

  const raw = await context.env.CRIC_NINJA_KV.get(section);

  return Response.json({
    data: raw ? JSON.parse(raw) : section === "content" ? DEFAULT_CONTENT : DEFAULT_PRODUCTS,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const section = context.params.section as string;

  if (!["content", "products"].includes(section)) {
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
