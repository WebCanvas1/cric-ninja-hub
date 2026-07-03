import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { useContent, useProducts, LOGO_URL } from "@/lib/store";
import { ArrowRight, Award, Hammer, ShieldCheck, Star, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [content] = useContent();
  const [products] = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <SiteLayout>
      {/* HERO */}
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
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm bg-primary px-7 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red transition-all hover:brightness-110">
                Shop Bats <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-7 py-4 text-sm font-bold uppercase tracking-widest hover:border-primary hover:text-primary">
                View Collection
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              <div><div className="display text-2xl font-bold text-primary">10K+</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Batters</div></div>
              <div><div className="display text-2xl font-bold text-primary">15Y</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Craft</div></div>
              <div><div className="display text-2xl font-bold text-primary">4.9★</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">Rated</div></div>
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

      {/* FEATURED BATS */}
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

      {/* WHY CHOOSE US */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Why CRIC NINJA</div>
            <h2 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">Built Different.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.whyChooseUs.map((f, i) => {
              const Icons = [Hammer, Award, ShieldCheck, Zap];
              const Icon = Icons[i % Icons.length];
              return (
                <div key={i} className="group rounded-md border border-border bg-background p-6 transition-all hover:border-primary hover:shadow-red">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="display text-lg font-bold uppercase tracking-wide">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary shadow-card">
          <img src={content.about.image || LOGO_URL} alt="Craftsmanship" loading="lazy" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">The Workshop</div>
            <div className="display mt-1 text-2xl font-bold">Meerut, India — Home of the Ninja</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Craftsmanship</div>
          <h2 className="display mt-2 text-4xl font-bold uppercase leading-tight tracking-wider sm:text-5xl">{content.about.title}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{content.about.body}</p>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div><div className="display text-3xl font-bold text-primary">100%</div><div className="text-[11px] uppercase tracking-widest text-muted-foreground">Hand-Pressed</div></div>
            <div><div className="display text-3xl font-bold text-primary">Grade 1</div><div className="text-[11px] uppercase tracking-widest text-muted-foreground">English Willow</div></div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {content.gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Gallery</div>
            <h2 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">The Ninja Squad</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {content.gallery.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-md border border-border">
                <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Voices from the Crease</div>
            <h2 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">Trusted by Batters</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.testimonials.map((t, i) => (
              <div key={i} className="rounded-md border border-border bg-background p-8">
                <div className="mb-3 flex gap-0.5 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary" />)}
                </div>
                <p className="text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-md border border-primary/40 bg-gradient-to-br from-card via-card to-primary/20 p-10 text-center shadow-red sm:p-16">
          <h2 className="display text-4xl font-bold uppercase tracking-wider sm:text-5xl">Ready to <span className="text-gradient-red">Strike</span>?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Find the blade that matches your game. Free knock-in, free shipping on all orders above ₹10,000.</p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:brightness-110">
            Explore Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
