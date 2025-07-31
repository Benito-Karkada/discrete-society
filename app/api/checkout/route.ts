import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("RAW BODY:", body);
  const { items } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No line items provided" }, { status: 400 });
  }

  const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
  const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: items.map((item: any) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };
  
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  console.log("Checkout payload:", JSON.stringify(variables, null, 2));

  const json = await res.json();
  console.log("SHOPIFY RESPONSE:", JSON.stringify(json, null, 2));

  if (
    json.errors ||
    (json.data &&
      json.data.cartCreate &&
      json.data.cartCreate.userErrors.length > 0)
  ) {
    return NextResponse.json(
      { error: json.errors || json.data.cartCreate.userErrors },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: json.data.cartCreate.cart.checkoutUrl });
}
