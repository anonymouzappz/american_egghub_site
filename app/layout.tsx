import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://americanegghub.us";
const ogImage = "/assets/images/og-american_egghub.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8e8",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "American EggHub | Fresh Local Eggs in Southwest Florida",
    template: "%s | American EggHub",
  },

  description:
    "American EggHub is launching first in Southwest Florida to help buyers find fresh local eggs and help farms, homesteads, and backyard egg sellers reach nearby customers.",

  keywords: [
    "American EggHub",
    "fresh local eggs",
    "Southwest Florida eggs",
    "Fort Myers eggs",
    "Cape Coral eggs",
    "Naples eggs",
    "Labelle eggs",
    "Lehigh Acres eggs",
    "Punta Gorda eggs",
    "farm fresh eggs Florida",
    "backyard egg sellers",
    "local egg marketplace",
    "buy eggs near me",
    "sell eggs online",
  ],

  authors: [{ name: "American EggHub" }],
  creator: "American EggHub",
  publisher: "American EggHub",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "American EggHub",
    title: "American EggHub | Fresh Local Eggs in Southwest Florida",
    description:
      "Join the waitlist for American EggHub, launching first in Southwest Florida for buyers and local egg sellers.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "American EggHub - Fresh Local Eggs in Southwest Florida",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "American EggHub | Fresh Local Eggs in Southwest Florida",
    description:
      "Find fresh local eggs and connect with farms, homesteads, and backyard sellers in Southwest Florida.",
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#fff8e8] text-[#1f241d]">
        {children}
      </body>
    </html>
  );
}