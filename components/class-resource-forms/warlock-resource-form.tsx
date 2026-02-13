"use client";

import { BaseResourceFormProps } from "./types";
import InvocationsKnownDisplay from "../class-display-sections/invocations-known-display";
import MysticArcanumDisplay from "../class-display-sections/mystic-arcanum-display";

export default function WarlockResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if mystic arcanum exists at any level
  const hasMysticArcanum =
    (classSpecific.mystic_arcanum_level_6 !== undefined && classSpecific.mystic_arcanum_level_6 !== null) ||
    (classSpecific.mystic_arcanum_level_7 !== undefined && classSpecific.mystic_arcanum_level_7 !== null) ||
    (classSpecific.mystic_arcanum_level_8 !== undefined && classSpecific.mystic_arcanum_level_8 !== null) ||
    (classSpecific.mystic_arcanum_level_9 !== undefined && classSpecific.mystic_arcanum_level_9 !== null);

  return (
    <div className="space-y-4">
      {classSpecific.invocations_known !== undefined && classSpecific.invocations_known !== null && (
        <InvocationsKnownDisplay invocationsKnown={classSpecific.invocations_known} />
      )}

      {hasMysticArcanum && (
        <MysticArcanumDisplay
          mysticArcanumLevel6={classSpecific.mystic_arcanum_level_6}
          mysticArcanumLevel7={classSpecific.mystic_arcanum_level_7}
          mysticArcanumLevel8={classSpecific.mystic_arcanum_level_8}
          mysticArcanumLevel9={classSpecific.mystic_arcanum_level_9}
        />
      )}
    </div>
  );
}
