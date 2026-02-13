"use client";

import { Target } from "lucide-react";

interface FavoredEnemiesDisplayProps {
  favoredEnemies?: number | null;
}

export default function FavoredEnemiesDisplay({ favoredEnemies }: FavoredEnemiesDisplayProps) {
  if (!favoredEnemies) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <Target className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Inimigos Favoritos</p>
        <p className="text-sm font-semibold text-text-primary">
          {favoredEnemies} inimigo{favoredEnemies > 1 ? 's' : ''} favorito{favoredEnemies > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
