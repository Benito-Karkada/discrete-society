"use client";

import Image from "next/image";
import Link from "next/link";

type NewDropsGridProps = {
  products: any[];
  onQuickView?: (p: any) => void;
};

export default function NewDropsGrid({ products, onQuickView }: NewDropsGridProps) {
  return (
    <>
      {products.map((p) => (
        <div
          key={p.id}
          className="group relative bg-gray-800 rounded overflow-hidden"
        >
          <Link href={`/shop/${p.handle}`}>
            <Image
              src={p.images.edges[0]?.node.url}
              alt={p.title}
              width={400}
              height={400}
              className="object-contain w-full h-64"
            />
          </Link>
          <div className="p-4">
            <h3 className="font-medium">{p.title}</h3>
            <p className="text-gray-400">${p.variants.edges[0].node.price.amount}</p>
          </div>
          <button
            onClick={() => onQuickView?.(p)}
            className="
              absolute inset-0 flex items-center justify-center
              bg-black bg-opacity-50 text-white opacity-0
              group-hover:opacity-100 transition-opacity
            "
          >
            Quick View
          </button>
        </div>
      ))}
    </>
  );
}
