import { getCampaignMasterId } from "@/lib/firebase-storage";

export async function fetchCampaignMasterId(campaignId: string) {
  return await getCampaignMasterId(campaignId);
}
