import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royyan IBM AI GRANITE",
  description: "Dibuat oleh Royyan dan AI GRANITE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Hapus style inline yang menyebabkan hydration error */}</head>
      <body>{children}</body>
    </html>
  );
}
