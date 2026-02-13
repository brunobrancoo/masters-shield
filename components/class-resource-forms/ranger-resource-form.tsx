"use client";

import { BaseResourceFormProps } from "./types";
import FavoredEnemiesDisplay from "../class-display-sections/favored-enemies-display";
import FavoredTerrainDisplay from "../class-display-sections/favored-terrain-display";
import ExtraAttacksDisplay from "../class-display-sections/extra-attacks-display";

export default function RangerResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  return (
    <div className="space-y-4">
      {classSpecific.favored_enemies !== undefined && classSpecific.favored_enemies !== null && (
        <FavoredEnemiesDisplay favoredEnemies={classSpecific.favored_enemies} />
      )}

      {classSpecific.favored_terrain !== undefined && classSpecific.favored_terrain !== null && (
        <FavoredTerrainDisplay favoredTerrain={classSpecific.favored_terrain} />
      )}

      {classSpecific.extra_attacks !== undefined && classSpecific.extra_attacks !== null && (
        <ExtraAttacksDisplay extraAttacks={classSpecific.extra_attacks} />
      )}
    </div>
  );
}
