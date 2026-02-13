"use client";

import { BookOpen } from "lucide-react";

interface MysticArcanumDisplayProps {
  mysticArcanumLevel6?: number | null;
  mysticArcanumLevel7?: number | null;
  mysticArcanumLevel8?: number | null;
  mysticArcanumLevel9?: number | null;
}

export default function MysticArcanumDisplay({
  mysticArcanumLevel6,
  mysticArcanumLevel7,
  mysticArcanumLevel8,
  mysticArcanumLevel9,
}: MysticArcanumDisplayProps) {
  const levels = [];
  if (mysticArcanumLevel6) levels.push(`6º`);
  if (mysticArcanumLevel7) levels.push(`7º`);
  if (mysticArcanumLevel8) levels.push(`8º`);
  if (mysticArcanumLevel9) levels.push(`9º`);

  if (levels.length === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-arcane-400">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Arcano Místico</p>
        <p className="text-sm font-semibold text-text-primary">Níveis: {levels.join(", ")}</p>
      </div>
    </div>
  );
}
