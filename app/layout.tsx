import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discrete Society",
  description: "Underground streetwear brand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
