import { createFileRoute } from "@tanstack/react-router";
import { kvGet, kvPut } from "@/lib/kv.server";
import { DEFAULT_CONTENT, DEFAULT_PRODUCTS } from "@/lib/defaults";
import type { SiteContent } from "@/lib/types";

type Section = "products" | "content" | "gallery" | "about" | "contact" | "social";
const SECTIONS: Section[] = ["products", "content", "gallery", "about", "contact", "social"];

async function loadContent(): Promise<SiteContent> {
  return kvGet<SiteContent>("content", DEFAULT_CONTENT);
}

async function readSection(section: Section) {
  if (section === "products") return kvGet("products", DEFAULT_PRODUCTS);
  const content = await loadContent();
  if (section === "content") return content;
  return content[section];
}

async function writeSection(section: Section, body: unknown): Promise<boolean> {
  if (section === "products") return kvPut("products", body);
  if (section === "content") return kvPut("content", body);
  const content = await loadContent();
  const next = { ...content, [section]: body } as SiteContent;
  return kvPut("content", next);
}

export const Route = createFileRoute("/api/data/$section")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const section = params.section as Section;
        if (!SECTIONS.includes(section)) return new Response("Not found", { status: 404 });
        const data = await readSection(section);
        return Response.json({ data });
      },
      POST: async ({ params, request }) => {
        const section = params.section as Section;
        if (!SECTIONS.includes(section)) return new Response("Not found", { status: 404 });
        const body = await request.json().catch(() => null);
        if (body === null || typeof body !== "object" || !("data" in (body as object))) {
          return new Response("Bad request", { status: 400 });
        }
        const saved = await writeSection(section, (body as { data: unknown }).data);
        if (!saved) {
          console.error(`KV save failed for section: ${section}`);
          return new Response(
            JSON.stringify({ ok: false, message: "KV save failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
        return Response.json({ ok: true });
      },
    },
  },
});