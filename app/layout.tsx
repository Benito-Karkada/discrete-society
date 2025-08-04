import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ComingSoon from "@/components/ComingSoon";
import LockButton from "@/components/LockButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

async function checkLock() {
  try {
    const res = await fetch("/api/status", { cache: "no-store" });
    if (!res.ok) return true;
    const { locked } = await res.json();
    return locked;
  } catch (e) {
    console.error("checkLock failed:", e);
    return true;
  }
}

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
