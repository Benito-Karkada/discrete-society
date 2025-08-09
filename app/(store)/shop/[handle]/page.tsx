import React from "react";
import { fetchShopifyProductByHandle } from "@/lib/shopify";
import ClientProductDetail from "./ClientProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await fetchShopifyProductByHandle(handle);

  if (!product) {
    return (
      <div className="p-12 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 text-white">
      <ClientProductDetail product={product} />
    </main>
  );
}