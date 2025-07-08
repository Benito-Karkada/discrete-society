"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = any;

function getAllColors(product: any): string[] {
  if (!product?.variants?.edges) return [];
  return Array.from(
    new Set(
      product.variants.edges.flatMap((v: any) =>
        (v.node.selectedOptions || [])
          .filter(
            (opt: any) =>
              opt?.name?.trim().toLowerCase() === "color" &&
              typeof opt.value === "string"
          )
          .map((opt: any) => opt.value as string)
      )
    )
  );
}

function getAllSizes(product: any): string[] {
  if (!product?.variants?.edges) return [];
  return Array.from(
    new Set(
      product.variants.edges.flatMap((v: any) =>
        (v.node.selectedOptions || [])
          .filter(
            (opt: any) =>
              opt?.name?.trim().toLowerCase() === "size" &&
              typeof opt.value === "string"
          )
          .map((opt: any) => opt.value as string)
      )
    )
  );
}

function formatPrice(price: string | number) {
  const n = Number(price);
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("");
  const [price, setPrice] = useState(500);
  const [sizes, setSizes] = useState<string[]>([]);
  const [color, setColor] = useState("");

  // dynamic filter options
  const COLOR_OPTIONS = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => getAllColors(p).forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [products]);

  const SIZE_OPTIONS = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => getAllSizes(p).forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [products]);

  // filtered & sorted
const filteredProducts = useMemo(() => {
  // 1) First: filter
  const arr = products.filter((p: any) => {
    // price filter
    const prices = p.variants.edges.map((v: any) =>
      parseFloat(v.node.price.amount)
    );
    const minPrice = Math.min(...prices);
    if (minPrice > price) return false;

    // grab only available variants
    const availableVariants = p.variants.edges.filter(
      (v: any) => v.node.availableForSale
    );

    // build in-stock size list
    const inStockSizes = Array.from(
      new Set(
        availableVariants.flatMap((v: any) =>
          v.node.selectedOptions
            .filter((opt: any) => opt.name === "Size")
            .map((opt: any) => opt.value)
        )
      )
    );

    // build in-stock color list
    const inStockColors = Array.from(
      new Set(
        availableVariants.flatMap((v: any) =>
          v.node.selectedOptions
            .filter((opt: any) => opt.name === "Color")
            .map((opt: any) => opt.value)
        )
      )
    );

    // size filter: if user picked sizes, require at least one inStockSizes match
    if (sizes.length > 0 && !sizes.some((s) => inStockSizes.includes(s))) {
      return false;
    }
    // color filter
    if (color && !inStockColors.includes(color)) return false;

    return true;
  });

  // 2) Then: sort by price
  if (sort === "low") {
    arr.sort(
      (a, b) =>
        Math.min(...a.variants.edges.map((v: any) => +v.node.price.amount)) -
        Math.min(...b.variants.edges.map((v: any) => +v.node.price.amount))
    );
  }
  if (sort === "high") {
    arr.sort(
      (a, b) =>
        Math.min(...b.variants.edges.map((v: any) => +v.node.price.amount)) -
        Math.min(...a.variants.edges.map((v: any) => +v.node.price.amount))
    );
  }

  return arr;
}, [products, price, sizes, color, sort]);

  // UI handlers
  const resetFilters = () => {
    setPrice(500);
    setSizes([]);
    setColor("");
    setSort("");
  };
  const toggleSize = (s: string) =>
    setSizes(curr => curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]);
  const openFilters = () => setShowFilters(true);
  const closeFilters = () => setShowFilters(false);

  return (
    <div>
      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Filters button */}
        <div className="relative">
          <button
            onClick={openFilters}
            className="bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 hover:bg-gray-800 transition"
          >
            Filters
          </button>
          {showFilters && (
            <div className="absolute z-20 mt-2 w-72 bg-black border border-gray-800 rounded shadow-lg p-4 space-y-4 left-0 md:right-0">
              {/* Price */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Price (up to)</label>
                <input
                  type="range"
                  min={10}
                  max={500}
                  value={price}
                  onChange={e => setPrice(+e.target.value)}
                  className="w-full"
                />
                <span className="text-sm">${price}</span>
              </div>
              {/* Sizes */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {SIZE_OPTIONS.map(s => (
                    <label key={s} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sizes.includes(s)}
                        onChange={() => toggleSize(s)}
                        className="accent-white"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
              {/* Colors */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <select
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                >
                  <option value="">Any</option>
                  {COLOR_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="w-full border border-gray-700 text-gray-400 py-1 rounded hover:bg-gray-800 transition"
              >
                Reset
              </button>
              <button
                onClick={closeFilters}
                className="w-full mt-2 border border-gray-700 text-gray-400 py-1 rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-20">
            No products match your filters.
          </div>
        ) : (
          filteredProducts.map((p: any) => {
            const img = p.images.edges[0]?.node.url;
            const prices = p.variants.edges.map((v: any) => +v.node.price.amount);
            const price = prices.length ? Math.min(...prices) : null;
            // **stock** if any variant is available
            const inStock = p.variants.edges.some((v: any) => v.node.availableForSale);

            return (
              <Link key={p.handle} href={`/shop/${p.handle}`} className="block">
                <div className="relative bg-gray-900 p-4 rounded hover:scale-105 transition duration-300">
                  {!inStock && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                  <div className="aspect-square rounded mb-2 bg-gray-700 flex items-center justify-center">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.title}
                        width={400}
                        height={400}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">NO IMAGE</span>
                    )}
                  </div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-sm text-gray-500">
                    {price !== null ? `$${formatPrice(price)}` : "—"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
