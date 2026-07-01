import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { formatPrice, productImage, useCart, useProducts } from "@/lib/store";
import { useState } from "react";
import { Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createStripeCheckoutSession } from "@/lib/stripe";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — CRIC NINJA" }] }),
  component: Checkout,
});

function Checkout() {
  const cart = useCart();
  const [products] = useProducts();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", country: "India",
  });

  const lines = cart.items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((n, l) => n + (l.product?.price || 0) * l.qty, 0);
  const shipping = subtotal > 0 && subtotal < 10000 ? 299 : 0;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    try {
      const session = await createStripeCheckoutSession({
        items: lines.map((l) => ({ id: l.productId, name: l.product!.name, price: l.product!.price, qty: l.qty })),
        customer: form,
        total,
      });

      if (session.url) {
        // Real Stripe flow — redirect
        window.location.href = session.url;
      } else {
        // Placeholder (no keys yet): simulate success
        toast.success("Order placed! (Stripe placeholder — connect keys to enable real payments)");
        cart.clear();
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error("Checkout failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="display text-4xl font-bold uppercase">Nothing to checkout</h1>
          <Link to="/shop" className="mt-6 inline-flex rounded-sm bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground">Shop Bats</Link>
        </div>
      </SiteLayout>
    );
  }

  const input = "w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <h1 className="display text-4xl font-bold uppercase tracking-wider sm:text-5xl">Check<span className="text-gradient-red">out</span></h1>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <section className="rounded-md border border-border bg-card p-6">
              <h2 className="display mb-5 text-xl font-bold uppercase tracking-wider">Contact</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${input} sm:col-span-2`} />
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-6">
              <h2 className="display mb-5 text-xl font-bold uppercase tracking-wider">Delivery Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${input} sm:col-span-2`} />
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
                <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={input} />
                <input required placeholder="PIN code" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={input} />
                <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={input} />
              </div>
            </section>

            <section className="rounded-md border border-border bg-card p-6">
              <h2 className="display mb-3 text-xl font-bold uppercase tracking-wider">Payment</h2>
              <p className="text-sm text-muted-foreground">Secure payment powered by Stripe. You'll be redirected to complete your purchase.</p>
              <div className="mt-4 flex items-center gap-2 rounded-sm border border-dashed border-border p-4 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4" /> Stripe placeholder — add STRIPE_SECRET_KEY to enable real card payments.
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-md border border-border bg-card p-6">
            <h2 className="display mb-4 text-xl font-bold uppercase tracking-wider">Order</h2>
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.productId} className="flex items-center gap-3 text-sm">
                  <img src={productImage(l.product!)} className="h-14 w-14 rounded-sm object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold">{l.product!.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {l.qty}</div>
                  </div>
                  <div className="font-semibold">{formatPrice(l.product!.price * l.qty)}</div>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "FREE" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2"><dt className="font-bold uppercase tracking-widest">Total</dt><dd className="display text-2xl font-bold">{formatPrice(total)}</dd></div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-red hover:brightness-110 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" /> {submitting ? "Processing..." : "Pay Securely"}
            </button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">256-bit SSL encrypted</p>
          </aside>
        </form>
      </div>
    </SiteLayout>
  );
}