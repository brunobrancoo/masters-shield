"use client";

import { BaseResourceFormProps } from "./types";
import { KiPointsSection } from "../class-resource-sections";
import MartialArtsDisplay from "../class-display-sections/martial-arts-display";
import UnarmoredMovementDisplay from "../class-display-sections/unarmored-movement-display";
import { useEffect, useState } from "react";

export default function MonkResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  const [kiPoints, setKiPoints] = useState<{
    kiPoints: number;
    kiPoints_max: number;
  }>({
    kiPoints: classSpecific?.ki_points || 0,
    kiPoints_max: classSpecific?.ki_points || 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.ki_points == null) {
      setValue("kiPoints", null);
      setKiPoints({
        kiPoints: 0,
        kiPoints_max: 0,
      });
    } else {
      setValue("kiPoints", {
        kiPoints: classSpecific?.ki_points || 0,
        kiPoints_max: classSpecific?.ki_points || 0,
      });
      setKiPoints({
        kiPoints: classSpecific?.ki_points || 0,
        kiPoints_max: classSpecific?.ki_points || 0,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if ki points feature exists at this level
  const hasKiPoints = classSpecific.ki_points !== undefined && classSpecific.ki_points !== null;

  return (
    <div className="space-y-4">
      {hasKiPoints && (
        <KiPointsSection
          setKiPoints={setKiPoints}
          kiPoints={kiPoints}
          onChange={(value) => setValue("kiPoints", value)}
        />
      )}

      {classSpecific.martial_arts && (
        <MartialArtsDisplay martialArts={classSpecific.martial_arts} />
      )}
    </div>
  );
}
