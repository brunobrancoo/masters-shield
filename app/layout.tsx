import type React from "react";
import type { Metadata } from "next";
import { Cinzel_Decorative, Merriweather, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { GameProvider } from "./contexts/game-context";

const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Escudo do Mestre Digital | Ferramenta de RPG",
  description:
    "Gerencie suas campanhas de RPG com praticidade: monstros, jogadores e NPCs em uma interface medieval imersiva",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <GameProvider>
        <body
          className={`${cinzelDecorative.variable} ${merriweather.variable} ${geistMono.variable} font-serif antialiased`}
        >
          <Header />
          {children}
        </body>
      </GameProvider>
    </html>
  );
}
