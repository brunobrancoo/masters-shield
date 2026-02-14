"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";
import { Spell } from "@/lib/interfaces/interfaces";
import { spellSchema, type SpellFormData } from "@/lib/schemas";

export default function EditSpellDialog({
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
  const [descriptionText, setDescriptionText] = useState("");

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
      description: spell.description || [],
      attackType: spell.attackType || "",
      material: spell.material || "",
      areaOfEffect: spell.areaOfEffect || { size: undefined, type: undefined },
      higherLevel: spell.higherLevel || [],
      damage: spell.damage || { damageType: undefined, damageAtSlotLevel: undefined },
      dc: spell.dc || { dcType: undefined, dcSuccess: undefined },
      healAtSlotLevel: spell.healAtSlotLevel || [],
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
      description: spell.description,
      attackType: spell.attackType,
      material: spell.material,
      areaOfEffect: spell.areaOfEffect,
      higherLevel: spell.higherLevel,
      damage: spell.damage,
      dc: spell.dc,
      healAtSlotLevel: spell.healAtSlotLevel,
    });
    setDescriptionText(Array.isArray(spell.description) ? spell.description.join("\n") : "");
  }, [spell, reset]);

  const onSubmit = (data: z.infer<typeof spellSchema>) => {
    const updatedSpell: Spell = {
      ...spell,
      index: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      level: data.level,
      school: data.school,
      castingTime: data.castingTime,
      duration: data.duration,
      range: data.range,
      components: data.components,
      concentration: data.concentration,
      ritual: data.ritual,
      description: descriptionText.split("\n").filter(line => line.trim() !== "") || [],
      attackType: data.attackType,
      material: data.material,
      areaOfEffect: data.areaOfEffect,
      higherLevel: data.higherLevel,
      damage: data.damage,
      dc: data.dc,
      healAtSlotLevel: data.healAtSlotLevel,
    };
    onUpdate(index, updatedSpell);
    reset();
    setDescriptionText("");
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

            <div className="space-y-2">
              <Label htmlFor="edit-spell-description" className="text-text-secondary font-medium">
                Descrição
              </Label>
              <Textarea
                id="edit-spell-description"
                rows={4}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                className="bg-bg-inset border-border-default focus:border-arcane-400 resize-none"
                placeholder="Descrição da magia..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spell-attack-type" className="text-text-secondary font-medium">
                  Tipo de Ataque
                </Label>
                <Input
                  id="edit-spell-attack-type"
                  {...register("attackType")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Melee, Ranged, ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-spell-material" className="text-text-secondary font-medium">
                  Material
                </Label>
                <Input
                  id="edit-spell-material"
                  {...register("material")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: Ruby dust worth 50gp"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-spell-aoe-type" className="text-text-secondary font-medium">
                  Tipo de Área de Efeito
                </Label>
                <Input
                  id="edit-spell-aoe-type"
                  {...register("areaOfEffect.type")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Sphere, Cylinder, ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-spell-aoe-size" className="text-text-secondary font-medium">
                  Tamanho da Área (pés)
                </Label>
                <Input
                  id="edit-spell-aoe-size"
                  type="number"
                  {...register("areaOfEffect.size", { valueAsNumber: true })}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="Ex: 20"
                />
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
              setDescriptionText("");
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
