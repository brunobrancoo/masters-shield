"use client";

import { Zap } from "lucide-react";
import { ClassSpecific } from "@/lib/generated/graphql";

interface MartialArtsDisplayProps {
  martialArts?: ClassSpecific["martial_arts"];
}

export default function MartialArtsDisplay({ martialArts }: MartialArtsDisplayProps) {
  if (!martialArts) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="text-nature-400">
        <Zap className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-secondary">Artes Marciais</p>
        <p className="text-sm font-semibold text-text-primary">
          {martialArts.dice_count}d{martialArts.dice_value}
        </p>
      </div>
    </div>
  );
}
