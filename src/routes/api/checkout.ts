import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

type CheckoutItem = { id: string; name: string; price: number; qty: number };
type CheckoutPayload = {
  items: CheckoutItem[];
  customer: { email?: string };
};

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
        if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
          return new Response("Bad request", { status: 400 });
        }

        const stripeKey = (globalThis as { process?: { env?: Record<string, string> } })
          .process?.env?.STRIPE_SECRET_KEY;

        if (!stripeKey) {
          return Response.json({ url: null, error: "Stripe not configured" }, { status: 200 });
        }

        try {
          const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });
          const origin = new URL(request.url).origin;
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: payload.items.map((i) => ({
              price_data: {
                currency: "inr",
                product_data: { name: i.name },
                unit_amount: Math.round(i.price * 100),
              },
              quantity: i.qty,
            })),
            customer_email: payload.customer?.email,
            success_url: `${origin}/?checkout=success`,
            cancel_url: `${origin}/checkout`,
          });
          return Response.json({ url: session.url, sessionId: session.id });
        } catch (err) {
          console.error("Stripe checkout error", err);
          return Response.json({ url: null, error: "Stripe error" }, { status: 500 });
        }
      },
    },
  },
});