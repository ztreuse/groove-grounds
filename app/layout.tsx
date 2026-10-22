import type { Metadata } from "next";
import { Anybody, Geist, Geist_Mono } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/layout/Toaster";
import { WelcomeTour } from "@/components/layout/WelcomeTour";
import { dance } from "@/lib/copy";
import "./globals.css";

// Body text.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Small labels: counts, eyebrows, order codes.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display type. The width axis runs from condensed poster caps to wide,
// and the italic gives headings a playful accent.
const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: { default: dance.brand, template: `%s · ${dance.brand}` },
  description: dance.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${anybody.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <DemoBanner />
          <Header />
          {children}
          <Footer />
          <WelcomeTour />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
