"use client";

import { Scroll } from "lucide-react";

interface SongOfRestDieDisplayProps {
  songOfRestDie?: number | null;
}

export default function SongOfRestDieDisplay({ songOfRestDie }: SongOfRestDieDisplayProps) {
  if (!songOfRestDie) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <Scroll className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Canto do Descanso</p>
        <p className="text-sm font-semibold text-text-primary">
          d{songOfRestDie} PV descanso curto
        </p>
      </div>
    </div>
  );
}
