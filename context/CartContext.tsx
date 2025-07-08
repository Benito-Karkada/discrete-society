"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  variantId: string;
  title: string;
  handle: string;
  price: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  toggleCartOpen: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // --- modal logic ---
  const toggleCartOpen = () => setCartOpen((prev) => !prev);
  const closeCart = () => setCartOpen(false);

  // --- persist cart ---
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- cart functions ---
  const addToCart = (item: CartItem) => {
    setCart((curr) => {
      const existing = curr.find(
        (it) =>
          it.variantId === item.variantId &&
          it.size === item.size &&
          it.color === item.color
      );
      if (existing)
        return curr.map((it) =>
          it.variantId === item.variantId &&
          it.size === item.size &&
          it.color === item.color
            ? { ...it, quantity: it.quantity + item.quantity }
            : it
        );
      return [...curr, item];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((curr) => curr.filter((it) => it.variantId !== variantId));
  };

  const updateQty = (variantId: string, qty: number) => {
    setCart((curr) =>
      curr.map((it) =>
        it.variantId === variantId ? { ...it, quantity: qty } : it
      )
    );
  };

  const clearCart = () => setCart([]);

  // --- PROVIDER ---
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartOpen,
        toggleCartOpen,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
