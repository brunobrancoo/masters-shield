"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Shield, Wind, Zap, Eye, Sword } from "lucide-react";
import { calculateModifier } from "@/lib/skills";
import type { Control } from "react-hook-form";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface PlayerFormCombatStatsSectionProps {
  control: Control<any>;
  attributes?: any;
}

export default function PlayerFormCombatStatsSection({
  control,
  attributes,
}: PlayerFormCombatStatsSectionProps) {
  const form = useFormContext();
  const dexModifier = attributes?.dex ? calculateModifier(attributes.dex) : 0;
  const initiativeBonus = form.watch("initiativeBonus") || 0;
  const totalInitiative = dexModifier + initiativeBonus;

  const watchedAttributes = useWatch({
    control: form.control,
    name: "attributes",
  }) || { des: 10, sab: 10 };
  useEffect(() => {
    const dexModifier = calculateModifier(attributes.dex || 10);
    form.setValue("ac", 10 + dexModifier);
    const wisModifier = calculateModifier(attributes.wis || 10);
    form.setValue("passivePerception", 10 + wisModifier);
  }, [watchedAttributes]);

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="combat-session">
        <AccordionTrigger>
          <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <Sword className="w-4 h-4 text-martial-400" />
            Estatísticas de Combate
          </FieldLabel>
        </AccordionTrigger>
        <AccordionContent>
          <div className="">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-ac"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <Shield className="w-3 h-3 text-divine-400" />
                  Classe de Armadura
                </FieldLabel>
                <Controller
                  name="ac"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="form-ac"
                      type="number"
                      min="1"
                      className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="10"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-speed"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <Wind className="w-3 h-3 text-nature-400" />
                  Deslocamento
                </FieldLabel>
                <Controller
                  name="speed"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="form-speed"
                      type="number"
                      min="0"
                      className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="30"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-initiativeBonus"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 text-arcane-400" />
                  Iniciativa
                </FieldLabel>
                <div className="flex gap-2">
                  <Controller
                    name="initiativeBonus"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="form-initiativeBonus"
                        type="number"
                        className="bg-bg-inset border-border-default focus:border-arcane-400 h-11 flex-1"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="Bônus"
                      />
                    )}
                  />
                  <div className="bg-bg-inset border border-border-default px-3 h-11 flex items-center justify-center min-w-[60px] text-text-primary font-medium">
                    {dexModifier >= 0 ? `+${dexModifier}` : dexModifier}
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Total:{" "}
                  <span className="font-semibold">
                    {totalInitiative >= 0
                      ? `+${totalInitiative}`
                      : totalInitiative}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-passivePerception"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <Eye className="w-3 h-3 text-nature-400" />
                  Percepção Passiva
                </FieldLabel>
                <Controller
                  name="passivePerception"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="form-passivePerception"
                      type="number"
                      className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="10"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-profBonus"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <Sword className="w-3 h-3 text-martial-400" />
                  Bônus de Proficiência
                </FieldLabel>
                <Controller
                  name="profBonus"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="form-profBonus"
                      type="number"
                      className="bg-bg-inset border-border-default focus:border-martial-400 h-11"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="0"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
