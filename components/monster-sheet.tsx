"use client";

import { useState } from "react";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldIcon, Trash2, Plus, Minus } from "lucide-react";
import { Monster } from "@/lib/schemas";
import type { SpellSlots } from "@/lib/schemas";

interface MonsterSheetProps {
  monster: Monster;
  onSave: (monster: Omit<Monster, "id">) => void;
  onDelete: () => void;
  onClose: () => void;
  onEdit: () => void;
}

export function MonsterSheet({
  monster,
  onSave,
  onDelete,
  onClose,
  onEdit,
}: MonsterSheetProps) {
  const [formData, setFormData] = useState<Monster>(monster);

  const updateField = <K extends keyof Monster>(
    field: K,
    value: Monster[K],
  ) => {
    setFormData((prev: Monster) => ({ ...prev, [field]: value }));
  };

  const handleHPChange = (delta: number) => {
    const newHP = Math.max(0, Math.min(formData.maxHp, formData.hp + delta));
    updateField("hp", newHP);
  };

  const handleTempHPChange = (delta: number) => {
    const newTempHP = Math.max(0, formData.tempHp + delta);
    updateField("tempHp", newTempHP);
  };

  const handleSpellSlotChange = (level: keyof SpellSlots, delta: number) => {
    if (!formData.spellSlots) return;
    const current = formData.spellSlots[level]?.current ?? 0;
    const max = formData.spellSlots[level]?.max ?? 0;
    const newValue =
      current === delta ? 0 : Math.max(0, Math.min(current + delta, max));
    updateField("spellSlots", {
      ...formData.spellSlots,
      [level]: { current: newValue, max },
    });
  };

  const handleLegendaryActionUse = (delta: number) => {
    if (!formData.legendary_actions_pool) return;
    const current = formData.legendary_actions_pool.current ?? 0;
    const max = formData.legendary_actions_pool.max ?? 0;
    const newValue =
      current === delta ? 0 : Math.max(0, Math.min(current + delta, max));
    updateField("legendary_actions_pool", { current: newValue, max });
  };

  const handleLegendaryResistanceUse = (delta: number) => {
    if (!formData.legendary_resistances) return;
    const current = formData.legendary_resistances.current ?? 0;
    const max = formData.legendary_resistances.max ?? 0;
    const newValue =
      current === delta ? 0 : Math.max(0, Math.min(current + delta, max));
    updateField("legendary_resistances", { current: newValue, max });
  };

  const addModifier = () => {
    updateField("modifiers", [
      ...formData.modifiers,
      { label: "", value: 0, source: { who: "", what: "" } },
    ]);
  };

  const removeModifier = (index: number) => {
    updateField(
      "modifiers",
      formData.modifiers.filter((_, i) => i !== index),
    );
  };

  const updateModifier = (
    index: number,
    updates: Partial<Monster["modifiers"][0]>,
  ) => {
    updateField(
      "modifiers",
      formData.modifiers.map((mod, i) =>
        i === index ? { ...mod, ...updates } : mod,
      ),
    );
  };

  const handleStatusChange = (status: "alive" | "unconscious" | "dead") => {
    updateField("status", status);
  };

  const addCondition = (condition: string) => {
    if (!formData.conditions.includes(condition as any)) {
      updateField("conditions", [...formData.conditions, condition as any]);
    }
  };

  const removeCondition = (condition: string) => {
    updateField(
      "conditions",
      formData.conditions.filter((c) => c !== condition),
    );
  };

  const handleSave = () => {
    const { id, ...monsterWithoutId } = formData;
    onSave(monsterWithoutId);
  };

  return (
    <div className="min-h-screen bg-background parchment-texture pb-12">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-start w-auto">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="text-xl">
                <h2 className="font-sans text-2xl font-bold">
                  {formData.name}
                </h2>
                <p className="font-serif text-muted-foreground text-lg">
                  {formData.type} - ND {formData.challenge_rating}
                </p>
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="default"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="metal-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Pontos de Vida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHPChange(-5)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="text-center min-w-[100px]">
                      <p className="text-4xl font-bold">{formData.hp}</p>
                      {formData.tempHp > 0 && (
                        <p className="text-lg text-primary font-bold">
                          +{formData.tempHp}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHPChange(5)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {formData.hp} / {formData.maxHp}
                </div>
              </CardContent>
            </Card>

            <Card className="metal-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={
                      formData.status === "alive" ? "default" : "outline"
                    }
                    onClick={() => handleStatusChange("alive")}
                  >
                    Vivo
                  </Button>
                  <Button
                    variant={
                      formData.status === "unconscious" ? "default" : "outline"
                    }
                    onClick={() => handleStatusChange("unconscious")}
                  >
                    Inconsciente
                  </Button>
                  <Button
                    variant={
                      formData.status === "dead" ? "destructive" : "outline"
                    }
                    onClick={() => handleStatusChange("dead")}
                  >
                    Morto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {formData.spellSlots && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Slots de Magia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(formData.spellSlots).map(([level, slots]) => (
                    <div
                      key={level}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono">Nível {level}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSpellSlotChange(parseInt(level) as keyof SpellSlots, -1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="min-w-[60px] text-center">
                          {slots.current} / {slots.max}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSpellSlotChange(parseInt(level) as keyof SpellSlots, 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {formData.legendary_actions_pool && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Ações Lendárias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {formData.legendary_actions_pool.current} /{" "}
                      {formData.legendary_actions_pool.max}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleLegendaryActionUse(-1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleLegendaryActionUse(1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.legendary_resistances && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Resistências Lendárias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {formData.legendary_resistances.current} /{" "}
                      {formData.legendary_resistances.max}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleLegendaryResistanceUse(-1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleLegendaryResistanceUse(1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="metal-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg">
                    Modificadores
                  </CardTitle>
                  <Button variant="secondary" size="sm" onClick={addModifier}>
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.modifiers.map((modifier, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={modifier.label}
                        onChange={(e) =>
                          updateModifier(index, { label: e.target.value })
                        }
                        placeholder="Nome do modificador"
                        className="font-body"
                      />
                      <Input
                        type="number"
                        value={modifier.value}
                        onChange={(e) =>
                          updateModifier(index, {
                            value: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Valor"
                        className="font-body w-24"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeModifier(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {formData.modifiers.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    Nenhum modificador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 bg-card/50 rounded-lg ">
            <Card className="metal-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => updateField("type", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="challenge_rating">ND</Label>
                    <Input
                      id="challenge_rating"
                      type="number"
                      min="0"
                      step="0.125"
                      value={formData.challenge_rating}
                      onChange={(e) =>
                        updateField(
                          "challenge_rating",
                          Number.parseFloat(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alignment">Alinhamento</Label>
                    <Input
                      id="alignment"
                      value={formData.alignment || ""}
                      onChange={(e) => updateField("alignment", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho</Label>
                  <select
                    id="size"
                    value={formData.size}
                    onChange={(e) => updateField("size", e.target.value)}
                    className="w-full bg-card border rounded-md px-3 py-2"
                  >
                    <option value="Tiny">Minúsculo</option>
                    <option value="Small">Pequeno</option>
                    <option value="Medium">Médio</option>
                    <option value="Large">Grande</option>
                    <option value="Huge">Enorme</option>
                    <option value="Gargantuan">Gigantesco</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="metal-border bg-card">
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Atributos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { key: "str", label: "FOR", value: formData.attributes?.str },
                    {
                      key: "dex",
                      label: "DES",
                      value: formData.attributes?.dex,
                    },
                    {
                      key: "con",
                      label: "CON",
                      value: formData.attributes?.con,
                    },
                    {
                      key: "int",
                      label: "INT",
                      value: formData.attributes?.int,
                    },
                    { key: "wis", label: "SAB", value: formData.attributes?.wis },
                    { key: "cha", label: "CAR", value: formData.attributes?.cha },
                  ].map(({ key, label, value }) => (
                    <div key={key} className="text-center space-y-1">
                      <Label htmlFor={key} className="text-sm font-mono">
                        {label}
                      </Label>
                      <Input
                        id={key}
                        type="number"
                        min="1"
                        max="30"
                        value={value}
                        onChange={(e) =>
                          updateField("attributes", {
                            ...formData.attributes,
                            [key]: Number.parseInt(e.target.value) || 10,
                          })
                        }
                        className="font-body text-center"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {formData.special_abilities.length > 0 && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Habilidades Especiais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.special_abilities.map((ability, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-md"
                    >
                      <p className="font-semibold">{ability.name}</p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {ability.desc}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {formData.actions.length > 0 && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.actions.map((action, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-md"
                    >
                      <p className="font-semibold">{action.name}</p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {action.desc}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {formData.legendary_actions.length > 0 && (
              <Card className="metal-border bg-card">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">
                    Ações Lendárias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.legendary_actions.map((action, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-md"
                    >
                      <p className="font-semibold">{action.name}</p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {action.desc}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <div className="bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="container mx-auto flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="glow-silver">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
