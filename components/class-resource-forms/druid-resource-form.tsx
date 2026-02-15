"use client";

import { BaseResourceFormProps } from "./types";
import WildShapeDisplay from "../class-display-sections/wild-shape-display";

export default function DruidResourceForm({
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

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if wild shape feature exists at this level
  const hasWildShape =
    classSpecific.wild_shape_max_cr !== undefined &&
    classSpecific.wild_shape_max_cr !== null;

  return (
    <div className="space-y-4">
      {hasWildShape && (
        <>
          <WildShapeDisplay
            wildShapeMaxCR={classSpecific.wild_shape_max_cr}
            wildShapeFly={classSpecific.wild_shape_fly}
            wildShapeSwim={classSpecific.wild_shape_swim}
          />
        </>
      )}
    </div>
  );
}
