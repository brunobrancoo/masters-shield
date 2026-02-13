"use client";

import { Sparkles } from "lucide-react";

interface MetamagicKnownDisplayProps {
  metamagicKnown?: number | null;
}

export default function MetamagicKnownDisplay({ metamagicKnown }: MetamagicKnownDisplayProps) {
  if (metamagicKnown === null || metamagicKnown === undefined) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Metamagias Conhecidas</p>
        <p className="text-sm font-semibold text-text-primary">{metamagicKnown}</p>
      </div>
    </div>
  );
}
