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
    state: "",
    pincode: "",
    country: "India",
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

  const shipping = subtotal > 0 && subtotal < 10000 ? 299 : 0;
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
      {/* Keep the remainder of your JSX exactly the same */}
      {/* The only React Router changes needed are:
          - import Link/useNavigate from react-router-dom
          - export default function Checkout()
          - navigate("/") instead of navigate({ to: "/" })
      */}
    </SiteLayout>
  );
}
