import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FITSYNC — Measure Once. Find Your Size Everywhere.",
  description:
    "Stop guessing your size. FITSYNC stores your body measurements once and calculates the perfect fit across Zara, H&M, Uniqlo, Levi's, Nike, and every top brand.",
  keywords: [
    "clothing size finder",
    "size recommendation",
    "fashion tech",
    "body measurement app",
    "Zara size chart",
    "Uniqlo sizing",
    "Levi's jeans fit",
  ],
  openGraph: {
    title: "FITSYNC — Measure Once. Find Your Size Everywhere.",
    description:
      "Stop guessing your size across Zara, H&M, Uniqlo, and Levi's. Accurate size recommendations driven by garment ease and verified size charts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#121212] selection:bg-[#121212] selection:text-[#FAF9F6] font-sans">
        {children}
      </body>
    </html>
  );
}
