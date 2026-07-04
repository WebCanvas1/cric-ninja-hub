type Env = {
  CRIC_NINJA_KV: KVNamespace;
};

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
