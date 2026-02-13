"use client";

import { BaseResourceFormProps } from "./types";
import { RageSection } from "../class-resource-sections";
import BrutalCriticalDisplay from "../class-display-sections/brutal-critical-display";
import RageDamageBonusDisplay from "../class-display-sections/rage-damage-bonus-display";
import UnarmoredMovementDisplay from "../class-display-sections/unarmored-movement-display";
import { useEffect, useState } from "react";

export default function BarbarianResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  const [rages, setRages] = useState<{
    rages: number;
    rages_max: number;
  }>({
    rages: classSpecific?.rage_count || 0,
    rages_max: classSpecific?.rage_count || 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.rage_count == null) {
      setValue("rages", null);
      setRages({
        rages: 0,
        rages_max: 0,
      });
    } else {
      setValue("rages", {
        rages: classSpecific?.rage_count || 0,
        rages_max: classSpecific?.rage_count || 0,
      });
      setRages({
        rages: classSpecific?.rage_count || 0,
        rages_max: classSpecific?.rage_count || 0,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if rage feature exists at this level
  const hasRage = classSpecific.rage_count !== undefined && classSpecific.rage_count !== null;

  return (
    <div className="space-y-4">
      {hasRage && (
        <RageSection
          setRages={setRages}
          rages={rages}
          onChange={(value) => setValue("rages", value)}
        />
      )}

      {classSpecific.brutal_critical_dice && (
        <BrutalCriticalDisplay brutalCriticalDice={classSpecific.brutal_critical_dice} />
      )}

      {classSpecific.rage_damage_bonus !== undefined && classSpecific.rage_damage_bonus !== null && (
        <RageDamageBonusDisplay rageDamageBonus={classSpecific.rage_damage_bonus} />
      )}

      {classSpecific.unarmored_movement !== undefined && classSpecific.unarmored_movement !== null && (
        <UnarmoredMovementDisplay unarmoredMovement={classSpecific.unarmored_movement} />
      )}
    </div>
  );
}
