import type React from "react";
import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ReactQueryProvider } from "@/components/react-query-provider";
import { MasterProviders } from "./master-providers";

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
    <ReactQueryProvider>
      <MasterProviders>
        <SidebarProvider>
          {/* Shell: on lg+ it becomes a two-column flex (sidebar + main) */}
          <div className="min-h-screen lg:flex lg:items-stretch lg:flex-row-reverse">
            <AppSidebar />

            <main className="flex-1 min-h-screen min-w-0">
              <Header />
              <div className="p-4 lg:p-6">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </MasterProviders>
    </ReactQueryProvider>
  );
}
