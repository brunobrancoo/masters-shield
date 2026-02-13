"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { getCampaign, type Campaign } from "./firebase-storage";
import { useRouter } from "next/navigation";

interface CampaignContextType {
  campaign: Campaign | null;
  loading: boolean;
  isMaster: boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ 
  children, 
  campaignId,
}: { 
  children: ReactNode;
  campaignId: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    const loadCampaign = async () => {
      try {
        const campaignData = await getCampaign(campaignId);
        if (!campaignData) {
          router.replace("/campaign/select");
          return;
        }

        if (user && !campaignData.members.includes(user.uid)) {
          router.replace("/campaign/select");
          return;
        }

        setCampaign(campaignData);
      } catch (error) {
        console.error("Error loading campaign:", error);
        router.replace("/campaign/select");
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, user, router]);

  const isMaster = campaign?.masterId === user?.uid;

  const value: CampaignContextType = {
    campaign,
    loading,
    isMaster,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}
