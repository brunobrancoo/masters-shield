"use client";

import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gauge, Dice1, Zap } from "lucide-react";
import { generateAttributes } from "@/lib/dice";
import type { Control } from "react-hook-form";
import { Attributes } from "@/lib/schemas";
import { attributeKeys } from "@/lib/character-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface PlayerFormAttributesSectionProps {
  control: Control<any>;
  setValue: any;
  remainingAbilityScoreImprovements?: number;
}

export default function PlayerFormAttributesSection({
  control,
  setValue,
}: PlayerFormAttributesSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className=" rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="identity-section">
        <AccordionTrigger>
          <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <Gauge className="w-4 h-4 text-martial-400" />
            Atributos
          </FieldLabel>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bg-bg-surface rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const genAtt = generateAttributes();
                  console.log("generated att: ", genAtt);
                  const attributes = attributeKeys.reduce((acc, key, index) => {
                    acc[key] = genAtt[index]?.result ?? 0;
                    return acc;
                  }, {} as Attributes);
                  setValue("attributes", attributes);
                }}
                className="flex items-center gap-2"
              >
                <Dice1 className="w-4 h-4" />
                Rolar Atributos
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(["str", "dex", "con", "int", "wis", "cha"] as const).map(
                (key) => (
                  <div key={key}>
                    <FieldLabel className="text-xs text-text-tertiary uppercase mb-1 block">
                      {key}
                    </FieldLabel>
                    <div className="relative">
                      <Controller
                        name={`attributes.${key}`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Input
                              type="number"
                              min="1"
                              max="30"
                              className="text-center bg-bg-inset border-border-default focus:border-arcane-400 h-12 font-bold text-lg"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            {error && <FieldError>{error.message}</FieldError>}
                          </>
                        )}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
