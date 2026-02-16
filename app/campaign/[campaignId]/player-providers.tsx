"use client";

import { ReactNode } from "react";
import { use } from "react";
import { GameProvider } from "@/app/_contexts/game-context";
import { PlayerHeader } from "@/components/player-header";
import { ReactQueryProvider } from "@/components/react-query-provider";

export function PlayerProviders({
  children,
  campaignId,
}: {
  children: ReactNode;
  campaignId: string;
}) {
  return (
    <ReactQueryProvider>
      <GameProvider campaignId={campaignId}>
        <main className="min-h-screen">
          {<PlayerHeader />}
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </GameProvider>
    </ReactQueryProvider>
  );
}
