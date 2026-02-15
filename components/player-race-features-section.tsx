"use client";

import { useRace } from "@/lib/api/hooks";
import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@/components/icons";

interface PlayerRaceFeaturesSectionProps {
  playableCharacter: PlayableCharacter;
}

export default function PlayerRaceFeaturesSection({
  playableCharacter,
}: PlayerRaceFeaturesSectionProps) {
  const { data: raceData } = useRace(playableCharacter.raceIndex);
  const race = raceData?.race;

  if (!race || !race.traits || race.traits.length === 0) {
    return null;
  }

  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-arcane-500" />
          Traços de {race.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {race.traits.map((trait: any) => (
            <div key={trait.index} className="bg-card/50 p-4 rounded">
              <h4 className="font-bold text-arcane-500 mb-2">{trait.name}</h4>
              <div className="text-sm text-muted-foreground">
                {Array.isArray(trait.desc) ? (
                  trait.desc.map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-2">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{trait.desc}</p>
                )}
              </div>
              {trait.proficiencies && trait.proficiencies.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Proficiências: </span>
                  {trait.proficiencies.map((p: any) => p.name).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Race Details */}
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Velocidade: </span>
            {race.speed} ft
          </div>
          <div>
            <span className="font-medium">Tamanho: </span>
            {race.size}
          </div>
          {race.ability_bonuses && race.ability_bonuses.length > 0 && (
            <div className="col-span-2">
              <span className="font-medium">Bônus de Atributo: </span>
              {race.ability_bonuses
                .map((ab: any) => `${ab.ability_score?.name} +${ab.bonus}`)
                .join(", ")}
            </div>
          )}
          {race.languages && race.languages.length > 0 && (
            <div className="col-span-2">
              <span className="font-medium">Idiomas: </span>
              {race.languages.map((l: any) => l.name).join(", ")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
