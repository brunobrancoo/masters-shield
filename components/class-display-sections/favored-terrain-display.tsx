"use client";

import { TreePine } from "lucide-react";

interface FavoredTerrainDisplayProps {
  favoredTerrain?: number | null;
}

export default function FavoredTerrainDisplay({ favoredTerrain }: FavoredTerrainDisplayProps) {
  if (!favoredTerrain) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <TreePine className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Terrenos Favoritos</p>
        <p className="text-sm font-semibold text-text-primary">
          {favoredTerrain} terreno{favoredTerrain > 1 ? 's' : ''} favorito{favoredTerrain > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
