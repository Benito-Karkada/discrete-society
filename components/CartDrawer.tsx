"use client";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, cartOpen, toggleCartOpen, removeFromCart, updateQty, clearCart } = useCart();

  if (!cartOpen) return null;

  const subtotal = cart.reduce((sum: number, item: any) =>
    sum + Number(item.price) * item.quantity, 0
  );

  return (
  <>
    {/* overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={toggleCartOpen}
    />

    {/* drawer */}
    <div className="fixed top-0 right-0 w-96 h-full bg-black text-white z-50 shadow-2xl flex flex-col p-6">
      <button className="self-end mb-4" onClick={toggleCartOpen}>Close</button>
      <h2 className="text-2xl mb-4">Your Cart</h2>

      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          cart.map((item: any) => (
            <div key={item.variantId} className="mb-4 border-b border-gray-700 pb-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain bg-gray-800 rounded" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-400">
                    Size: {item.size} Color: {item.color}
                  </div>
                  <div className="text-sm">
                    ${Number(item.price).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(item.variantId, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.variantId, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    className="mt-1 text-xs text-red-500"
                    onClick={() => removeFromCart(item.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 border-t border-gray-800 pt-4">
        <div className="flex justify-between mb-4">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <button
          onClick={cart.length > 0 ? async () => {
            try {
              const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: cart.map((item: any) => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                  })),
                }),
              });
              if (!res.ok) throw new Error("Checkout failed");
              const { url, error } = await res.json();
              if (error) throw new Error(error);
              window.location.href = url;
            } catch (err) {
              alert("Checkout failed: " + err);
            }
          } : undefined}
          disabled={cart.length === 0}
          className={`
            w-full py-2 rounded font-semibold
            ${cart.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"}
          `}
        >
          {cart.length === 0 ? "Your Cart Is Empty" : "Checkout"}
        </button>


        <button
          className="w-full py-2 mt-2 bg-gray-800 border border-gray-600 rounded text-gray-300"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  </>
)};