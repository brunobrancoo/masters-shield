"use client";

import { BaseResourceFormProps } from "./types";
import { SorceryPointsSection } from "../class-resource-sections";
import MetamagicKnownDisplay from "../class-display-sections/metamagic-known-display";
import CreatingSpellSlotsDisplay from "../class-display-sections/creating-spell-slots-display";
import { useEffect, useState } from "react";
import { PointPool } from "@/lib/interfaces/interfaces";

export default function SorcererResourceForm({
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

  const [sorceryPoints, setSorceryPoints] = useState<PointPool>({
    current: classSpecific?.sorcery_points || 0,
    max: classSpecific?.sorcery_points || 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.sorcery_points == null) {
      setValue("sorceryPoints", null);
      setSorceryPoints({
        current: 0,
        max: 0,
      });
    } else {
      setValue("sorceryPoints", {
        current: classSpecific?.sorcery_points || 0,
        max: classSpecific?.sorcery_points || 0,
      });
      setSorceryPoints({
        current: classSpecific?.sorcery_points || 0,
        max: classSpecific?.sorcery_points || 0,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if sorcery points feature exists at this level
  const hasSorceryPoints =
    classSpecific.sorcery_points !== undefined &&
    classSpecific.sorcery_points !== null;

  return (
    <div className="space-y-4">
      {hasSorceryPoints && (
        // from class resource section
        <SorceryPointsSection
          setSorceryPoints={setSorceryPoints}
          sorceryPoints={sorceryPoints}
          onChange={(value) => setValue("sorceryPoints", value)}
        />
      )}

      {classSpecific.metamagic_known !== undefined &&
        classSpecific.metamagic_known !== null && (
          <MetamagicKnownDisplay
            metamagicKnown={classSpecific.metamagic_known}
          />
        )}

      {classSpecific.creating_spell_slots &&
        classSpecific.creating_spell_slots.length > 0 && (
          <CreatingSpellSlotsDisplay
            creatingSpellSlots={classSpecific.creating_spell_slots}
          />
        )}
    </div>
  );
}
