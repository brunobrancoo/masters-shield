"use client";

import { Heart } from "lucide-react";

interface RageDamageBonusDisplayProps {
  rageDamageBonus?: number | null;
}

export default function RageDamageBonusDisplay({ rageDamageBonus }: RageDamageBonusDisplayProps) {
  if (rageDamageBonus === null || rageDamageBonus === undefined) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Heart className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Bônus de Dano em Fúria</p>
        <p className="text-sm font-semibold text-text-primary">
          +{rageDamageBonus} dano
        </p>
      </div>
    </div>
  );
}
