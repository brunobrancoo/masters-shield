"use client";

import { Wind } from "lucide-react";

interface UnarmoredMovementDisplayProps {
  unarmoredMovement?: number | null;
}

export default function UnarmoredMovementDisplay({ unarmoredMovement }: UnarmoredMovementDisplayProps) {
  if (!unarmoredMovement) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <Wind className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Movimento Sem Armadura</p>
        <p className="text-sm font-semibold text-text-primary">
          +{unarmoredMovement} pés
        </p>
      </div>
    </div>
  );
}
