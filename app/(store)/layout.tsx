import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import LockButton from "@/components/LockButton";

// This ensures pages in (store) are never statically cached
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      {children}
      <LockButton />
    </CartProvider>
  );
}
