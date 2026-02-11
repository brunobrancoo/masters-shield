"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import { Spell } from "@/lib/interfaces/interfaces";
import { spellSchema, type SpellFormData } from "@/lib/schemas";

export function EditSpellDialog({
  spell,
  index,
  open,
  setOpen,
  onUpdate,
}: {
  spell: Spell;
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: (index: number, spell: Spell) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof spellSchema>>({
    resolver: zodResolver(spellSchema),
    defaultValues: {
      name: spell.name || "",
      level: spell.level || 0,
      school: spell.school || "",
      castingTime: spell.castingTime || "",
      duration: spell.duration || "",
      range: spell.range || "",
      components: spell.components || "",
      concentration: spell.concentration || false,
      ritual: spell.ritual || false,
    },
  });

  useEffect(() => {
    reset({
      name: spell.name,
      level: spell.level,
      school: spell.school,
      castingTime: spell.castingTime,
      duration: spell.duration,
      range: spell.range,
      components: spell.components,
      concentration: spell.concentration,
      ritual: spell.ritual,
    });
  }, [spell, reset]);

  const onSubmit = (data: z.infer<typeof spellSchema>) => {
    const updatedSpell: Spell = {
      ...spell,
      name: data.name,
      level: data.level,
      school: data.school,
      castingTime: data.castingTime,
      duration: data.duration,
      range: data.range,
      components: data.components,
      concentration: data.concentration,
      ritual: data.ritual,
    };
    onUpdate(index, updatedSpell);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-elevated border-border-strong p-8">
        <DialogHeader className="border-b border-border-default pb-6 mb-2">
          <DialogTitle className="font-heading text-2xl flex items-center gap-3">
            Editar Magia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
          <div className="bg-bg-surface rounded-lg border border-border-default p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spell-name" className="text-text-secondary font-medium">
                  Nome *
                </Label>
                <Input
                  id="edit-spell-name"
                  {...register("name")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                />
                {errors.name && (
                  <p className="text-destructive text-xs">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-spell-level" className="text-text-secondary font-medium">
                  Nível *
                </Label>
                <Input
                  id="edit-spell-level"
                  type="number"
                  {...register("level", { valueAsNumber: true })}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  min={0}
                  max={9}
                />
                {errors.level && (
                  <p className="text-destructive text-xs">{errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spell-school" className="text-text-secondary font-medium">
                  Escola
                </Label>
                <Input
                  id="edit-spell-school"
                  {...register("school")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: Evocation, Illusion"
                />
                {errors.school && (
                  <p className="text-destructive text-xs">{errors.school.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-spell-casting-time" className="text-text-secondary font-medium">
                  Tempo de Conjuração
                </Label>
                <Input
                  id="edit-spell-casting-time"
                  {...register("castingTime")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: 1 ação, 1 minuto"
                />
                {errors.castingTime && (
                  <p className="text-destructive text-xs">{errors.castingTime.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spell-duration" className="text-text-secondary font-medium">
                  Duração
                </Label>
                <Input
                  id="edit-spell-duration"
                  {...register("duration")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: Instantâneo, 1 hora"
                />
                {errors.duration && (
                  <p className="text-destructive text-xs">{errors.duration.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-spell-range" className="text-text-secondary font-medium">
                  Alcance
                </Label>
                <Input
                  id="edit-spell-range"
                  {...register("range")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: Self, Touch, 60 ft"
                />
                {errors.range && (
                  <p className="text-destructive text-xs">{errors.range.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-spell-components" className="text-text-secondary font-medium">
                  Componentes
                </Label>
                <Input
                  id="edit-spell-components"
                  {...register("components")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="V, S, M"
                />
                {errors.components && (
                  <p className="text-destructive text-xs">{errors.components.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border-border-subtle">
                <input
                  type="checkbox"
                  id="edit-spell-concentration"
                  {...register("concentration")}
                  className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                />
                <Label htmlFor="edit-spell-concentration" className="mb-0">
                  Concentração
                </Label>
              </div>
              <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border-border-subtle">
                <input
                  type="checkbox"
                  id="edit-spell-ritual"
                  {...register("ritual")}
                  className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                />
                <Label htmlFor="edit-spell-ritual" className="mb-0">
                  Ritual
                </Label>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-border-default pt-8 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-arcane-500 hover:bg-arcane-400 text-white glow-arcane">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
