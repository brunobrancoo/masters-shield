"use client";

import { Skull } from "lucide-react";

interface DestroyUndeadCRDisplayProps {
  destroyUndeadCR?: number | null;
}

export default function DestroyUndeadCRDisplay({ destroyUndeadCR }: DestroyUndeadCRDisplayProps) {
  if (!destroyUndeadCR) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <Skull className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Destruir Mortos-Vivos</p>
        <p className="text-sm font-semibold text-text-primary">CR {destroyUndeadCR}</p>
      </div>
    </div>
  );
}
