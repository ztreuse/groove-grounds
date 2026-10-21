import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/layout/Toaster";
import { WelcomeTour } from "@/components/layout/WelcomeTour";
import { dance } from "@/lib/copy";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
      className={`${archivo.variable} ${bricolage.variable} h-full antialiased`}
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
