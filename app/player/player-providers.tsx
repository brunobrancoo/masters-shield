"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GameProvider } from "../_contexts/game-context";

function PlayerProvidersInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") || undefined;

  return (
    <GameProvider campaignId={campaignId}>
      {children}
    </GameProvider>
  );
}

export function PlayerProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PlayerProvidersInner>{children}</PlayerProvidersInner>
    </Suspense>
  );
}
