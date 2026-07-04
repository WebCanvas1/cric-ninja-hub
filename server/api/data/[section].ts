import { defineEventHandler, getRouterParam, readBody } from "h3";

type Env = {
  CRIC_NINJA_KV: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
  };
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
  testimonials: [],
  whyChooseUs: [],
};

export default defineEventHandler(async (event) => {
  const section = getRouterParam(event, "section");

  if (!section || !["content", "products"].includes(section)) {
    return new Response("Not found", { status: 404 });
  }

  const env = event.req.runtime?.cloudflare?.env as Env | undefined;
  const kv = env?.CRIC_NINJA_KV;

  if (!kv) {
    return new Response(
      JSON.stringify({ ok: false, message: "CRIC_NINJA_KV binding not available" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  if (event.method === "GET") {
    const raw = await kv.get(section);

    return {
      data: raw ? JSON.parse(raw) : section === "content" ? DEFAULT_CONTENT : [],
    };
  }

  if (event.method === "POST") {
    const body = await readBody(event);

    if (!body || typeof body !== "object" || !("data" in body)) {
      return new Response("Bad request", { status: 400 });
    }

    await kv.put(section, JSON.stringify(body.data));

    return { ok: true };
  }

  return new Response("Method not allowed", { status: 405 });
});
