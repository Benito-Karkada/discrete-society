import { fetchShopifyProducts } from "@/lib/shopify";
import ProductGrid from "./ProductGrid";

export default async function Shop() {
  const products = await fetchShopifyProducts();
  return (
    <main className="bg-black text-white min-h-screen px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Shop</h1>
      <ProductGrid products={products} />
    </main>
  );
}
