import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/site/Layout";
import { formatPrice, productImage, useCart, useProducts } from "@/lib/store";
import { useState } from "react";
import { Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createStripeCheckoutSession } from "@/lib/stripe";

export default function Checkout() {
  const cart = useCart();
  const [products] = useProducts();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Victoria",
    pincode: "",
    country: "Australia",
  });

  const lines = cart.items
    .map((i) => ({
      ...i,
      product: products.find((p) => p.id === i.productId),
    }))
    .filter((l) => l.product);

  const subtotal = lines.reduce(
    (n, l) => n + (l.product?.price || 0) * l.qty,
    0,
  );

  const shipping = subtotal > 0 && subtotal < 150 ? 15 : 0;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lines.length === 0) return;

    setSubmitting(true);

    try {
      const session = await createStripeCheckoutSession({
        items: lines.map((l) => ({
          id: l.productId,
          name: l.product!.name,
          price: l.product!.price,
          qty: l.qty,
        })),
        customer: form,
        total,
      });

      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.success(
          "Order placed! (Stripe placeholder — connect keys to enable payments)",
        );
        cart.clear();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="display text-4xl font-bold uppercase">
            Nothing to checkout
          </h1>

          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground"
          >
            Shop Bats
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const input =
    "w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Secure Checkout
          </div>
          <h1 className="display mt-2 text-4xl font-bold uppercase tracking-wider sm:text-5xl">
            Complete <span className="text-gradient-red">Order</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="display mb-5 flex items-center gap-2 text-2xl font-bold uppercase tracking-wider">
              <Lock className="h-5 w-5 text-primary" />
              Shipping Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                className={input}
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                required
                type="email"
                className={input}
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="Suburb / City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="State"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="Postcode"
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value })
                }
              />

              <input
                required
                className={input}
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
              />
            </div>
          </div>

          <aside className="h-fit rounded-md border border-border bg-card p-6">
            <h2 className="display text-xl font-bold uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3">
              {lines.map((l) => (
                <div
                  key={l.productId}
                  className="flex gap-3 border-b border-border pb-3 last:border-b-0"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
                    <img
                      src={productImage(l.product!)}
                      alt={l.product!.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">
                      {l.product!.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty {l.qty}
                    </div>
                  </div>

                  <div className="text-sm font-bold">
                    {formatPrice(l.product!.price * l.qty)}
                  </div>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-3 text-sm">
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

              <div className="flex justify-between border-t border-border pt-3">
                <dt className="font-bold uppercase tracking-widest">Total</dt>
                <dd className="display text-2xl font-bold">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red hover:brightness-110 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {submitting ? "Processing..." : "Pay Securely"}
            </button>

            <Link
              to="/cart"
              className="mt-3 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              Back to Cart
            </Link>
          </aside>
        </form>
      </section>
    </SiteLayout>
  );
}
