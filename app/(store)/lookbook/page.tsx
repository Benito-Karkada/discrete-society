"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Lookbook() {
  const images = [
    "/lookbook/look1.jpg",
    "/lookbook/look2.jpg",
    "/lookbook/look3.jpg",
    "/lookbook/look4.jpg",
    "/lookbook/look5.jpg",
    "/lookbook/look6.jpg",
    "/lookbook/look7.jpg",
    "/lookbook/look8.jpg"
  ];

  // Add fade/scale animation when images scroll into view
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "scale-100");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="section-light min-h-screen px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Lookbook</h1>
      <p className="text-center mb-10 max-w-2xl mx-auto text-gray-700">
        See how Discrete Society pieces look on different people and styles.
      </p>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-lg shadow-lg overflow-hidden transform transition duration-700 opacity-0 scale-95 fade-in"
          >
            <Image
              src={src}
              alt={`Look ${i + 1}`}
              width={800}
              height={1200}
              className="w-full h-auto block"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
