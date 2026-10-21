import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";
import { WelcomeTour } from "@/components/layout/WelcomeTour";
import { dance } from "@/lib/copy";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
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
      className={`${archivo.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <DemoBanner />
          <Header />
          {children}
          <Footer />
          <WelcomeTour />
        </Providers>
      </body>
    </html>
  );
}
