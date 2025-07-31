import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext"; 
import CartDrawer from "components/CartDrawer";
import ComingSoon from "../components/ComingSoon"; 
import "./globals.css";

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

const SITE_LOCKED = process.env.NEXT_PUBLIC_SITE_LOCKED === "true";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {SITE_LOCKED ? (
          <ComingSoon />
        ) : (
          <CartProvider>
            <Navbar />
            <CartDrawer />
            {children}
          </CartProvider>
        )}
      </body>
    </html>
  );
}
