import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  nitro: {
    cloudflare: {
      deployConfig: true,
      wrangler: {
        name: "cric-ninja-hub",
        compatibility_date: "2025-01-01",
        compatibility_flags: ["nodejs_compat"],
        kv_namespaces: [
          {
            binding: "CRIC_NINJA_KV",
            id: "ebeeaef3d2f640988c67f6ac72a41479",
          },
        ],
      },
    },
  },
});
