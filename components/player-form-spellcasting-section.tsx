"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Attributes, attributesSchema, SpellSlots } from "@/lib/schemas";
import { Loading } from "./loading";
import { convertLevelSpellcasting } from "@/lib/character-utils";

interface PlayerFormSpellcastingSectionProps {
  control: Control<any>;
  setValue: any;
  classIndex: string;
  level: number;
  attributes: Attributes;
  proficiencyBonus: number;
  isEditing: boolean;
}

export default function PlayerFormSpellcastingSection({
  control,
  setValue,
  classIndex,
  level,
  attributes,
  proficiencyBonus,
  isEditing,
}: PlayerFormSpellcastingSectionProps) {
  const getCasterClasses = () => [
    "bard",
    "monk",
    "cleric",
    "druid",
    "sorcerer",
    "warlock",
    "wizard",
    "paladin",
    "ranger",
  ];
  const form = useFormContext();
  const isCaster =
    classIndex && getCasterClasses().includes(classIndex.toLowerCase());

  const { data: classData, isLoading: loadingClass } = useClass(classIndex);

  const spellcastingAbility =
    classData?.class?.spellcasting?.spellcasting_ability?.index ||
    SPELLCASTING_ABILITY[classIndex?.toLowerCase() || ""];

  useEffect(() => {
    if (
      !isCaster ||
      !spellcastingAbility ||
      !classData?.class?.class_levels[level - 1].spellcasting ||
      loadingClass ||
      isEditing
    )
      return;

    console.log("level: ", level);
    const spellDC = calculateSpellDC(
      level,
      spellcastingAbility as any,
      attributes,
    );
    const spellAttack = calculateSpellAttack(
      level,
      spellcastingAbility as any,
      attributes,
    );

    setValue("spellCD", spellDC);
    setValue("spellAttack", spellAttack);
  }, [
    level,
    JSON.stringify(attributes),
    proficiencyBonus,
    classIndex,
    isCaster,
    loadingClass,
  ]);

  const handleSpellSlotChange = (lvl: number, value: number) => {
    const newSpellSlots = { ...form.watch("spellSlots") };
    newSpellSlots[lvl] = { ...newSpellSlots[lvl], current: value, max: value };
    setValue("spellSlots", newSpellSlots);
  };

  if (!isCaster && classIndex !== "monk") {
    return null;
  }

  if (loadingClass) return <Loading />;
  const spellAbilityName = spellcastingAbility?.toUpperCase() || "INT";

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="identity-section">
        <AccordionTrigger>
          <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-arcane-400" />
            Magia & Feitiços
          </FieldLabel>
        </AccordionTrigger>
        <AccordionContent>
          <div className="">
            <div className="mb-4 p-3 bg-arcane-400/10 rounded border border-arcane-400/20">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold">Atributo de Conjuração:</span>{" "}
                {spellAbilityName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-spellCD"
                  className="text-text-secondary font-medium"
                >
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
                <p className="text-xs text-text-tertiary">
                  8 + Bônus de Proficiência + Mod. {spellAbilityName}
                </p>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-spellAttack"
                  className="text-text-secondary font-medium"
                >
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
                <p className="text-xs text-text-tertiary">
                  Bônus de Proficiência + Mod. {spellAbilityName}
                </p>
              </div>
            </div>

            {form.watch("spellSlots") && (
              <div className="mt-4">
                <FieldLabel className="text-text-secondary font-medium mb-3 block">
                  Slots de Magia (Atual / Máximo) - Nível {level}
                </FieldLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => {
                    const slotData = form.watch("spellSlots")[lvl] || 0;

                    return (
                      <div key={lvl}>
                        <div className="flex items-center gap-1 mb-1">
                          <Wand2 className="w-3 h-3 text-arcane-400" />
                          <FieldLabel className="text-xs text-text-tertiary">
                            Nível {lvl}
                          </FieldLabel>
                        </div>
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Máx"
                            className="flex-1 bg-bg-inset border-border-default focus:border-arcane-400 text-center h-9 text-sm"
                            value={slotData?.max ?? 0}
                            onChange={(e) => {
                              handleSpellSlotChange(
                                lvl,
                                parseInt(e.target.value) || 0,
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
