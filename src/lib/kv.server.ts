// KV binding accessor. On Cloudflare Workers (nitro cloudflare preset) with
// nodejs_compat, bindings are exposed on process.env at runtime.
type KVNamespace = {
  get: (key: string, opts?: { type?: "text" | "json" }) => Promise<unknown>;
  put: (key: string, value: string) => Promise<void>;
};

export function getKV(): KVNamespace | null {
  const env = (globalThis as { process?: { env?: Record<string, unknown> } }).process?.env;
  const kv = env?.CRIC_NINJA_KV as KVNamespace | undefined;
  if (!kv || typeof kv.get !== "function") return null;
  return kv;
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
  } catch {
    return false;
  }
}