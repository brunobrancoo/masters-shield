"use client";

import { BaseResourceFormProps } from "./types";
import ArcaneRecoveryLevelsDisplay from "../class-display-sections/arcane-recovery-levels-display";

export default function WizardResourceForm({ control, setValue, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  return (
    <div className="space-y-4">
      {classSpecific.arcane_recovery_levels !== undefined && classSpecific.arcane_recovery_levels !== null && (
        <ArcaneRecoveryLevelsDisplay arcaneRecoveryLevels={classSpecific.arcane_recovery_levels} />
      )}
    </div>
  );
}
