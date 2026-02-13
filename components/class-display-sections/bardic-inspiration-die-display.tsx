"use client";

import { Sparkles } from "lucide-react";

interface BardicInspirationDieDisplayProps {
  bardicInspirationDie?: number | null;
}

export default function BardicInspirationDieDisplay({ bardicInspirationDie }: BardicInspirationDieDisplayProps) {
  if (!bardicInspirationDie) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Dado de Inspiração Bárdica</p>
        <p className="text-sm font-semibold text-text-primary">d{bardicInspirationDie}</p>
      </div>
    </div>
  );
}
