// app/shop/[handle]/page.tsx
import { fetchShopifyProductByHandle } from "@/lib/shopify";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  // unwrap the promise
  const { handle } = await params;
  const product = await fetchShopifyProductByHandle(handle);

  if (!product) {
    return (
      <div className="p-12 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  const images = product.images.edges.map((e: any) => e.node.url);
  const variants = product.variants.edges.map((v: any) => v.node) as any[];

  // Build your color/size options...
  type Opt = { value: string; inStock: boolean };

  const colorMap = new Map<string, boolean>();
  variants.forEach((v) => {
    const opt = v.selectedOptions.find(
      (o: any) => o.name.toLowerCase() === "color"
    );
    if (opt && typeof opt.value === "string") {
      colorMap.set(
        opt.value,
        (colorMap.get(opt.value) || false) || v.availableForSale
      );
    }
  });
  const colorOptions = Array.from(colorMap.entries()).map(
    ([value, inStock]) => ({ value, inStock })
  );

  const sizeMap = new Map<string, boolean>();
  variants.forEach((v) => {
    const opt = v.selectedOptions.find(
      (o: any) => o.name.toLowerCase() === "size"
    );
    if (opt && typeof opt.value === "string") {
      sizeMap.set(
        opt.value,
        (sizeMap.get(opt.value) || false) || v.availableForSale
      );
    }
  });
  const sizeOptions = Array.from(sizeMap.entries()).map(
    ([value, inStock]) => ({ value, inStock })
  );

  // pick first in-stock variant as default
  const defaultVariant =
    variants.find((v) => v.availableForSale) ?? variants[0];

  return (
    <main className="max-w-4xl mx-auto py-12 text-white">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="flex-1">
          <Image
            src={images[0]}
            alt={product.title}
            width={500}
            height={500}
            className="rounded bg-gray-800"
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-400">{product.description}</p>

          {/* Color */}
          <div>
            <label className="block mb-1">Color</label>
            <select className="w-full p-2 border rounded bg-gray-900 text-white">
              {colorOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(Out of Stock)"}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block mb-1">Size</label>
            <select className="w-full p-2 border rounded bg-gray-900 text-white">
              {sizeOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(Out of Stock)"}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="text-xl font-semibold">
            ${Number(defaultVariant.price.amount).toFixed(2)}
          </div>

          {/* Add to Cart */}
          {defaultVariant.availableForSale ? (
            <AddToCartButton
              variantId={defaultVariant.id}
              title={product.title}
              handle={handle}
              price={defaultVariant.price.amount}
              image={images[0]}
              size={
                defaultVariant.selectedOptions.find(
                  (o: any) => o.name.toLowerCase() === "size"
                )?.value || ""
              }
              color={
                defaultVariant.selectedOptions.find(
                  (o: any) => o.name.toLowerCase() === "color"
                )?.value || ""
              }
            />
          ) : (
            <button
              disabled
              className="w-full py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
