type KVNamespace = {
  get: (key: string, opts?: { type?: "text" | "json" }) => Promise<unknown>;
  put: (key: string, value: string) => Promise<void>;
};

export function getKV(explicitKv?: unknown): KVNamespace | null {
  if (explicitKv && typeof (explicitKv as KVNamespace).get === "function") {
    return explicitKv as KVNamespace;
  }

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

  console.error("CRIC_NINJA_KV binding not found.");
  return null;
}

export async function kvGet<T>(
  key: string,
  fallback: T,
  explicitKv?: unknown,
): Promise<T> {
  const kv = getKV(explicitKv);
  if (!kv) return fallback;

  try {
    const raw = (await kv.get(key, { type: "text" })) as string | null;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`kvGet error for key "${key}":`, err);
    return fallback;
  }
}

export async function kvPut(
  key: string,
  value: unknown,
  explicitKv?: unknown,
): Promise<boolean> {
  const kv = getKV(explicitKv);
  if (!kv) return false;

  try {
    const json = JSON.stringify(value);
    console.log(`Saving KV key "${key}", size: ${json.length}`);
    await kv.put(key, json);
    return true;
  } catch (err) {
    console.error(`kvPut error for key "${key}":`, err);
    return false;
  }
}
