"use client";

import { BaseResourceFormProps } from "./types";
import { ChannelDivinitySection } from "../class-resource-sections";
import DestroyUndeadCRDisplay from "../class-display-sections/destroy-undead-cr-display";
import { useEffect, useState } from "react";

export default function ClericResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  const [channelDivinityCharges, setChannelDivinityCharges] = useState<{
    channelDivinityCharges: number;
    channelDivinityCharges_max: number;
  }>({
    channelDivinityCharges: classSpecific?.channel_divinity_charges || 0,
    channelDivinityCharges_max: classSpecific?.channel_divinity_charges || 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.channel_divinity_charges == null) {
      setValue("channelDivinityCharges", null);
      setChannelDivinityCharges({
        channelDivinityCharges: 0,
        channelDivinityCharges_max: 0,
      });
    } else {
      setValue("channelDivinityCharges", {
        channelDivinityCharges: classSpecific?.channel_divinity_charges || 0,
        channelDivinityCharges_max: classSpecific?.channel_divinity_charges || 0,
      });
      setChannelDivinityCharges({
        channelDivinityCharges: classSpecific?.channel_divinity_charges || 0,
        channelDivinityCharges_max: classSpecific?.channel_divinity_charges || 0,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if channel divinity feature exists at this level
  const hasChannelDivinity = classSpecific.channel_divinity_charges !== undefined && classSpecific.channel_divinity_charges !== null;

  return (
    <div className="space-y-4">
      {hasChannelDivinity && levelNum >= 2 && (
        <ChannelDivinitySection
          setChannelDivinityCharges={setChannelDivinityCharges}
          channelDivinityCharges={channelDivinityCharges}
          onChange={(value) => setValue("channelDivinityCharges", value)}
        />
      )}

      {classSpecific.destroy_undead_cr && (
        <DestroyUndeadCRDisplay destroyUndeadCR={classSpecific.destroy_undead_cr} />
      )}
    </div>
  );
}
