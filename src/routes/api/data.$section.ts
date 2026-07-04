import { createFileRoute } from "@tanstack/react-router";
import { kvGet, kvPut } from "@/lib/kv.server";
import { DEFAULT_CONTENT, DEFAULT_PRODUCTS } from "@/lib/defaults";
import type { SiteContent } from "@/lib/types";

type Section = "products" | "content" | "gallery" | "about" | "contact" | "social";

const SECTIONS: Section[] = ["products", "content", "gallery", "about", "contact", "social"];

function getRuntimeKV(request: Request) {
  const anyRequest = request as Request & {
    env?: Record<string, unknown>;
    context?: { env?: Record<string, unknown> };
  };

  const g = globalThis as {
    process?: { env?: Record<string, unknown> };
    CRIC_NINJA_KV?: unknown;
    env?: Record<string, unknown>;
    __env?: Record<string, unknown>;
  };

  return (
    anyRequest.env?.CRIC_NINJA_KV ||
    anyRequest.context?.env?.CRIC_NINJA_KV ||
    g.process?.env?.CRIC_NINJA_KV ||
    g.CRIC_NINJA_KV ||
    g.env?.CRIC_NINJA_KV ||
    g.__env?.CRIC_NINJA_KV ||
    null
  );
}

async function loadContent(kv?: unknown): Promise<SiteContent> {
  return kvGet<SiteContent>("content", DEFAULT_CONTENT, kv);
}

async function readSection(section: Section, kv?: unknown) {
  if (section === "products") return kvGet("products", DEFAULT_PRODUCTS, kv);

  const content = await loadContent(kv);

  if (section === "content") return content;

  return content[section];
}

async function writeSection(section: Section, body: unknown, kv?: unknown): Promise<boolean> {
  if (section === "products") return kvPut("products", body, kv);
  if (section === "content") return kvPut("content", body, kv);

  const content = await loadContent(kv);
  const next = { ...content, [section]: body } as SiteContent;

  return kvPut("content", next, kv);
}

export const Route = createFileRoute("/api/data/$section")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const section = params.section as Section;

        if (!SECTIONS.includes(section)) {
          return new Response("Not found", { status: 404 });
        }

        const kv = getRuntimeKV(request);
        const data = await readSection(section, kv);

        return Response.json({ data });
      },

      POST: async ({ params, request }) => {
        const section = params.section as Section;

        if (!SECTIONS.includes(section)) {
          return new Response("Not found", { status: 404 });
        }

        const kv = getRuntimeKV(request);

        if (!kv) {
          console.error("CRIC_NINJA_KV binding not available in API route");

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

        if (body === null || typeof body !== "object" || !("data" in body)) {
          return new Response("Bad request", { status: 400 });
        }

        const saved = await writeSection(section, (body as { data: unknown }).data, kv);

        if (!saved) {
          console.error(`KV save failed for section: ${section}`);

          return new Response(
            JSON.stringify({
              ok: false,
              message: "KV save failed",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
