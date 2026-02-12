"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Target, Sparkles, Skull } from "lucide-react";
import { useFieldArray } from "react-hook-form";

interface PlayerFormSkillsSectionProps {
  control: any;
  skillFields: any[];
  featureFields: any[];
  buffFields: any[];
  debuffFields: any[];
  appendSkill: any;
  removeSkill: any;
  appendFeature: any;
  removeFeature: any;
  appendBuff: any;
  removeBuff: any;
  appendDebuff: any;
  removeDebuff: any;
}

export default function PlayerFormSkillsSection({
  control,
  skillFields,
  featureFields,
  buffFields,
  debuffFields,
  appendSkill,
  removeSkill,
  appendFeature,
  removeFeature,
  appendBuff,
  removeBuff,
  appendDebuff,
  removeDebuff,
}: PlayerFormSkillsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
        <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
          <Target className="w-4 h-4 text-arcane-400" />
          Habilidades
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const skillName = prompt("Nome da habilidade:");
            if (skillName) {
              const skillDesc = prompt("Descrição:");
              if (skillDesc) {
                const skillAttr = prompt(
                  "Atributo (for/des/con/int/sab/car):",
                );
                if (
                  skillAttr &&
                  ["for", "des", "con", "int", "sab", "car"].includes(
                    skillAttr,
                  )
                ) {
                  appendSkill({
                    name: skillName,
                    description: skillDesc,
                    savingThrowAttribute: skillAttr as any,
                  });
                }
              }
            }
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Habilidade
        </Button>
        <div className="space-y-2 mt-3">
          {skillFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-bg-inset p-3 rounded border border-border-subtle"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{field.name}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.description}
                  </p>
                  <Badge className="text-[10px] mt-1 bg-arcane-400/20 text-arcane-400">
                    {field.savingThrowAttribute}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
        <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-divine-400" />
          Características
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const featureName = prompt("Nome da característica:");
            if (featureName) {
              const featureDesc = prompt("Descrição:");
              if (featureDesc) {
                const featureSource = prompt(
                  "Origem (classe, raça, etc.):",
                );
                if (featureSource) {
                  const featureUses = prompt(
                    "Usos (deixe vazio para ilimitado):",
                  );
                  appendFeature({
                    name: featureName,
                    description: featureDesc,
                    source: featureSource,
                    uses: featureUses
                      ? Number.parseInt(featureUses)
                      : undefined,
                  });
                }
              }
            }
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Característica
        </Button>
        <div className="space-y-2 mt-3">
          {featureFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-bg-inset p-3 rounded border border-border-subtle"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-sm">{field.name}</p>
                    {field.uses !== undefined && (
                      <Badge className="text-[10px] bg-arcane-400/20 text-arcane-400">
                        {field.uses} usos
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.source}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
        <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Buffs
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const buffName = prompt("Nome do buff:");
            if (buffName) {
              const buffDesc = prompt("Descrição:");
              if (buffDesc) {
                const buffSource = prompt("Origem:");
                if (buffSource) {
                  const buffDuration = prompt("Duração:");
                  if (buffDuration) {
                    const buffEffect = prompt(
                      "Efeito (ac, strength, etc.):",
                    );
                    if (buffEffect) {
                      const buffAmount = prompt("Valor:");
                      if (buffAmount) {
                        appendBuff({
                          name: buffName,
                          description: buffDesc,
                          source: buffSource,
                          duration: buffDuration,
                          affects: {
                            effect: buffEffect,
                            amount: Number.parseInt(buffAmount),
                          },
                        });
                      }
                    }
                  }
                }
              }
            }
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Buff
        </Button>
        <div className="space-y-2 mt-3">
          {buffFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-bg-inset p-3 rounded border border-border-subtle"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-primary">
                    {field.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.source} • {field.duration}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    +{field.affects.amount} {field.affects.effect}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBuff(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
        <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
          <Skull className="w-4 h-4 text-destructive" />
          Debuffs
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const debuffName = prompt("Nome do debuff:");
            if (debuffName) {
              const debuffDesc = prompt("Descrição:");
              if (debuffDesc) {
                const debuffSource = prompt("Origem:");
                if (debuffSource) {
                  const debuffDuration = prompt("Duração:");
                  if (debuffDuration) {
                    const debuffEffect = prompt(
                      "Efeito (ac, strength, etc.):",
                    );
                    if (debuffEffect) {
                      const debuffAmount = prompt("Valor:");
                      if (debuffAmount) {
                        appendDebuff({
                          name: debuffName,
                          description: debuffDesc,
                          source: debuffSource,
                          duration: debuffDuration,
                          affects: {
                            effect: debuffEffect,
                            amount: Number.parseInt(debuffAmount),
                          },
                        });
                      }
                    }
                  }
                }
              }
            }
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Debuff
        </Button>
        <div className="space-y-2 mt-3">
          {debuffFields.map((field, index) => (
            <div
              key={field.id}
              className="bg-bg-inset p-3 rounded border border-border-subtle"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-destructive">
                    {field.name}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {field.source} • {field.duration}
                  </p>
                  <p className="text-xs text-destructive mt-1">
                    {field.affects.amount} {field.affects.effect}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDebuff(index)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
