"use client";

import { Scroll } from "lucide-react";

interface InvocationsKnownDisplayProps {
  invocationsKnown?: number | null;
}

export default function InvocationsKnownDisplay({ invocationsKnown }: InvocationsKnownDisplayProps) {
  if (invocationsKnown === null || invocationsKnown === undefined) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <Scroll className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Invocações Conhecidas</p>
        <p className="text-sm font-semibold text-text-primary">
          {invocationsKnown} invocaç{invocationsKnown === 1 ? 'ão' : 'ões'}
        </p>
      </div>
    </div>
  );
}
