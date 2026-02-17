import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    const requestOrigin = forwardedHost
      ? `${forwardedProto ?? "http"}://${forwardedHost}`
      : request.nextUrl.origin;

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || requestOrigin).replace(
      /\/$/,
      ""
    );

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
      shipping_address_collection: {
        allowed_countries: ["ES", "FR", "IT", "PT"],
      },
    });

    // Retornar la URL directa de Stripe
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error Stripe:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}