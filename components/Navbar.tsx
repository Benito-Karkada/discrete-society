"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { cart, toggleCartOpen } = useCart();

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center border-b border-gray-800">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Discrete Society Logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </Link>
      <div className="flex gap-8">
        <Link href="/" className="hover:text-gray-400">
          Home
        </Link>
        <Link href="/shop" className="hover:text-gray-400">
          Shop
        </Link>
        <Link href="/policy" className="hover:text-gray-400">
          Policies
        </Link>
        <Link href="/about" className="hover:text-gray-400">
          About
        </Link>
        <button
          className="relative hover:text-gray-400 active:text-gray-600 transition"
          onClick={toggleCartOpen}
          aria-label="Open cart"
        >
          {/* Badge */}
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[1.3em] h-[1.3em] flex items-center justify-center rounded-full px-1 border-2 border-black z-10">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
