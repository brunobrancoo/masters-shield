"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gauge, Dice1 } from "lucide-react";
import { generateAttributes } from "@/lib/dice";
import { Attributes, attributeKeys } from "@/lib/interfaces/interfaces";

interface PlayerFormAttributesSectionProps {
  register: any;
  errors: any;
  setValue: any;
}

export default function PlayerFormAttributesSection({
  register,
  errors,
  setValue,
}: PlayerFormAttributesSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
          <Gauge className="w-4 h-4 text-martial-400" />
          Atributos
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const genAtt = generateAttributes();
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
        {(["for", "des", "con", "int", "sab", "car"] as const).map(
          (key) => (
            <div key={key}>
              <Label className="text-xs text-text-tertiary uppercase mb-1 block">
                {key}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="30"
                  className="text-center bg-bg-inset border-border-default focus:border-arcane-400 h-12 font-bold text-lg"
                  {...register(`attributes.${key}`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.attributes?.[key] && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.attributes[key]?.message}
                  </p>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
