"use client";

import { useState, useEffect } from "react";
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
import { SparklesIcon } from "@/components/icons";
import { Plus, Save } from "lucide-react";
import { useSpells, mapApiSpellToInterface } from "@/lib/api/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { Spell } from "@/lib/interfaces/interfaces";
import { spellSchema, type SpellFormData } from "@/lib/schemas";

export default function AddSpellDialog({ onAdd }: { onAdd: (spell: Spell) => void }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: spellsData, isLoading } = useSpells(debouncedSearchQuery);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpellFormData>({
    resolver: zodResolver(spellSchema),
    defaultValues: {
      name: "",
      level: 0,
      school: "",
      castingTime: "",
      duration: "",
      range: "",
      components: "",
      concentration: false,
      ritual: false,
    },
  });

  const onSubmit = (data: SpellFormData) => {
    const newSpell: Spell = {
      index: `custom-${Date.now()}`,
      name: data.name,
      level: data.level,
      school: data.school,
      castingTime: data.castingTime,
      duration: data.duration,
      range: data.range,
      components: data.components,
      concentration: data.concentration,
      ritual: data.ritual,
      description: [],
      damage: undefined,
      dc: undefined,
      areaOfEffect: undefined,
      higherLevel: [],
      attackType: undefined,
      material: undefined,
    };
    onAdd(newSpell);
    reset();
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchQuery("");
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-bg-elevated border-border-strong p-8">
        <DialogHeader className="border-b border-border-default pb-6 mb-2">
          <DialogTitle className="font-heading text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-arcane-500/20 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-arcane-500" />
            </span>
            Adicionar Magia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
          <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg space-y-6">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
              Buscar na API D&D 5e
            </Label>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 text-text-tertiary">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
              <Input
                placeholder="Digite para buscar magias automaticamente..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="bg-bg-inset border-border-default focus:border-arcane-400 focus:ring-arcane-400/20 h-12 flex-1"
              />
            </div>

            {debouncedSearchQuery.length > 0 && (
              <div className="border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-text-secondary">
                      Consultando a API D&D 5e...
                    </p>
                  </div>
                ) : spellsData?.spells && spellsData.spells.length > 0 ? (
                  <div className="divide-y divide-border-subtle">
                    {spellsData.spells.map((spell: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const mappedSpell = mapApiSpellToInterface(spell);
                          reset({
                            name: spell.name,
                            level: spell.level,
                            school: spell.school?.name || "",
                            castingTime: spell.casting_time,
                            duration: spell.duration,
                            range: spell.range,
                            components: spell.components?.join(", ") || "",
                            concentration: spell.concentration,
                            ritual: spell.ritual,
                          });
                          setOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-bg-surface transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-text-primary group-hover:text-arcane-300">
                                {spell.name}
                              </span>
                              <span className="text-xs bg-arcane-500/20 text-arcane-500 px-2 py-0.5 rounded">
                                Nível {spell.level}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-text-tertiary">
                              <span>{spell.school?.name}</span>
                              <span>•</span>
                              <span>{spell.casting_time}</span>
                              <span>•</span>
                              <span>{spell.duration}</span>
                              <span>•</span>
                              <span>{spell.range}</span>
                            </div>
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {spell.damage?.damage_type?.name}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <svg
                      className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-text-secondary">
                      Nenhuma magia encontrada para "{debouncedSearchQuery}"
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Tente termos como "fireball", "heal", "magic missile"...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t-2 border-border-default pt-8">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-6 block flex items-center gap-2">
              <span className="w-1 h-4 bg-arcane-400 rounded-full"></span>
              Ou preencha manualmente
            </Label>

            <div className="bg-bg-surface rounded-lg border border-border-default p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-name"
                    className="text-text-secondary font-medium"
                  >
                    Nome *
                  </Label>
                  <Input
                    id="spell-name"
                    {...register("name")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    placeholder="Ex: Bola de Fogo"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-level"
                    className="text-text-secondary font-medium"
                  >
                    Nível *
                  </Label>
                  <Input
                    id="spell-level"
                    type="number"
                    {...register("level", { valueAsNumber: true })}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    min={0}
                    max={9}
                  />
                  {errors.level && (
                    <p className="text-destructive text-xs">
                      {errors.level.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-school"
                    className="text-text-secondary font-medium"
                  >
                    Escola
                  </Label>
                  <Input
                    id="spell-school"
                    {...register("school")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    placeholder="Ex: Evocation, Illusion"
                  />
                  {errors.school && (
                    <p className="text-destructive text-xs">
                      {errors.school.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-casting-time"
                    className="text-text-secondary font-medium"
                  >
                    Tempo de Conjuração
                  </Label>
                  <Input
                    id="spell-casting-time"
                    {...register("castingTime")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    placeholder="Ex: 1 ação, 1 minuto"
                  />
                  {errors.castingTime && (
                    <p className="text-destructive text-xs">
                      {errors.castingTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-duration"
                    className="text-text-secondary font-medium"
                  >
                    Duração
                  </Label>
                  <Input
                    id="spell-duration"
                    {...register("duration")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    placeholder="Ex: Instantâneo, 1 hora"
                  />
                  {errors.duration && (
                    <p className="text-destructive text-xs">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-range"
                    className="text-text-secondary font-medium"
                  >
                    Alcance
                  </Label>
                  <Input
                    id="spell-range"
                    {...register("range")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400"
                    placeholder="Ex: Self, Touch, 60 ft"
                  />
                  {errors.range && (
                    <p className="text-destructive text-xs">
                      {errors.range.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="spell-components"
                  className="text-text-secondary font-medium"
                >
                  Componentes
                </Label>
                <Input
                  id="spell-components"
                  {...register("components")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400"
                  placeholder="V, S, M"
                />
                {errors.components && (
                  <p className="text-destructive text-xs">
                    {errors.components.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border border-border-subtle">
                  <input
                    type="checkbox"
                    id="spell-concentration"
                    {...register("concentration")}
                    className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                  />
                  <Label htmlFor="spell-concentration" className="mb-0">
                    Concentração
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border border-border-subtle">
                  <input
                    type="checkbox"
                    id="spell-ritual"
                    {...register("ritual")}
                    className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                  />
                  <Label htmlFor="spell-ritual" className="mb-0">
                    Ritual
                  </Label>
                </div>
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
              setSearchQuery("");
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-arcane-500 hover:bg-arcane-400 text-white glow-arcane"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Magia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
