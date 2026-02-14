"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";
import {
  SPELLCASTING_ABILITY,
  calculateSpellDC,
  calculateSpellAttack,
} from "@/lib/skills";
import { useClass } from "@/lib/api/hooks";
import type { Control } from "react-hook-form";

interface PlayerFormSpellcastingSectionProps {
  control: Control<any>;
  setValue: any;
  classIndex: string;
  level: number;
  attributes: { for: number; des: number; con: number; int: number; sab: number; car: number };
  proficiencyBonus: number;
}

export default function PlayerFormSpellcastingSection({
  control,
  setValue,
  classIndex,
  level,
  attributes,
  proficiencyBonus,
}: PlayerFormSpellcastingSectionProps) {
  const getCasterClasses = () => ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard", "paladin", "ranger"];
  const isCaster = classIndex && getCasterClasses().includes(classIndex.toLowerCase());

  const { data: classData } = useClass(classIndex);
  const spellcastingAbility = classData?.class?.spellcasting?.spellcasting_ability?.index || SPELLCASTING_ABILITY[classIndex?.toLowerCase() || ""];

  const [spellSlots, setSpellSlots] = useState<Record<number, { current: number; max: number }>>({
    1: { current: 0, max: 0 },
    2: { current: 0, max: 0 },
    3: { current: 0, max: 0 },
    4: { current: 0, max: 0 },
    5: { current: 0, max: 0 },
    6: { current: 0, max: 0 },
    7: { current: 0, max: 0 },
    8: { current: 0, max: 0 },
    9: { current: 0, max: 0 },
  });

  useEffect(() => {
    if (!isCaster || !spellcastingAbility) return;

    const spellDC = calculateSpellDC(level, spellcastingAbility as any, attributes);
    const spellAttack = calculateSpellAttack(level, spellcastingAbility as any, attributes);

    setValue("spellCD", spellDC);
    setValue("spellAttack", spellAttack);
  }, [level, spellcastingAbility, JSON.stringify(attributes), proficiencyBonus, isCaster, setValue]);

  useEffect(() => {
    setValue("spellSlots", spellSlots);
  }, [spellSlots, setValue]);

  const handleSpellSlotChange = (lvl: number, field: 'current' | 'max', value: number) => {
    const newSpellSlots = { ...spellSlots };
    newSpellSlots[lvl] = { ...newSpellSlots[lvl], [field]: value };
    setSpellSlots(newSpellSlots);
  };

  if (!isCaster) {
    return null;
  }

  const spellAbilityName = spellcastingAbility?.toUpperCase() || "INT";

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-arcane-400" />
        Magia & Feitiços
      </FieldLabel>

      <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold">Atributo de Conjuração:</span> {spellAbilityName}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FieldLabel htmlFor="form-spellCD" className="text-text-secondary font-medium">
            CD de Magia
          </FieldLabel>
          <Controller
            name="spellCD"
            control={control}
            render={({ field }) => (
              <Input
                id="form-spellCD"
                type="number"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <p className="text-xs text-text-tertiary">8 + Bônus de Proficiência + Mod. {spellAbilityName}</p>
        </div>
        <div className="space-y-2">
          <FieldLabel htmlFor="form-spellAttack" className="text-text-secondary font-medium">
            Bônus de Ataque Mágico
          </FieldLabel>
          <Controller
            name="spellAttack"
            control={control}
            render={({ field }) => (
              <Input
                id="form-spellAttack"
                type="number"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <p className="text-xs text-text-tertiary">Bônus de Proficiência + Mod. {spellAbilityName}</p>
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel className="text-text-secondary font-medium mb-3 block">
          Slots de Magia (Atual / Máximo) - Nível {level}
        </FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
            const slotData = spellSlots[lvl];

            return (
              <div key={lvl}>
                <div className="flex items-center gap-1 mb-1">
                  <Wand2 className="w-3 h-3 text-arcane-400" />
                  <FieldLabel className="text-xs text-text-tertiary">Nível {lvl}</FieldLabel>
                </div>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Atual"
                    className="flex-1 bg-bg-inset border-border-default focus:border-arcane-400 text-center h-9 text-sm"
                    value={slotData?.current ?? 0}
                    onChange={(e) => handleSpellSlotChange(lvl, 'current', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Máx"
                    className="flex-1 bg-bg-inset border-border-default focus:border-arcane-400 text-center h-9 text-sm"
                    value={slotData?.max ?? 0}
                    onChange={(e) => handleSpellSlotChange(lvl, 'max', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
