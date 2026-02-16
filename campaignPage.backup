"use client";

import { useCampaign } from "@/lib/campaign-context";
import { Loading } from "@/components/loading";
import { use } from "react";
import { MasterView } from "@/components/views/master-view";
import { PlayerView } from "@/components/views/player-view";
import { MasterProviders } from "./master-providers";
import { PlayerProviders } from "./player-providers";

export default function CampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaign, loading, isMaster } = useCampaign();
  const resolvedParams = use(params);

  if (loading) {
    return <Loading />;
  }

  if (!campaign) {
    return null;
  }

  if (isMaster) {
    return (
      <MasterProviders params={params}>
        <MasterView />
      </MasterProviders>
    );
  }

  return (
    <PlayerProviders params={params}>
      <PlayerView campaignId={resolvedParams.campaignId} />
    </PlayerProviders>
  );
}
