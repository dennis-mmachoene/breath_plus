import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Breath+ — Breathing, finally optimized",
    template: "%s · Breath+",
  },
  description:
    "The premium respiration platform trusted by 4.2 billion lungs. Unlimited breathing, priority oxygen, AI-guided inhaling. Because breathing shouldn't be free.",
  keywords: ["breathing", "oxygen subscription", "wellness", "respiration", "premium air", "BreathGPT"],
  openGraph: {
    title: "Breath+ — Breathing, finally optimized",
    description: "The premium respiration platform. Because breathing shouldn't be free.",
    url: siteUrl,
    siteName: "Breath+",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f3" },
    { media: "(prefers-color-scheme: dark)", color: "#181d19" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
