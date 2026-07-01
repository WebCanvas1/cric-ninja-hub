import { createFileRoute } from "@tanstack/react-router";

// Stripe checkout server route (placeholder).
//
// When STRIPE_SECRET_KEY is present, create a real Checkout Session:
//
//   import Stripe from "stripe";
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     line_items: payload.items.map((i) => ({
//       price_data: {
//         currency: "inr",
//         product_data: { name: i.name },
//         unit_amount: Math.round(i.price * 100),
//       },
//       quantity: i.qty,
//     })),
//     customer_email: payload.customer.email,
//     success_url: `${new URL(request.url).origin}/?checkout=success`,
//     cancel_url:  `${new URL(request.url).origin}/checkout`,
//   });
//   return Response.json({ url: session.url, sessionId: session.id });

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.json().catch(() => null);
        if (!payload) return new Response("Bad request", { status: 400 });

        const stripeKey = (globalThis as { process?: { env?: Record<string, string> } })
          .process?.env?.STRIPE_SECRET_KEY;

        if (!stripeKey) {
          return Response.json(
            { url: null, error: "Stripe not configured" },
            { status: 200 },
          );
        }

        // TODO: Real Stripe session creation goes here — see comment above.
        return Response.json({ url: null, error: "Stripe integration pending" });
      },
    },
  },
});