import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useContent, useProducts, LOGO_URL } from "@/lib/store";
import { ArrowRight, Award, Hammer, ShieldCheck, Star, Zap } from "lucide-react";

export default function Index() {
  const [content] = useContent();
  const [products] = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 md:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
              <Zap className="h-3 w-3" /> Handcrafted Since Day One
            </div>
            <h1 className="display text-5xl font-bold uppercase leading-[0.95] tracking-wider sm:text-6xl md:text-7xl">
              {content.hero.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-gradient-red">{content.hero.title.split(" ").slice(-1)}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">{content.hero.subtitle}</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-primary">{content.hero.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/shop" className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red transition-all hover:brightness-110">
                Shop Bats <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/shop" className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-7 py-4 text-sm font-bold uppercase tracking-widest hover:border-primary hover:text-primary">
                View Collection
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-full border-2 border-primary/30 shadow-red">
              <img src={content.hero.image || LOGO_URL} alt="CRIC NINJA" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">The Arsenal</div>
            <h2 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">Featured Bats</h2>
          </div>
          <Link to="/shop" className="hidden text-sm font-bold uppercase tracking-widest text-primary hover:underline sm:inline-flex">View All →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* rest of your file remains unchanged */}
    </SiteLayout>
  );
}
