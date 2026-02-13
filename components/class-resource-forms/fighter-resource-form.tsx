"use client";

import { BaseResourceFormProps } from "./types";
import ActionSurgesDisplay from "../class-display-sections/action-surges-display";
import IndomitableUsesDisplay from "../class-display-sections/indomitable-uses-display";
import ExtraAttacksDisplay from "../class-display-sections/extra-attacks-display";

export default function FighterResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  return (
    <div className="space-y-4">
      {classSpecific.action_surges !== undefined && classSpecific.action_surges !== null && (
        <ActionSurgesDisplay actionSurges={classSpecific.action_surges} />
      )}

      {classSpecific.indomitable_uses !== undefined && classSpecific.indomitable_uses !== null && (
        <IndomitableUsesDisplay indomitableUses={classSpecific.indomitable_uses} />
      )}

      {classSpecific.extra_attacks !== undefined && classSpecific.extra_attacks !== null && (
        <ExtraAttacksDisplay extraAttacks={classSpecific.extra_attacks} />
      )}
    </div>
  );
}
