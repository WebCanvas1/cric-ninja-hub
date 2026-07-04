// KV binding accessor. On Cloudflare Workers (nitro cloudflare preset) with
// nodejs_compat, bindings are exposed on process.env at runtime.
type KVNamespace = {
  get: (key: string, opts?: { type?: "text" | "json" }) => Promise<unknown>;
  put: (key: string, value: string) => Promise<void>;
};

export function getKV(): KVNamespace | null {
  const g = globalThis as {
    process?: { env?: Record<string, unknown> };
    CRIC_NINJA_KV?: unknown;
    env?: Record<string, unknown>;
    __env?: Record<string, unknown>;
  };
  const candidates: unknown[] = [
    g.process?.env?.CRIC_NINJA_KV,
    g.CRIC_NINJA_KV,
    g.env?.CRIC_NINJA_KV,
    g.__env?.CRIC_NINJA_KV,
  ];
  for (const c of candidates) {
    if (c && typeof (c as KVNamespace).get === "function") return c as KVNamespace;
  }
  console.error(
    "CRIC_NINJA_KV binding not found. Ensure the KV namespace is bound in wrangler.jsonc / Cloudflare dashboard.",
  );
  return null;
}

export async function kvGet<T>(key: string, fallback: T): Promise<T> {
  const kv = getKV();
  if (!kv) return fallback;
  try {
    const raw = (await kv.get(key, { type: "text" })) as string | null;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function kvPut(key: string, value: unknown): Promise<boolean> {
  const kv = getKV();
  if (!kv) return false;
  try {
    await kv.put(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`kvPut error for key "${key}":`, err);
    return false;
  }
}