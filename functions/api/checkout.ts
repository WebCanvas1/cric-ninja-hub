type Env = {
  STRIPE_SECRET_KEY: string;
};

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{
      items: CheckoutItem[];
      customer?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
      };
    }>();

    if (!body.items || body.items.length === 0) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }

    const origin = new URL(context.request.url).origin;

    const params = new URLSearchParams();

    params.append("mode", "payment");
    params.append("success_url", `${origin}/success`);
    params.append("cancel_url", `${origin}/cart`);

    if (body.customer?.email) {
      params.append("customer_email", body.customer.email);
    }

    body.items.forEach((item, index) => {
      const unitAmount = Math.round(Number(item.price) * 100);

      params.append(`line_items[${index}][quantity]`, String(item.qty));
      params.append(`line_items[${index}][price_data][currency]`, "aud");
      params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmount));
      params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe error:", session);
      return Response.json(
        { error: session.error?.message || "Stripe checkout failed" },
        { status: 400 },
      );
    }

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
};
