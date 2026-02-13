"use client";

import { use } from "react";
import { CampaignProvider } from "@/lib/campaign-context";

export default function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ campaignId: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <CampaignProvider campaignId={resolvedParams.campaignId}>
      {children}
    </CampaignProvider>
  );
}
