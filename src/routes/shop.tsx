import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts } from "@/lib/store";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Premium Cricket Bats — CRIC NINJA" },
      { name: "description", content: "Browse hand-crafted English & Kashmir willow cricket bats. Featured, players-grade, and junior blades." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [products] = useProducts();
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("featured");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filtered = useMemo(() => {
    let list = category === "All" ? products : products.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [products, category, sort]);

  return (
    <SiteLayout>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">The Arsenal</div>
          <h1 className="display mt-2 text-5xl font-bold uppercase tracking-wider sm:text-6xl">Shop <span className="text-gradient-red">Bats</span></h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Every blade hand-pressed, oiled, and knocked-in. Choose your weapon.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-sm border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-sm border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-widest"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-16 text-center text-muted-foreground">No bats in this category yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}