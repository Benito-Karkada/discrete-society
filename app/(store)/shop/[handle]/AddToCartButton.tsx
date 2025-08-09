"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({
  variantId, title, handle, price, image, size, color
}: { variantId: string, title: string, handle: string, price: string, image: string, size: string, color: string }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div>
      <input
        type="number"
        min={1}
        value={qty}
        onChange={e => setQty(Number(e.target.value))}
        className="w-16 p-1 border"
      />
      <button
        className="ml-2 px-4 py-2 bg-white text-black rounded"
        onClick={() => {
          addToCart({
            variantId, title, handle, price, image, color, size, quantity: qty
          });
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
