import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import {
  formatPrice,
  useCart,
  useProducts,
  useCategories,
  FALLBACK_BAT_IMG,
} from "@/lib/store";
import { useState } from "react";
import { ShoppingCart, Check, Truck, Shield, Zap, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [products] = useProducts();
  const [categories] = useCategories();
  const product = products.find((p) => p.id === id);
  const cart = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="display text-5xl font-bold uppercase">Bat not found</h1>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground"
          >
            Back to Shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const categoryName =
    categories.find((cat) => cat.id === product.category)?.name || product.category;

  const images = product.images.length ? product.images : [FALLBACK_BAT_IMG];

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const outOfStock = product.stock <= 0;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <nav className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          / <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-md border border-border bg-secondary">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden rounded-sm border-2 transition-all ${
                      activeImg === i ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {categoryName}
            </div>

            <h1 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">
              {product.name}
            </h1>

            <div className="display mt-4 text-4xl font-bold">
              {formatPrice(product.price)}
            </div>

            <p className="mt-5 text-muted-foreground">{product.description}</p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest">
              {outOfStock ? (
                <span className="text-muted-foreground">Out of Stock</span>
              ) : (
                <>
                  <Check className="h-4 w-4 text-primary" /> In Stock —{" "}
                  {product.stock} available
                </>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 rounded-md border border-border bg-card p-5 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Weight
                </div>
                <div className="font-semibold">{product.weight}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Size
                </div>
                <div className="font-semibold">{product.size}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Willow
                </div>
                <div className="font-semibold">{product.willowGrade}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Handle
                </div>
                <div className="font-semibold">{product.handleType}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center rounded-sm border border-border bg-card">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-10 text-center font-bold">{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-3 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                disabled={outOfStock}
                onClick={() => {
                  cart.add(product.id, qty);
                  toast.success(`${product.name} × ${qty} added to cart`);
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red hover:brightness-110 disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>

              <button
                disabled={outOfStock}
                onClick={() => {
                  cart.add(product.id, qty);
                  navigate("/checkout");
                }}
                className="rounded-sm border border-border bg-card px-6 py-4 text-sm font-bold uppercase tracking-widest hover:border-primary hover:text-primary disabled:opacity-40"
              >
                Buy Now
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Free Shipping $150+
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Pre-Knocked
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  1-Yr Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="display mb-8 text-3xl font-bold uppercase tracking-wider">
              Related <span className="text-gradient-red">Blades</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
