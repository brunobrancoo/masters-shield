import type React from "react";
import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "../globals.css";
import { PlayerHeader } from "@/components/player-header";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { PlayerProviders } from "./player-providers";

const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const caveat = Caveat({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-handwritten",
});

export const metadata: Metadata = {
  title: "Ficha do Jogador | Escudo do Mestre Digital",
  description: "Visualize e edite sua ficha de personagem de D&D 5e com praticidade",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function PlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <PlayerProviders>
        <main className="min-h-screen">
          <PlayerHeader />
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </PlayerProviders>
    </ReactQueryProvider>
  );
}
