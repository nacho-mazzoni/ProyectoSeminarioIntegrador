import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PublicChrome } from "@/components/layout/PublicChrome";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Rumba Habana",
  description: "Rumba Habana — Helados artesanales, pedí online",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${playfair.variable} ${montserrat.variable}`}>
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col"><PublicChrome>{children}</PublicChrome></div>
        </Providers>
      </body>
    </html>
  );
}
