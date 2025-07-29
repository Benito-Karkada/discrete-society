"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NewDropsGrid from "@/components/NewDropsGrid";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [drops, setDrops] = useState<any[]>([]);
  const [quick, setQuick] = useState<any | null>(null);
  const { addToCart } = useCart();

  // — SMS Popup logic
  useEffect(() => {
    if (!localStorage.getItem("ds-popup-dismissed")) {
      setShowPopup(true);
    }
  }, []);

  const dismissPopup = () => {
    localStorage.setItem("ds-popup-dismissed", "true");
    setShowPopup(false);
  };

  // — Fetch “new drops”
  useEffect(() => {
    fetch("/api/drops")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setDrops(data))
      .catch(console.error);
  }, []);

  return (
    <main className="bg-black text-white min-h-screen font-sans flex flex-col overflow-x-hidden">
      <style>{`
        .spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <Image
          src="/logo.png"
          alt="Discrete Society Logo"
          width={300}
          height={300}
          className="mb-6 object-contain spin-slow"
          priority
        />
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          DISCRETE SOCIETY
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          Underground. Exclusive. Yours.
        </p>
        <Link
          href="/shop"
          className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
      </section>

      <div className="flex animate-marquee whitespace-nowrap text-4xl py-2 items-center">
        <div className="flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center mx-4 gap-2">
              <span className="opacity-20">DS</span>
              <span className="opacity-20">·</span>
              <Image src="/logo.png" alt="Logo" width={30} height={30} className="inline-block" />
              <span className="opacity-20">·</span>
            </span>
          ))}
        </div>
        <div className="flex items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center mx-4 gap-2">
              <span className="opacity-20">DS</span>
              <span className="opacity-20">·</span>
              <Image src="/logo.png" alt="Logo" width={30} height={30} className="inline-block" />
              <span className="opacity-20">·</span>
            </span>
          ))}
        </div>
      </div>


      {/* New Drops */}
      <section className="px-8 py-12">
        <h2 className="text-3xl mb-6 font-semibold text-center">New Drops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <NewDropsGrid products={drops} onQuickView={(p) => setQuick(p)} />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="px-8 py-12 text-center max-w-3xl mx-auto">
        <h2 className="text-xl mb-4 font-semibold">More Than Just Clothing</h2>
        <p className="text-gray-400">
          Discrete Society isn’t just apparel — it’s a statement. Born from the
          streets, for those who move differently.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-8 py-4 border-t border-gray-800 text-sm text-gray-600 text-center">
        © {new Date().getFullYear()} Discrete Society. All rights reserved.
        <div className="flex items-center justify-center gap-4 mt-2">
          <a
            href="https://instagram.com/discrete_.society"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/instagram.svg"
              alt="Instagram"
              width={24}
              height={24}
              className="hover:opacity-70 transition"
            />
          </a>
          <a
            href="https://tiktok.com/@66nanaaaa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/tik-tok.png"
              alt="TikTok"
              width={24}
              height={24}
              className="hover:opacity-70 transition"
            />
          </a>
        </div>
      </footer>

      {/* Quick-View Overlay */}
      {quick && quick.images?.edges?.length > 0 && (
        <div
          onClick={() => setQuick(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full"
          >
            <button
              onClick={() => setQuick(null)}
              className="absolute top-2 right-2 text-white text-3xl z-10"
            >
              ×
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quick.images.edges.map((edge: any, idx: number) => (
                <Image
                  key={idx}
                  src={edge.node.url}
                  alt={quick.title}
                  width={600}
                  height={600}
                  className="object-contain bg-gray-800 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SMS Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4">
          <div className="bg-white text-black p-6 rounded max-w-sm w-full relative">
            <button
              onClick={dismissPopup}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>
            <h2 className="text-center text-lg font-bold mb-2">UNLOCK</h2>
            <h1 className="text-center text-3xl font-bold mb-2">10% OFF</h1>
            <p className="text-center mb-4">YOUR ORDER</p>
            <input
              type="text"
              placeholder="Your phone number"
              className="w-full p-2 border rounded mb-2"
            />
            <p className="text-xs text-gray-600 mb-2">
              *By providing your number you agree to receive marketing SMS…
            </p>
            <button
              onClick={dismissPopup}
              className="w-full bg-black text-white py-2 rounded mb-2"
            >
              Sign up now
            </button>
            <button
              onClick={dismissPopup}
              className="w-full text-center text-sm text-gray-500"
            >
              No Thanks
            </button>
          </div>
        </div>
      )}
    </main>
  );
}