"use client";

import { RefreshCw } from "lucide-react";

interface ArcaneRecoveryLevelsDisplayProps {
  arcaneRecoveryLevels?: number | null;
}

export default function ArcaneRecoveryLevelsDisplay({ arcaneRecoveryLevels }: ArcaneRecoveryLevelsDisplayProps) {
  if (!arcaneRecoveryLevels) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <RefreshCw className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Recuperação Arcana</p>
        <p className="text-sm font-semibold text-text-primary">
          Recupera até nível {arcaneRecoveryLevels}
        </p>
      </div>
    </div>
  );
}
