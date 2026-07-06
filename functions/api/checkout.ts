type Env = {
  STRIPE_SECRET_KEY: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json<{
      items: { id: string; name: string; price: number; qty: number }[];
      customer: { email?: string };
      total?: number;
    }>();

    if (!body.items?.length) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }

    const origin = new URL(context.request.url).origin;
    const params = new URLSearchParams();

    params.append("mode", "payment");
    params.append("success_url", `${origin}/`);
    params.append("cancel_url", `${origin}/cart`);

    if (body.customer?.email) {
      params.append("customer_email", body.customer.email);
    }

    let subtotal = 0;

    body.items.forEach((item, index) => {
      subtotal += item.price * item.qty;

      params.append(`line_items[${index}][quantity]`, String(item.qty));
      params.append(`line_items[${index}][price_data][currency]`, "aud");
      params.append(
        `line_items[${index}][price_data][unit_amount]`,
        String(Math.round(item.price * 100)),
      );
      params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
    });

    const shipping = subtotal > 0 && subtotal < 150 ? 15 : 0;

    if (shipping > 0) {
      const index = body.items.length;

      params.append(`line_items[${index}][quantity]`, "1");
      params.append(`line_items[${index}][price_data][currency]`, "aud");
      params.append(`line_items[${index}][price_data][unit_amount]`, String(shipping * 100));
      params.append(`line_items[${index}][price_data][product_data][name]`, "Shipping");
    }

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
      return Response.json(
        { error: session.error?.message || "Stripe checkout failed" },
        { status: 400 },
      );
    }

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Checkout failed" }, { status: 500 });
  }
};
