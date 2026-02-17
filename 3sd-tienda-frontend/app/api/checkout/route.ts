import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeBaseUrl(value: string) {
  const trimmedValue = value.trim().replace(/\/$/, "");
  if (!trimmedValue) {
    return "";
  }

  const withScheme = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  return isValidHttpUrl(withScheme) ? withScheme : "";
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Falta STRIPE_SECRET_KEY en variables de entorno" },
        { status: 500 }
      );
    }

    const { items } = await request.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No hay productos para procesar" },
        { status: 400 }
      );
    }

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host");

    const requestOrigin = forwardedHost
      ? `${forwardedProto ?? "http"}://${forwardedHost}`
      : request.nextUrl.origin;

    const envAppUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL || "");
    const normalizedRequestOrigin = normalizeBaseUrl(requestOrigin);
    const appUrl = envAppUrl || normalizedRequestOrigin;

    if (!appUrl) {
      return NextResponse.json(
        { error: "No se pudo resolver una URL base válida para Stripe" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (rawItem: CheckoutItem) => {
        const itemName = String(rawItem.name || "Producto");
        const unitAmount = Math.max(0, Math.round(Number(rawItem.price) * 100));
        const quantity = Math.max(1, Math.floor(Number(rawItem.quantity)));
        const images =
          rawItem.image && isValidHttpUrl(rawItem.image)
            ? [rawItem.image]
            : undefined;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: itemName,
              ...(images ? { images } : {}),
            },
            unit_amount: unitAmount,
          },
          quantity,
        };
      }
    );

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
      { error: error?.message || "Error interno al crear la sesión de Stripe" },
      { status: 500 }
    );
  }
}