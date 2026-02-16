"use client";

import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Heart, ShieldCheck, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Control, UseFormReturn } from "react-hook-form";
import { calculateModifier } from "@/lib/skills";
import { useState } from "react";
import { Loading } from "./loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface PlayerFormHealthSectionProps {
  form: UseFormReturn<any, any, any>;
  showRollButton?: boolean;
}

export default function PlayerFormHealthSection({
  form,
  showRollButton = false,
}: PlayerFormHealthSectionProps) {
  const watchedAttributes = form.watch("attributes") ?? 0;
  const watchedLevel = form.watch("level") ?? 0;
  const watchedHitDie = form.watch("hitDie") ?? 0;
  const [hpRolls, setHpRolls] = useState<number[]>([]);
  const handleRollMaxHP = () => {
    const conModifier = calculateModifier(watchedAttributes?.con || 10);
    if (hpRolls.length >= watchedLevel - 1) {
      setHpRolls([]);
    }
    console.log("CON MODIFIER: ", conModifier);

    let maxHP = 0;

    if (watchedLevel === 1) {
      maxHP = watchedHitDie + conModifier;
    } else {
      maxHP = watchedHitDie;

      for (let i = 2; i <= watchedLevel; i++) {
        const roll = Math.floor(Math.random() * watchedHitDie) + 1;

        maxHP += roll;
        console.log("loop: ", maxHP, i, watchedLevel);
        setHpRolls((prev) => prev.concat(roll));
        console.log({ hpRolls });
      }

      maxHP += watchedLevel * conModifier;
    }

    form.setValue("maxHp", Math.max(1, maxHP));
    form.setValue("hp", Math.max(1, maxHP));
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="health-section">
        <AccordionTrigger>
          <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary  flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            Saúde & Vida
          </FieldLabel>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bg-bg-surface shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-hp"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  Pontos de Vida Atuais
                </FieldLabel>
                <div className="flex gap-2">
                  <Heart className="w-4 h-4 text-destructive mt-3 flex-shrink-0" />
                  <Controller
                    name="hp"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="form-hp"
                        type="number"
                        min="1"
                        className="bg-bg-inset border-border-default focus:border-destructive h-11"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="10"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-maxHp"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  Pontos de Vida Máximos
                </FieldLabel>
                <div className="flex gap-2 flex-1">
                  <ShieldCheck className="w-4 h-4 text-divine-400 mt-3 flex-shrink-0" />
                  <Controller
                    name="maxHp"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="form-maxHp"
                        type="number"
                        min="1"
                        className="bg-bg-inset border-border-default focus:border-divine-400 h-11 flex-1"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="10"
                      />
                    )}
                  />
                  {showRollButton && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleRollMaxHP}
                      className="h-11 w-11 flex-shrink-0"
                      title="Rolar HP"
                    >
                      <Dices className="w-4 h-4 text-text-secondary" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {hpRolls.length > 0 && (
              <div className="mt-2 flex">
                <div>
                  <p>Hp Rolls: (1d{form.watch("hitDie")})</p>
                  <p>
                    {hpRolls.join(", ")} ={" "}
                    {hpRolls.reduce((acc, item) => acc + item, 0)}
                  </p>
                </div>
                <div className="ml-auto">
                  <p>Con multiplied by Level</p>
                  <p>
                    {calculateModifier(watchedAttributes.con) * watchedLevel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
