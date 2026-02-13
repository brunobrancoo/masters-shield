"use client";

import { BookOpen } from "lucide-react";

interface MagicalSecretsDisplayProps {
  magicalSecretsMax5?: number | null;
  magicalSecretsMax7?: number | null;
  magicalSecretsMax9?: number | null;
}

export default function MagicalSecretsDisplay({
  magicalSecretsMax5,
  magicalSecretsMax7,
  magicalSecretsMax9,
}: MagicalSecretsDisplayProps) {
  const levels = [];
  if (magicalSecretsMax5) levels.push(`Nv5: ${magicalSecretsMax5}`);
  if (magicalSecretsMax7) levels.push(`Nv7: ${magicalSecretsMax7}`);
  if (magicalSecretsMax9) levels.push(`Nv9: ${magicalSecretsMax9}`);

  if (levels.length === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Segredos Mágicos</p>
        <p className="text-sm font-semibold text-text-primary">{levels.join(", ")}</p>
      </div>
    </div>
  );
}
