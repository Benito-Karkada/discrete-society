import { fetchShopifyProductByHandle } from "@/lib/shopify";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

function formatPrice(price: string | number) {
  const n = Number(price);
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchShopifyProductByHandle(params.handle);
  if (!product) return <div className="p-12 text-center text-gray-500">Product not found.</div>;

  const images = product.images.edges.map((e: any) => e.node.url);
  const variants = (product.variants.edges.map((v: any) => v.node) as any[]);

  // Build fully-typed option lists:
  type Opt = { value: string; inStock: boolean };

  const colorMap = new Map<string, boolean>();
  variants.forEach(v => {
    const opt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === "color");
    if (opt && typeof opt.value === "string") {
      // OR together availability in case multiple variants share the same color
      colorMap.set(opt.value, (colorMap.get(opt.value) || false) || v.availableForSale);
    }
  });
  const colorOptions: Opt[] = Array.from(colorMap.entries()).map(([value, inStock]) => ({ value, inStock }));

  const sizeMap = new Map<string, boolean>();
  variants.forEach(v => {
    const opt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === "size");
    if (opt && typeof opt.value === "string") {
      sizeMap.set(opt.value, (sizeMap.get(opt.value) || false) || v.availableForSale);
    }
  });
  const sizeOptions: Opt[] = Array.from(sizeMap.entries()).map(([value, inStock]) => ({ value, inStock }));

  // Just pick a default variant for the AddToCartButton
  const defaultVariant = variants[0];

  return (
    <main className="max-w-4xl mx-auto py-12 text-white">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <Image
            src={images[0]}
            alt={product.title}
            width={500}
            height={500}
            className="rounded bg-gray-800"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="mb-6 text-gray-400">{product.description}</p>

          {/* COLOR SELECT */}
          <div className="mb-4">
            <label className="block mb-1">Color</label>
            <select className="w-full p-2 border rounded">
              {colorOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(Out of Stock)"}
                </option>
              ))}
            </select>
          </div>

          {/* SIZE SELECT */}
          <div className="mb-4">
            <label className="block mb-1">Size</label>
            <select className="w-full p-2 border rounded">
              {sizeOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(Out of Stock)"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 text-xl font-semibold">
            ${formatPrice(defaultVariant.price.amount)}
          </div>

          <AddToCartButton
            variantId={defaultVariant.id}
            title={product.title}
            handle={params.handle}
            price={defaultVariant.price.amount}
            image={images[0]}
            size={
              defaultVariant.selectedOptions.find((o: any) =>
                o.name.toLowerCase() === "size"
              )?.value || ""
            }
            color={
              defaultVariant.selectedOptions.find((o: any) =>
                o.name.toLowerCase() === "color"
              )?.value || ""
            }
          />
        </div>
      </div>
    </main>
  );
}