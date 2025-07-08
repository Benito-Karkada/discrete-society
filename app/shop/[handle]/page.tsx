import { fetchShopifyProductByHandle } from "@/lib/shopify";
import ClientProductDetail from "./ClientProductDetail";

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchShopifyProductByHandle(params.handle);
  if (!product) {
    return <div className="p-12 text-center text-gray-500">Product not found.</div>;
  }
  return <ClientProductDetail product={product} />;
}