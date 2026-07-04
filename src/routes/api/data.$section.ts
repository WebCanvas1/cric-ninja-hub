import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { DEFAULT_CONTENT, DEFAULT_PRODUCTS } from "@/lib/defaults";

type Section = "products" | "content";
const SECTIONS: Section[] = ["products", "content"];

type KV = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string) => Promise<void>;
};

function getKV() {
  return (env as unknown as { CRIC_NINJA_KV?: KV }).CRIC_NINJA_KV;
}

export const Route = createFileRoute("/api/data/$section")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const section = params.section as Section;

        if (!SECTIONS.includes(section)) {
          return new Response("Not found", { status: 404 });
        }

        const kv = getKV();

        if (!kv) {
          return Response.json({
            data: section === "content" ? DEFAULT_CONTENT : DEFAULT_PRODUCTS,
          });
        }

        const raw = await kv.get(section);

        return Response.json({
          data: raw
            ? JSON.parse(raw)
            : section === "content"
              ? DEFAULT_CONTENT
              : DEFAULT_PRODUCTS,
        });
      },

      POST: async ({ params, request }) => {
        const section = params.section as Section;

        if (!SECTIONS.includes(section)) {
          return new Response("Not found", { status: 404 });
        }

        const kv = getKV();

        if (!kv) {
          return new Response(
            JSON.stringify({
              ok: false,
              message: "CRIC_NINJA_KV binding not available",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object" || !("data" in body)) {
          return new Response("Bad request", { status: 400 });
        }

        await kv.put(section, JSON.stringify((body as { data: unknown }).data));

        return Response.json({ ok: true });
      },
    },
  },
});
