import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ComingSoon from "@/components/ComingSoon";
import LockButton from "@/components/LockButton";
import "./globals.css";

async function checkLock() {
  // Always hit your own API route
  const res = await fetch("/api/status", {
    cache: "no-store",
  });
  if (!res.ok) {
    // if the API errors, default to locked
    return true;
  }
  const { locked } = await res.json();
  return locked;
}

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locked = await checkLock();

  return (
    <html lang="en">
      <body>
        {locked ? (
          <ComingSoon />
        ) : (
          <CartProvider>
            <Navbar />
            <CartDrawer />
            {children}
            <LockButton />
          </CartProvider>
        )}
      </body>
    </html>
  );
}
