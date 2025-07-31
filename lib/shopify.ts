const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function fetchNewDrops() {
  const query = `
    {
      collectionByHandle(handle: "new-drops") {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) { 
                edges { node { url } } 
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch new drops");
  const { data } = await res.json();
  // if your handle is wrong or Shopify returns null, bail to []
  const collection = data.collectionByHandle;
  if (!collection) return [];
  return collection.products.edges.map((e: any) => e.node);
}

// Fetch ALL products (for the grid)
export async function fetchShopifyProducts() {
  const query = `
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) { edges { node { url } } }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  availableForSale
                  selectedOptions { name value }
                }
              }
            }
          }
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
    body: JSON.stringify({ query }),
    next: { revalidate: 60 }
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data.products.edges.map((edge: any) => edge.node);
}

// Fetch ONE product by handle (for the detail page)
export async function fetchShopifyProductByHandle(handle: string) {
  const query = `
    {
      productByHandle(handle: "${handle}") {
        id
        title
        description
        images(first: 5) { edges { node { url } } }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              selectedOptions { name value }
              availableForSale
            }
          }
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
    body: JSON.stringify({ query }),
    next: { revalidate: 60 }
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data.productByHandle;
}

export async function createShopifyCheckout(lineItems: { variantId: string, quantity: number }[]) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
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
      lineItems: lineItems.map((item: any)=> ({
        variantId: item.variantId,
        quantity: item.quantity
      })),
    },
  };

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  // Print raw response
  let text = await res.text();
  try {
    const json = JSON.parse(text);
    console.log("RAW SHOPIFY CHECKOUT RESPONSE:", JSON.stringify(json, null, 2));
    if (!json.data || !json.data.checkoutCreate) {
      throw new Error("checkoutCreate missing in response");
    }
    const checkout = json.data.checkoutCreate.checkout;
    const errors = json.data.checkoutCreate.userErrors;
    if (errors && errors.length > 0) throw new Error(errors.map((e: any) => e.message).join(", "));
    return checkout.webUrl;
  } catch (e) {
    console.error("Shopify response parse error:", text);
    throw new Error("Failed to parse Shopify response: " + e);
  }
}


