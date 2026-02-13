"use client";

import { BaseResourceFormProps } from "./types";
import SneakAttackDisplay from "../class-display-sections/sneak-attack-display";

export default function RogueResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  return (
    <div className="space-y-4">
      {classSpecific.sneak_attack && (
        <SneakAttackDisplay sneakAttack={classSpecific.sneak_attack} />
      )}
    </div>
  );
}
