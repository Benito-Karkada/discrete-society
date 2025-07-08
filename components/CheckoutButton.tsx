"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CheckoutButton() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
  setLoading(true);
  try {
    console.log("Sending to /api/checkout:", { lineItems: cart });

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }) 
    });
    if (!res.ok) throw new Error("Checkout failed");
    const data = await res.json();
    window.location.href = data.url; 
  } catch (err) {
    alert("Checkout error: " + (err instanceof Error ? err.message : String(err)));
  } finally {
    setLoading(false);
  }
}

  return (
    <button
      className="bg-white text-black px-6 py-3 rounded font-semibold"
      onClick={handleCheckout}
      disabled={cart.length === 0 || loading}
    >
      {loading ? "Redirecting..." : "Checkout"}
    </button>
  );
}