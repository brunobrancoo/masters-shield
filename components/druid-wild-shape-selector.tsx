"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Info, Feather, Fish } from "lucide-react";
import type { Control } from "react-hook-form";

interface DruidWildShapeSelectorProps {
  control: Control<any>;
  setValue: any;
  wildShapeMaxCR?: number;
  canFly?: boolean;
  canSwim?: boolean;
}

export default function DruidWildShapeSelector({
  control,
  setValue,
  wildShapeMaxCR,
  canFly,
  canSwim,
}: DruidWildShapeSelectorProps) {
  const form = useFormContext();
  const wildShapeForm = form.watch("wildShapeForm") || "";

  return (
    <div className="space-y-3">
      <Controller
        name="wildShapeForm"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <FieldLabel
              htmlFor="form-wildShapeForm"
              className="text-text-secondary font-medium"
            >
              Forma de Forma Selvagem
            </FieldLabel>
            <Input
              id="form-wildShapeForm"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Ex: Lobo, Urso, Águia..."
              className="bg-bg-inset border-border-default focus:border-nature-400"
            />
          </div>
        )}
      />

      {/* Display limits */}
      <div className="p-3 bg-bg-inset rounded border border-border-subtle">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-text-secondary space-y-1">
            <p>
              <strong>CR Máximo:</strong> {wildShapeMaxCR ?? 0}
            </p>
            <div className="flex gap-3">
              {canFly && (
                <span className="flex items-center gap-1 text-nature-400">
                  <Feather className="w-3 h-3" />
                  Pode voar
                </span>
              )}
              {canSwim && (
                <span className="flex items-center gap-1 text-nature-400">
                  <Fish className="w-3 h-3" />
                  Pode nadar
                </span>
              )}
              {!canFly && !canSwim && (
                <span className="text-text-tertiary text-xs">
                  Sem habilidades especiais de movimento
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
