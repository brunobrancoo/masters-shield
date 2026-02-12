"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Sparkles } from "lucide-react";

interface PlayerFormSpellcastingSectionProps {
  register: any;
}

export default function PlayerFormSpellcastingSection({
  register,
}: PlayerFormSpellcastingSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-arcane-400" />
        Magia & Feitiços
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="spellCD"
            className="text-text-secondary font-medium"
          >
            CD de Magia
          </Label>
          <Input
            id="spellCD"
            type="number"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("spellCD", { valueAsNumber: true })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="proficiencyBonus"
            className="text-text-secondary font-medium"
          >
            Bônus de Proficiência
          </Label>
          <Input
            id="proficiencyBonus"
            type="number"
            min="2"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("proficiencyBonus", { valueAsNumber: true })}
            placeholder="2"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-text-secondary font-medium mb-3 block">
          Slots de Magia (Máximo)
        </Label>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <div key={level}>
              <div className="flex items-center gap-1 mb-1">
                <Wand2 className="w-3 h-3 text-arcane-400" />
                <Label className="text-xs text-text-tertiary">
                  Nível {level}
                </Label>
              </div>
              <Input
                type="number"
                min="0"
                className="w-full bg-bg-inset border-border-default focus:border-arcane-400 text-center h-9 text-sm"
                {...(register as any)(`maxSpellSlots.${level}`)}
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label
            htmlFor="sorceryPoints"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3 text-arcane-400" />
            Pontos de Feitiçaria (Atual)
          </Label>
          <Input
            id="sorceryPoints"
            type="number"
            min="0"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("sorceryPoints", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="maxSorceryPoints"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3 text-arcane-400" />
            Pontos de Feitiçaria (Max)
          </Label>
          <Input
            id="maxSorceryPoints"
            type="number"
            min="0"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("maxSorceryPoints", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
