import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { dance } from "@/lib/copy";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: dance.brand, template: `%s · ${dance.brand}` },
  description: dance.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
