import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wholeman.org"),
  title: "WholeMan — Presence over performance",
  description:
    "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration. Private coaching and the WholeMan Podcast.",
  openGraph: {
    title: "WholeMan — Presence over performance",
    description: "A recovery mission for men. Private coaching + the WholeMan Podcast.",
    url: "https://wholeman.org",
    siteName: "WholeMan",
    images: [{ url: "/photos/ty-hero.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
