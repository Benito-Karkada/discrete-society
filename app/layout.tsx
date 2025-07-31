import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import CartDrawer from "components/CartDrawer";
import ComingSoon from "@/components/ComingSoon";
import { useState, useEffect } from "react";
import LockButton from "components/LockButton";  
import { headers } from "next/headers";

async function checkLock() {
  const h = headers();
  const host = (await h).get("host");
  const protocol = process.env.VERCEL ? "https" : "http";
  const res = await fetch(`${protocol}://${host}/api/status`, { cache: "no-store" });
  const data = await res.json();
  return data.locked;
}



export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
