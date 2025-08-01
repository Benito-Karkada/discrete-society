import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import CartDrawer from "components/CartDrawer";
import ComingSoon from "@/components/ComingSoon";
import LockButton from "components/LockButton";

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

async function checkLock() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/status`, { cache: "no-store" });
  const data = await res.json();
  return data.locked;
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
