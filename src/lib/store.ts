import { useEffect, useState, useSyncExternalStore } from "react";
import logoAsset from "@/assets/cric-ninja-logo.jpg.asset.json";
import { DEFAULT_CONTENT, DEFAULT_PRODUCTS } from "./defaults";
import type { Product, SiteContent } from "./types";

export type { Product, SiteContent } from "./types";
export { DEFAULT_PRODUCTS, DEFAULT_CONTENT } from "./defaults";

export const LOGO_URL = logoAsset.url;

// ---------- KV-backed store (API) with in-memory cache ----------

const CART_KEY = "cricninja:cart";
const ADMIN_KEY = "cricninja:admin";

type StoreKey = "products" | "content";
type StoreShape = { products: Product[]; content: SiteContent };

const cache: StoreShape = { products: DEFAULT_PRODUCTS, content: DEFAULT_CONTENT };
const loaded: Record<StoreKey, boolean> = { products: false, content: false };
const inflight: Partial<Record<StoreKey, Promise<void>>> = {};
const listeners = new Set<() => void>();
let version = 0;

function notify() {
  version++;
  listeners.forEach((l) => l());
}

async function fetchSection<K extends StoreKey>(key: K): Promise<void> {
  if (loaded[key] || typeof window === "undefined") return;
  if (!inflight[key]) {
    inflight[key] = (async () => {
      try {
        const res = await fetch(`/api/data/${key}`);
        if (res.ok) {
          const json = (await res.json()) as { data: StoreShape[K] };
          if (json?.data) cache[key] = json.data as StoreShape[K] as never;
        }
      } catch {
        // keep defaults on failure
      } finally {
        loaded[key] = true;
        notify();
      }
    })();
  }
  await inflight[key];
}

async function saveSection<K extends StoreKey>(key: K, value: StoreShape[K]): Promise<void> {
  cache[key] = value as never;
  notify();
  try {
    await fetch(`/api/data/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: value }),
    });
  } catch {
    // ignore; UI already updated
  }
}

function subscribeStore(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function useSection<K extends StoreKey>(
  key: K,
  fallback: StoreShape[K],
): [StoreShape[K], (v: StoreShape[K]) => void] {
  useSyncExternalStore(
    subscribeStore,
    () => version,
    () => 0,
  );
  useEffect(() => {
    void fetchSection(key);
  }, [key]);
  const value = (loaded[key] ? cache[key] : fallback) as StoreShape[K];
  return [value, (v) => void saveSection(key, v)];
}

export function useProducts(): [Product[], (p: Product[]) => void] {
  return useSection("products", DEFAULT_PRODUCTS);
}

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  return useSection("content", DEFAULT_CONTENT);
}

export function getProduct(id: string, products: Product[]): Product | undefined {
  return products.find((p) => p.id === id);
}

// ---------- Cart (localStorage only) ----------

const ADMIN_PW_KEY = ADMIN_KEY;

export const ADMIN_PASSWORD = "cricninja2026";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cricninja:store"));
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("cricninja:store", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("cricninja:store", handler);
    window.removeEventListener("storage", handler);
  };
}

// SSR-safe hook
function useLocalStore<T>(key: string, fallback: T): [T, (v: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key) ?? "",
    () => "",
  );
  const [ssrValue, setSsrValue] = useState<T>(fallback);
  useEffect(() => {
    setSsrValue(readJSON(key, fallback));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return [ssrValue, (v: T) => writeJSON(key, v)];
}

export type CartItem = { productId: string; qty: number };

export function useCart(): {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
} {
  const [items, setItems] = useLocalStore<CartItem[]>(CART_KEY, []);
  return {
    items,
    add: (id, qty = 1) => {
      const existing = items.find((i) => i.productId === id);
      const next = existing
        ? items.map((i) => (i.productId === id ? { ...i, qty: i.qty + qty } : i))
        : [...items, { productId: id, qty }];
      setItems(next);
    },
    remove: (id) => setItems(items.filter((i) => i.productId !== id)),
    setQty: (id, qty) =>
      setItems(items.map((i) => (i.productId === id ? { ...i, qty: Math.max(1, qty) } : i))),
    clear: () => setItems([]),
  };
}

// ---------- Admin auth ----------

export function useAdminAuth(): {
  authed: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
} {
  const [token, setToken] = useLocalStore<string>(ADMIN_PW_KEY, "");
  return {
    authed: token === ADMIN_PASSWORD,
    login: (pw: string) => {
      if (pw === ADMIN_PASSWORD) {
        setToken(pw);
        return true;
      }
      return false;
    },
    logout: () => setToken(""),
  };
}

// ---------- Helpers ----------

export function formatPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function productImage(p: Product): string {
  return p.images[0] || FALLBACK_BAT_IMG;
}

// Inline SVG fallback for bats without images
export const FALLBACK_BAT_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0' stop-color='#1a1a1a'/>
      <stop offset='1' stop-color='#2a2a2a'/>
    </linearGradient>
    <linearGradient id='b' x1='0' x2='0' y1='0' y2='1'>
      <stop offset='0' stop-color='#e8d9b8'/>
      <stop offset='1' stop-color='#c9a97a'/>
    </linearGradient>
  </defs>
  <rect width='400' height='500' fill='url(#g)'/>
  <g transform='translate(200 250) rotate(-15)'>
    <rect x='-45' y='-180' width='90' height='260' rx='10' fill='url(#b)'/>
    <rect x='-10' y='-190' width='20' height='30' fill='#111'/>
    <rect x='-14' y='-160' width='28' height='150' fill='#8b1a1a' opacity='.15'/>
    <line x1='0' y1='-170' x2='0' y2='70' stroke='#d94040' stroke-width='3'/>
  </g>
</svg>`);