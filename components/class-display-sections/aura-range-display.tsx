"use client";

import { Shield } from "lucide-react";

interface AuraRangeDisplayProps {
  auraRange?: number | null;
}

export default function AuraRangeDisplay({ auraRange }: AuraRangeDisplayProps) {
  if (!auraRange) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <Shield className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Aura do Paladino</p>
        <p className="text-sm font-semibold text-text-primary">{auraRange} pés</p>
      </div>
    </div>
  );
}
