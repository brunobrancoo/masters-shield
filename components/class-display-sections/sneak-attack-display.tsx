"use client";

import { Swords } from "lucide-react";
import { ClassSpecific } from "@/lib/generated/graphql";

interface SneakAttackDisplayProps {
  sneakAttack?: ClassSpecific["sneak_attack"];
}

export default function SneakAttackDisplay({ sneakAttack }: SneakAttackDisplayProps) {
  if (!sneakAttack) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-martial-400">
        <Swords className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Ataque Furtivo</p>
        <p className="text-sm font-semibold text-text-primary">
          {sneakAttack.dice_count}d{sneakAttack.dice_value}
        </p>
      </div>
    </div>
  );
}
