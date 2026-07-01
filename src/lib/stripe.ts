// Stripe Checkout scaffolding.
// To enable real payments:
//   1. Add STRIPE_SECRET_KEY as a secret in Lovable
//   2. Implement the /api/checkout server route (see src/routes/api/checkout.ts)
//      using `stripe.checkout.sessions.create(...)` with the cart line items
//   3. This helper will POST to it and receive { url } to redirect the buyer
//
// While no keys are configured, the helper returns { url: null } so the
// checkout UI falls back to a "placeholder success" flow.

export type CheckoutPayload = {
  items: { id: string; name: string; price: number; qty: number }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  total: number;
};

export async function createStripeCheckoutSession(
  payload: CheckoutPayload,
): Promise<{ url: string | null; sessionId?: string }> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { url: null };
    const data = (await res.json()) as { url?: string; sessionId?: string };
    return { url: data.url ?? null, sessionId: data.sessionId };
  } catch {
    // No backend / no keys configured yet — allow the checkout page to fall back.
    return { url: null };
  }
}