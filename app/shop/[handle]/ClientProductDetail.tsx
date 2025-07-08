"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

type Variant = {
  id: string;
  price: { amount: string };
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
};
type ShopifyProduct = {
  title: string;
  description: string;
  images: { edges: { node: { url: string } }[] };
  variants: { edges: { node: Variant }[] };
};

function formatPrice(p: string | number) {
  const n = Number(p);
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ClientProductDetail({
  product,
}: {
  product: ShopifyProduct;
}) {
  const images = product.images.edges.map((e) => e.node.url);
  const variants = product.variants.edges.map((v) => v.node);

  // build master lists
  const allColors = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((v) =>
              v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
            )
            .filter(Boolean)
            .map((o) => (o as any).value)
        )
      ),
    [variants]
  ) as string[];

  const allSizes = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((v) =>
              v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
            )
            .filter(Boolean)
            .map((o) => (o as any).value)
        )
      ),
    [variants]
  ) as string[];

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // compute inStock for each color overall
  const colorOptions = useMemo(
    () =>
      allColors.map((color) => {
        const anyInStock = variants.some(
          (v) =>
            v.availableForSale &&
            v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
              ?.value === color
        );
        return { value: color, inStock: anyInStock };
      }),
    [allColors, variants]
  );

  // compute inStock for each size overall
  const sizeOptions = useMemo(
    () =>
      allSizes.map((size) => {
        const anyInStock = variants.some(
          (v) =>
            v.availableForSale &&
            v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
              ?.value === size
        );
        return { value: size, inStock: anyInStock };
      }),
    [allSizes, variants]
  );

  // once a size is picked, refine colors to only those that have that size
  const filteredColorOptions = useMemo(() => {
    if (!selectedSize) return colorOptions;
    return colorOptions.map(({ value }) => {
      const matchVariant = variants.find((v) => {
        const co = v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
          ?.value;
        const sz = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
          ?.value;
        return co === value && sz === selectedSize;
      });
      return { value, inStock: !!matchVariant?.availableForSale };
    });
  }, [colorOptions, variants, selectedSize]);

  // once a color is picked, refine sizes to only those that have that color
  const filteredSizeOptions = useMemo(() => {
    if (!selectedColor) return sizeOptions;
    return sizeOptions.map(({ value }) => {
      const matchVariant = variants.find((v) => {
        const co = v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
          ?.value;
        const sz = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
          ?.value;
        return co === selectedColor && sz === value;
      });
      return { value, inStock: !!matchVariant?.availableForSale };
    });
  }, [sizeOptions, variants, selectedColor]);

  // find the exact variant once both are chosen
  const chosenVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return (
      variants.find((v) => {
        const co = v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
          ?.value;
        const sz = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
          ?.value;
        return co === selectedColor && sz === selectedSize;
      }) || null
    );
  }, [variants, selectedColor, selectedSize]);

  return (
    <main className="max-w-4xl mx-auto py-12 text-white">
      <div className="flex flex-col md:flex-row gap-12">
        {/* LEFT: Image */}
        <div className="flex-1">
          <Image
            src={images[0]}
            alt={product.title}
            width={500}
            height={500}
            className="rounded bg-gray-800"
          />
        </div>

        {/* RIGHT: Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="mb-6 text-gray-400">{product.description}</p>

          {/* Color dropdown */}
          <div className="mb-4">
            <label className="block mb-1">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="">Choose a color</option>
              {filteredColorOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(OOS)"}
                </option>
              ))}
            </select>
          </div>

          {/* Size dropdown */}
          <div className="mb-4">
            <label className="block mb-1">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded bg-black text-white"
            >
              <option value="">Choose a size</option>
              {filteredSizeOptions.map(({ value, inStock }) => (
                <option key={value} value={value} disabled={!inStock}>
                  {value} {inStock ? "" : "(OOS)"}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4 text-xl font-semibold">
            $
            {formatPrice(
              chosenVariant
                ? chosenVariant.price.amount
                : variants[0].price.amount
            )}
          </div>

          {/* Add to Cart */}
          {chosenVariant && chosenVariant.availableForSale ? (
            <AddToCartButton
              variantId={chosenVariant.id}
              title={product.title}
              handle="" // if you need handle, pass it in as a prop
              price={chosenVariant.price.amount}
              image={images[0]}
              size={selectedSize}
              color={selectedColor}
            />
          ) : (
            <button
              disabled
              className="w-full py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
            >
              {selectedColor && selectedSize
                ? "Out of Stock"
                : "Select options"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}