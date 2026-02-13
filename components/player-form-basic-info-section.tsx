"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { useClasses, useRaces } from "@/lib/api/hooks";

interface PlayerFormBasicInfoSectionProps {
  register: any;
  errors: any;
}

export default function PlayerFormBasicInfoSection({
  register,
  errors,
}: PlayerFormBasicInfoSectionProps) {
  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { data: racesData, isLoading: loadingRaces } = useRaces();

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <User className="w-4 h-4 text-arcane-400" />
        Informações Básicas
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Nome <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <User className="w-4 h-4 text-text-tertiary mt-3 flex-shrink-0" />
            <Input
              id="name"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
              {...register("name")}
              placeholder="Nome do personagem"
            />
          </div>
          {errors.name && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="raceName"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Raça
          </Label>
          <div className="flex gap-2">
            <Sparkles className="w-4 h-4 text-nature-400 mt-3 flex-shrink-0" />
            <Input
              id="raceName"
              list="races-list"
              className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
              {...register("raceName")}
              placeholder="Ex: Humano, Elfo"
            />
            <datalist id="races-list">
              {racesData?.races?.map((r: any) => (
                <option key={r.index} value={r.name}>
                  {r.name}
                </option>
              ))}
            </datalist>
          </div>
          {errors.raceName && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.raceName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="className"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Classe
          </Label>
          <div className="flex gap-2">
            <BookOpen className="w-4 h-4 text-arcane-400 mt-3 flex-shrink-0" />
            <Input
              id="className"
              list="classes-list"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
              {...register("className")}
              placeholder="Ex: Guerreiro, Mago"
            />
            <datalist id="classes-list">
              {classesData?.classes?.map((c: any) => (
                <option key={c.index} value={c.name}>
                  {c.name}
                </option>
              ))}
            </datalist>
          </div>
          {errors.className && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.className.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="level"
            className="text-text-secondary font-medium flex items-center gap-2"
          >
            Nível
          </Label>
          <div className="flex gap-2">
            <TrendingUp className="w-4 h-4 text-arcane-400 mt-3 flex-shrink-0" />
            <Input
              id="level"
              type="number"
              min="1"
              max="20"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
              {...register("level", { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
