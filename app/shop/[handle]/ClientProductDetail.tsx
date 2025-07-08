"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

type SelectedOption = { name: string; value: string };
type VariantNode = {
  id: string;
  price: { amount: string };
  selectedOptions: SelectedOption[];
  availableForSale: boolean;
};
type Product = {
  title: string;
  description: string;
  images: { edges: { node: { url: string } }[] };
  variants: { edges: { node: VariantNode }[] };
};

export default function ClientProductDetail({ product }: { product: Product }) {
  // flatten data
  const images = product.images.edges.map((e) => e.node.url);
  const variants = product.variants.edges.map((v) => v.node);

  // only saleable variants
  const saleable = useMemo(
    () => variants.filter((v) => v.availableForSale),
    [variants]
  );

  // build master lists
  const colorList = Array.from(
    new Set(
      variants
        .map((v) =>
          v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
            ?.value
        )
        .filter(Boolean)
    )
  ) as string[];

  const sizeList = Array.from(
    new Set(
      variants
        .map((v) =>
          v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
            ?.value
        )
        .filter(Boolean)
    )
  ) as string[];

  // map color → available sizes
  const availabilityMap = useMemo(() => {
    const m = new Map<string, Set<string>>();
    saleable.forEach((v) => {
      const c = v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
        ?.value!;
      const s = v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
        ?.value!;
      if (!m.has(c)) m.set(c, new Set());
      m.get(c)!.add(s);
    });
    return m;
  }, [saleable]);

  // state
  const [selColor, setSelColor] = useState<string>(colorList[0]);
  const [selSize, setSelSize] = useState<string>(() => {
    const sizes = availabilityMap.get(colorList[0]);
    return sizes ? Array.from(sizes)[0] : sizeList[0];
  });

  // whenever color changes, pick a valid size
  useEffect(() => {
    const sizes = availabilityMap.get(selColor);
    if (!sizes || !sizes.has(selSize)) {
      setSelSize(sizes ? Array.from(sizes)[0] : sizeList[0]);
    }
  }, [selColor]);

  // find current variant
  const selectedVariant = useMemo(
    () =>
      saleable.find(
        (v) =>
          v.selectedOptions.find((o) => o.name.toLowerCase() === "color")
            ?.value === selColor &&
          v.selectedOptions.find((o) => o.name.toLowerCase() === "size")
            ?.value === selSize
      ) || saleable[0] || variants[0],
    [selColor, selSize, saleable]
  );

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* Image */}
      <div className="flex-1">
        <Image
          src={images[0]}
          alt={product.title}
          width={500}
          height={500}
          className="rounded bg-gray-800"
        />
      </div>

      {/* Controls */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <p className="mb-6 text-gray-400">{product.description}</p>

        {/* Color */}
        <div className="mb-4">
          <label className="block mb-1">Color</label>
          <select
            value={selColor}
            onChange={(e) => setSelColor(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white"
          >
            {colorList.map((c) => (
              <option key={c} value={c} disabled={!availabilityMap.get(c)?.size}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="mb-4">
          <label className="block mb-1">Size</label>
          <select
            value={selSize}
            onChange={(e) => setSelSize(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white"
          >
            {sizeList.map((s) => (
              <option
                key={s}
                value={s}
                disabled={!availabilityMap.get(selColor)?.has(s)}
              >
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4 text-xl font-semibold">
          ${parseFloat(selectedVariant.price.amount).toFixed(2)}
        </div>

        {/* Add to Cart */}
        <AddToCartButton
          variantId={selectedVariant.id}
          title={product.title}
          handle={(product as any).handle} 
          price={selectedVariant.price.amount}
          image={images[0]}
          size={selSize}
          color={selColor}
        />
      </div>
    </div>
  );
}