import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import CartDrawer from "components/CartDrawer";
import ComingSoon from "@/components/ComingSoon";
import LockButton from "@/components/LockButton";
import { createClient } from "redis";

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

async function getLockState() {
  const client = createClient({
    url: process.env.REDIS_URL,  // use your Marketplace Redis URL
  });
  await client.connect();

  const locked = await client.get("site-locked");
  await client.disconnect();

  return locked === "true";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locked = await getLockState();

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
