"use client";

import { useClass } from "@/lib/api/hooks";
import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons";

interface PlayerClassFeaturesSectionProps {
  playableCharacter: PlayableCharacter;
}

export default function PlayerClassFeaturesSection({
  playableCharacter,
}: PlayerClassFeaturesSectionProps) {
  const { data: classData } = useClass(playableCharacter.classIndex);
  const selectedClass = classData?.class;

  if (!selectedClass || !selectedClass.class_levels) {
    return null;
  }

  // Get cumulative features up to current level
  const cumulativeFeatures: any[] = [];
  for (let lvl = 1; lvl <= playableCharacter.level; lvl++) {
    const levelData = selectedClass.class_levels.find(
      (l: any) => l.level === lvl,
    );
    if (levelData?.features) {
      cumulativeFeatures.push(...levelData.features);
    }
  }

  if (cumulativeFeatures.length === 0) {
    return null;
  }

  // Separate class features from subclass features if subclass exists
  const classOnlyFeatures = cumulativeFeatures.filter((f: any) => {
    // If no subclass selected, show all
    if (!playableCharacter.subclassIndex) return true;
    // Otherwise filter based on feature index
    return !f.index.includes(playableCharacter.subclassIndex);
  });

  const subclassFeatures = playableCharacter.subclassIndex
    ? cumulativeFeatures.filter((f: any) =>
        f.index.includes(playableCharacter.subclassIndex),
      )
    : [];

  const subclass = selectedClass.subclasses?.find(
    (s: any) => s.index === playableCharacter.subclassIndex,
  );

  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <ShieldIcon className="w-6 h-6 text-martial-500" />
          Características de {selectedClass.name}
          {subclass && (
            <span className="text-muted-foreground text-lg">
              {" "}
              - {subclass.name}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Base Class Features */}
        {classOnlyFeatures.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-bold text-martial-500 text-sm uppercase tracking-wide">
              Características da Classe
            </h4>
            {classOnlyFeatures.map((feature: any) => (
              <div key={feature.index} className="bg-card/50 p-4 rounded">
                <h4 className="font-bold text-martial-500 mb-2">
                  {feature.name}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {Array.isArray(feature.desc) ? (
                    feature.desc.map((paragraph: string, idx: number) => (
                      <p key={idx} className="mb-2">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{feature.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subclass Features */}
        {subclassFeatures.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <h4 className="font-bold text-nature-500 text-sm uppercase tracking-wide">
              Características da Subclasse - {subclass?.name}
            </h4>
            {subclassFeatures.map((feature: any) => (
              <div
                key={feature.index}
                className="bg-card/50 p-4 rounded border-l-4 border-nature-500"
              >
                <h4 className="font-bold text-nature-500 mb-2">
                  {feature.name}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {Array.isArray(feature.desc) ? (
                    feature.desc.map((paragraph: string, idx: number) => (
                      <p key={idx} className="mb-2">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p>{feature.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Class Details */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Dado de Vida: </span>d
            {selectedClass.hit_die}
          </div>
          <div>
            <span className="font-medium">Nível: </span>
            {playableCharacter.level}
          </div>
          {selectedClass.saving_throws &&
            selectedClass.saving_throws.length > 0 && (
              <div className="col-span-2">
                <span className="font-medium">Salvaguardas: </span>
                {selectedClass.saving_throws
                  .map((st: any) => st.name)
                  .join(", ")}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
