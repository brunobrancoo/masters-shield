"use client";

import { BaseResourceFormProps } from "./types";
import { InspirationSection } from "../class-resource-sections";
import BardicInspirationDieDisplay from "../class-display-sections/bardic-inspiration-die-display";
import SongOfRestDieDisplay from "../class-display-sections/song-of-rest-die-display";
import MagicalSecretsDisplay from "../class-display-sections/magical-secrets-display";
import { useEffect, useState } from "react";

export default function BardResourceForm({ register, setValue, watch, classData, level }: BaseResourceFormProps) {
  // Handle both string and number level types
  const levelNum = typeof level === 'string' ? parseInt(level, 10) : level;
  const levelData = classData?.class?.class_levels?.find((l: any) => l.level === levelNum);
  const classSpecific = levelData?.class_specific;

  const [inspiration, setInspiration] = useState<{
    inspiration: number;
    inspiration_max: number;
  }>({
    inspiration: classSpecific?.bardic_inspiration_die ? 1 : 0,
    inspiration_max: classSpecific?.bardic_inspiration_die ? 1 : 0,
  });

  // Reset to API values when class or level changes
  useEffect(() => {
    if (classSpecific?.bardic_inspiration_die == null) {
      setValue("inspiration", null);
      setInspiration({
        inspiration: 0,
        inspiration_max: 0,
      });
    } else {
      setValue("inspiration", {
        inspiration: 1,
        inspiration_max: 1,
      });
      setInspiration({
        inspiration: 1,
        inspiration_max: 1,
      });
    }
  }, [classSpecific, level, setValue]);

  // Don't return null - let display components handle missing data
  if (!classSpecific) return <div className="space-y-4"></div>;

  // Check if bardic inspiration feature exists at this level
  const hasBardicInspiration = classSpecific.bardic_inspiration_die !== undefined && classSpecific.bardic_inspiration_die !== null;

  return (
    <div className="space-y-4">
      {hasBardicInspiration && (
        <>
          <InspirationSection
            setInspiration={setInspiration}
            inspiration={inspiration}
            onChange={(value) => setValue("inspiration", value)}
          />
          <BardicInspirationDieDisplay bardicInspirationDie={classSpecific.bardic_inspiration_die} />
        </>
      )}

      {classSpecific.song_of_rest_die !== undefined && classSpecific.song_of_rest_die !== null && (
        <SongOfRestDieDisplay songOfRestDie={classSpecific.song_of_rest_die} />
      )}

      {classSpecific.magical_secrets_max_5 !== undefined && classSpecific.magical_secrets_max_5 !== null && (
        <MagicalSecretsDisplay
          magicalSecretsMax5={classSpecific.magical_secrets_max_5}
          magicalSecretsMax7={classSpecific.magical_secrets_max_7}
          magicalSecretsMax9={classSpecific.magical_secrets_max_9}
        />
      )}
    </div>
  );
}
