"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Wind, Zap, Eye, Sword, Wand2 } from "lucide-react";

interface PlayerFormCombatStatsSectionProps {
  register: any;
}

export default function PlayerFormCombatStatsSection({
  register,
}: PlayerFormCombatStatsSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Sword className="w-4 h-4 text-martial-400" />
        Estatísticas de Combate
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="ac"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Shield className="w-3 h-3 text-divine-400" />
            Classe de Armadura
          </Label>
          <Input
            id="ac"
            type="number"
            min="1"
            className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
            {...register("ac", { valueAsNumber: true })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="speed"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Wind className="w-3 h-3 text-nature-400" />
            Deslocamento
          </Label>
          <Input
            id="speed"
            type="number"
            min="0"
            className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
            {...register("speed", { valueAsNumber: true })}
            placeholder="30"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="initiativeBonus"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Zap className="w-3 h-3 text-arcane-400" />
            Bônus de Iniciativa
          </Label>
          <Input
            id="initiativeBonus"
            type="number"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("initiativeBonus", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="passivePerception"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Eye className="w-3 h-3 text-nature-400" />
            Percepção Passiva
          </Label>
          <Input
            id="passivePerception"
            type="number"
            className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
            {...register("passivePerception", { valueAsNumber: true })}
            placeholder="10"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="attackBaseBonus"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Sword className="w-3 h-3 text-martial-400" />
            Bônus de Ataque Base
          </Label>
          <Input
            id="attackBaseBonus"
            type="number"
            className="bg-bg-inset border-border-default focus:border-martial-400 h-11"
            {...register("attackBaseBonus", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="spellAttack"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            <Wand2 className="w-3 h-3 text-arcane-400" />
            Ataque de Magia
          </Label>
          <Input
            id="spellAttack"
            type="number"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            {...register("spellAttack", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
