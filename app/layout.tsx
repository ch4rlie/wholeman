import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = "https://wholeman.org";
const TITLE = "WholeMan — Presence over performance";
const DESCRIPTION =
  "A recovery mission calling men out of shame, fragmentation, and despair — back into courageous hope, sacred self-love, and full integration. Private coaching with Ccowl and the WholeMan Podcast.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · WholeMan",
  },
  description: DESCRIPTION,
  applicationName: "WholeMan",
  keywords: [
    "WholeMan",
    "Ccowl",
    "men's coaching",
    "men's work",
    "private coaching",
    "masculine integration",
    "presence over performance",
    "WholeMan Podcast",
    "men's recovery",
    "authenticity",
  ],
  authors: [{ name: "Ccowl" }],
  creator: "Ccowl",
  publisher: "WholeMan",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "WholeMan",
    title: TITLE,
    description: "A recovery mission for men. Private coaching + the WholeMan Podcast.",
    images: [{ url: "/photos/hero-colorado.jpg", alt: "WholeMan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "A recovery mission for men. Private coaching + the WholeMan Podcast.",
    images: ["/photos/hero-colorado.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "lifestyle",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-bone antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
