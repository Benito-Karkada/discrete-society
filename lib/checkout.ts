const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

export async function createShopifyCheckout(cart: any[]) {
  const lineItems = cart.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  // Shopify Storefront API mutation
  const query = `
    mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
      checkoutCreate(input: { lineItems: $lineItems }) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables: { lineItems } }),
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data.checkoutCreate.checkout.webUrl;
}