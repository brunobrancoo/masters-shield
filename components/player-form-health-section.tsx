"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ShieldCheck } from "lucide-react";

interface PlayerFormHealthSectionProps {
  register: any;
  errors: any;
}

export default function PlayerFormHealthSection({
  register,
  errors,
}: PlayerFormHealthSectionProps) {
  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Heart className="w-4 h-4 text-destructive" />
        Saúde & Vida
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="hp"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Pontos de Vida Atuais
          </Label>
          <div className="flex gap-2">
            <Heart className="w-4 h-4 text-destructive mt-3 flex-shrink-0" />
            <Input
              id="hp"
              type="number"
              min="1"
              className="bg-bg-inset border-border-default focus:border-destructive h-11"
              {...register("hp", { valueAsNumber: true })}
              placeholder="10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="maxHp"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Pontos de Vida Máximos
          </Label>
          <div className="flex gap-2">
            <ShieldCheck className="w-4 h-4 text-divine-400 mt-3 flex-shrink-0" />
            <Input
              id="maxHp"
              type="number"
              min="1"
              className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
              {...register("maxHp", { valueAsNumber: true })}
              placeholder="10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
