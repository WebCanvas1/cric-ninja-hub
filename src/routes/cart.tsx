import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/Layout";
import { formatPrice, productImage, useCart, useProducts } from "@/lib/store";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const cart = useCart();
  const [products] = useProducts();

  const lines = cart.items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((n, l) => n + (l.product?.price || 0) * l.qty, 0);
  const shipping = subtotal > 0 && subtotal < 10000 ? 299 : 0;
  const total = subtotal + shipping;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <h1 className="display text-4xl font-bold uppercase tracking-wider sm:text-5xl">
          Your <span className="text-gradient-red">Cart</span>
        </h1>

        {lines.length === 0 ? (
          <div className="mt-16 rounded-md border border-border bg-card p-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground"
            >
              Shop Bats
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {lines.map((l) => (
                <div
                  key={l.productId}
                  className="grid grid-cols-[100px_1fr_auto] items-center gap-4 rounded-md border border-border bg-card p-4"
                >
                  <Link
                    to={`/product/${l.productId}`}
                    className="aspect-square overflow-hidden rounded-sm bg-secondary"
                  >
                    <img
                      src={productImage(l.product!)}
                      alt={l.product!.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {l.product!.category}
                    </div>
                    <Link
                      to={`/product/${l.productId}`}
                      className="display truncate text-lg font-bold hover:text-primary"
                    >
                      {l.product!.name}
                    </Link>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-sm border border-border">
                        <button
                          onClick={() => cart.setQty(l.productId, l.qty - 1)}
                          className="p-2"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">{l.qty}</span>
                        <button
                          onClick={() => cart.setQty(l.productId, l.qty + 1)}
                          className="p-2"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => cart.remove(l.productId)}
                        className="inline-flex items-center gap-1 rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-widest hover:border-primary hover:text-primary"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="display text-xl font-bold">
                      {formatPrice(l.product!.price * l.qty)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(l.product!.price)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-md border border-border bg-card p-6">
              <h2 className="display text-xl font-bold uppercase tracking-wider">
                Order Summary
              </h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-semibold">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </dd>
                </div>

                {shipping > 0 && (
                  <div className="rounded-sm bg-primary/10 p-2 text-xs text-primary">
                    Add {formatPrice(10000 - subtotal)} more for free shipping
                  </div>
                )}

                <div className="flex justify-between border-t border-border pt-3">
                  <dt className="font-bold uppercase tracking-widest">Total</dt>
                  <dd className="display text-2xl font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>

              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red hover:brightness-110"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/shop"
                className="mt-3 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
