"use client";

import { Shield } from "lucide-react";

interface IndomitableUsesDisplayProps {
  indomitableUses?: number | null;
}

export default function IndomitableUsesDisplay({ indomitableUses }: IndomitableUsesDisplayProps) {
  if (!indomitableUses) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Shield className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Indomável</p>
        <p className="text-sm font-semibold text-text-primary">
          {indomitableUses} uso{indomitableUses > 1 ? 's' : ''} por descanso
        </p>
      </div>
    </div>
  );
}
