"use client";

import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Heart, ShieldCheck, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Control } from "react-hook-form";

interface PlayerFormHealthSectionProps {
  control: Control<any>;
  onRollMaxHP?: () => void;
  showRollButton?: boolean;
}

export default function PlayerFormHealthSection({
  control,
  onRollMaxHP,
  showRollButton = false,
}: PlayerFormHealthSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <FieldLabel className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Heart className="w-4 h-4 text-destructive" />
        Saúde & Vida
      </FieldLabel>
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
              control={control}
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
              control={control}
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
            {showRollButton && onRollMaxHP && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onRollMaxHP}
                className="h-11 w-11 flex-shrink-0"
                title="Rolar HP"
              >
                <Dices className="w-4 h-4 text-text-secondary" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
