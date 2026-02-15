"use client";

import { BaseResourceFormProps } from "./types";
import ActionSurgesDisplay from "../class-display-sections/action-surges-display";
import IndomitableUsesDisplay from "../class-display-sections/indomitable-uses-display";
import ExtraAttacksDisplay from "../class-display-sections/extra-attacks-display";
import { useEffect, useState } from "react";
import { PointPool } from "@/lib/schemas";

export default function FighterResourceForm({
  control,
  setValue,
  classData,
  level,
}: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === "string" ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find(
    (l: any) => l.level === levelNum,
  );
  const classSpecific = levelData?.class_specific;
  const [actionSurges, setActionSurges] = useState<PointPool>({
    current: classSpecific?.action_surges ? 1 : 0,
    max: classSpecific?.action_surges ? 1 : 0,
  });
  const [indomitables, setIndomitables] = useState<PointPool>({
    current: classSpecific?.indomitable_uses ? 1 : 0,
    max: classSpecific?.indomitable_uses ? 1 : 0,
  });

  useEffect(() => {
    if (classSpecific?.action_surges == null) {
      setValue("actionSurges", null);
      setActionSurges({
        current: 0,
        max: 0,
      });
    } else {
      setValue("actionSurges", {
        current: classSpecific?.action_surges || 0,
        max: classSpecific?.action_surges || 0,
      });
      setActionSurges({
        current: classSpecific?.action_surges || 0,
        max: classSpecific?.action_surges || 0,
      });
    }
    ///////////
    if (classSpecific?.indomitable_uses == null) {
      setValue("actionSurges", null);
      setIndomitables({
        current: 0,
        max: 0,
      });
    } else {
      setValue("indomitables", {
        current: classSpecific?.indomitable_uses || 0,
        max: classSpecific?.indomitable_uses || 0,
      });
      setActionSurges({
        current: classSpecific?.indomitable_uses || 0,
        max: classSpecific?.indomitable_uses || 0,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;
  console.log("class specific: ", classSpecific);

  return (
    <div className="space-y-4">
      {classSpecific.action_surges !== undefined &&
        classSpecific.action_surges !== null && (
          <ActionSurgesDisplay actionSurges={classSpecific.action_surges} />
        )}

      {classSpecific.indomitable_uses !== undefined &&
        classSpecific.indomitable_uses !== null && (
          <IndomitableUsesDisplay
            indomitableUses={classSpecific.indomitable_uses}
          />
        )}

      {classSpecific.extra_attacks !== undefined &&
        classSpecific.extra_attacks !== null && (
          <ExtraAttacksDisplay extraAttacks={classSpecific.extra_attacks} />
        )}
    </div>
  );
}
