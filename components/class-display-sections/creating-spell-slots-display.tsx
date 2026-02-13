"use client";

import { WandSparkles } from "lucide-react";
import { ClassSpecific } from "@/lib/generated/graphql";

interface CreatingSpellSlotsDisplayProps {
  creatingSpellSlots?: ClassSpecific["creating_spell_slots"];
}

export default function CreatingSpellSlotsDisplay({
  creatingSpellSlots,
}: CreatingSpellSlotsDisplayProps) {
  if (!creatingSpellSlots || creatingSpellSlots.length === 0) return null;

  return (
    <div className="p-3 bg-bg-inset rounded border border-border-subtle">
      <div className="flex items-center gap-2 mb-3">
        <WandSparkles className="w-4 h-4 text-arcane-400" />
        <p className="text-xs font-semibold text-text-secondary">
          Criar Espaços de Magia
        </p>
      </div>
      <div className="space-y-1">
        {creatingSpellSlots.map((slot, idx) => (
          <div key={idx} className="flex justify-between text-xs">
            <span className="text-text-secondary">
              Nível {slot.spell_slot_level}
            </span>
            <span className="text-text-primary font-medium">
              {slot.sorcery_point_cost} SP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
