"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameProvider } from "../_contexts/game-context";
import { CombatProvider } from "../_contexts/combat-context";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getCampaignMasterId } from "@/lib/firebase-storage";
import { Loading } from "@/components/loading";

function MasterProvidersInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaignId") || undefined;
  const { user } = useAuth();
  const router = useRouter();

  const { data: masterId, isLoading } = useQuery({
    queryKey: ["fetch-campaign-master-id", campaignId],
    queryFn: () => getCampaignMasterId(campaignId!),
    enabled: !!campaignId,
  });

  const isMaster = !!masterId && user?.uid === masterId;

  // Redirect once we know the user is NOT the master
  useEffect(() => {
    if (!isLoading && masterId && !isMaster) {
      router.replace(`/player?campaignId=${campaignId}`);
    }
  }, [isLoading, masterId, isMaster, campaignId, router]);

  // Show loading while we don't know yet OR while redirecting
  if (isLoading || !isMaster) {
    return <Loading />;
  }

  return (
    <GameProvider campaignId={campaignId}>
      <CombatProvider campaignId={campaignId}>{children}</CombatProvider>
    </GameProvider>
  );
}

export function MasterProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MasterProvidersInner>{children}</MasterProvidersInner>
    </Suspense>
  );
}
