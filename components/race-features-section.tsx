"use client";

import { useRace } from "@/lib/api/hooks";

interface RaceFeaturesSectionProps {
  raceIndex: string;
}

export default function RaceFeaturesSection({
  raceIndex,
}: RaceFeaturesSectionProps) {
  const { data: raceQueryData } = useRace(raceIndex);
  const raceData = raceQueryData?.race;

  if (!raceData || !raceData.traits || raceData.traits.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-arcane-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5 2-7z" />
        </svg>
        Recursos da Raça - {raceData.name}
      </h3>
      <div className="space-y-4">
        {raceData.traits.map((trait: any) => (
          <div key={trait.index} className="p-4 bg-bg-inset rounded border border-border-default">
            <h4 className="font-semibold text-arcane-400 mb-2">{trait.name}</h4>
            <div className="text-sm text-text-secondary space-y-2">
              {trait.desc && Array.isArray(trait.desc) ? (
                trait.desc.map((d: string, i: number) => <p key={i}>{d}</p>)
              ) : trait.desc ? (
                <p>{trait.desc}</p>
              ) : null}

              {trait.proficiencies && trait.proficiencies.length > 0 && (
                <div>
                  <span className="font-medium">Proficiências:</span>{" "}
                  {trait.proficiencies.map((p: any) => p.name).join(", ")}
                </div>
              )}

              {trait.trait_specific && (
                <div className="space-y-1">
                  {trait.trait_specific.subtrait_options && (
                    <div>
                      <span className="font-medium">Opções:</span> Escolha {trait.trait_specific.subtrait_options.choose}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
