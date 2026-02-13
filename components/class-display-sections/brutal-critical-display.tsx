"use client";

import { Flame } from "lucide-react";

interface BrutalCriticalDisplayProps {
  brutalCriticalDice?: number | null;
}

export default function BrutalCriticalDisplay({ brutalCriticalDice }: BrutalCriticalDisplayProps) {
  if (!brutalCriticalDice) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Flame className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Crítico Brutal</p>
        <p className="text-sm font-semibold text-text-primary">
          +{brutalCriticalDice} dado extra
        </p>
      </div>
    </div>
  );
}
