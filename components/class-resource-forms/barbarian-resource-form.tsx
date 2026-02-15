"use client";

import { BaseResourceFormProps } from "./types";
import { RageSection } from "../class-resource-sections";
import BrutalCriticalDisplay from "../class-display-sections/brutal-critical-display";
import RageDamageBonusDisplay from "../class-display-sections/rage-damage-bonus-display";
import UnarmoredMovementDisplay from "../class-display-sections/unarmored-movement-display";
import { useEffect, useState } from "react";
import { PointPool } from "@/lib/schemas";

export default function BarbarianResourceForm({
  control,
  setValue,
  classData,
  level,
}: BaseResourceFormProps) {
  const levelNum = typeof level === "string" ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find(
    (l: any) => l.level === levelNum,
  );
  const classSpecific = levelData?.class_specific;

  // FIX: Updated structure to { current, max }
  const [rages, setRages] = useState<PointPool>({
    current: classSpecific?.rage_count || 0,
    max: classSpecific?.rage_count || 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.rage_count == null) {
      setValue("rages", undefined);
      setRages({ current: 0, max: 0 });
    } else {
      const apiValue = classSpecific.rage_count;
      const newValue: PointPool = {
        current: apiValue,
        max: apiValue,
      };

      setValue("rages", newValue);
      setRages(newValue);
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  const hasRage =
    classSpecific.rage_count !== undefined && classSpecific.rage_count !== null;

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
        <BrutalCriticalDisplay
          brutalCriticalDice={classSpecific.brutal_critical_dice}
        />
      )}

      {classSpecific.rage_damage_bonus !== undefined &&
        classSpecific.rage_damage_bonus !== null && (
          <RageDamageBonusDisplay
            rageDamageBonus={classSpecific.rage_damage_bonus}
          />
        )}

      {classSpecific.unarmored_movement !== undefined &&
        classSpecific.unarmored_movement !== null && (
          <UnarmoredMovementDisplay
            unarmoredMovement={classSpecific.unarmored_movement}
          />
        )}
    </div>
  );
}
