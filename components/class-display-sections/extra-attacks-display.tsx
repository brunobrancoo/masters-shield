"use client";

import { Swords } from "lucide-react";

interface ExtraAttacksDisplayProps {
  extraAttacks?: number | null;
}

export default function ExtraAttacksDisplay({ extraAttacks }: ExtraAttacksDisplayProps) {
  if (!extraAttacks) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Swords className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Ataques Extras</p>
        <p className="text-sm font-semibold text-text-primary">
          +{extraAttacks} ataque{extraAttacks > 1 ? 's' : ''} extra
        </p>
      </div>
    </div>
  );
}
