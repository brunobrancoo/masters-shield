"use client";

import { Zap } from "lucide-react";

interface ActionSurgesDisplayProps {
  actionSurges?: number | null;
}

export default function ActionSurgesDisplay({ actionSurges }: ActionSurgesDisplayProps) {
  if (actionSurges === null || actionSurges === undefined) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Zap className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Impulsos de Ação</p>
        <p className="text-sm font-semibold text-text-primary">{actionSurges} por descanso</p>
      </div>
    </div>
  );
}
