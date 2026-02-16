"use client";

import { ReactNode } from "react";
import { use } from "react";
import { GameProvider } from "@/app/_contexts/game-context";
import { CombatProvider } from "@/app/_contexts/combat-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import AppSidebar from "@/components/app-sidebar";
import { ReactQueryProvider } from "@/components/react-query-provider";

export function MasterProviders({
  children,
  campaignId,
}: {
  children: ReactNode;
  campaignId: string;
}) {
  return (
    <ReactQueryProvider>
      <GameProvider campaignId={campaignId}>
        <CombatProvider campaignId={campaignId}>
          <SidebarProvider>
            <div className="min-h-screen lg:flex lg:items-stretch lg:flex-row-reverse">
              <AppSidebar />

              <main className="flex-1 min-h-screen min-w-0">
                <Header />
                <div className="p-4 lg:p-6">{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </CombatProvider>
      </GameProvider>
    </ReactQueryProvider>
  );
}
