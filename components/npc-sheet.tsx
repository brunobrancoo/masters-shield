"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SparklesIcon,
  SwordIcon,
  ScrollIcon,
  ShieldIcon,
} from "@/components/icons";
import { calculateModifier, recalculateHP } from "@/lib/utils-dnd";
import { NPC } from "@/lib/schemas";
import { getArchetype, getHPColor, getHPClass } from "@/lib/theme";

interface NPCSheetProps {
  npc: NPC;
  onSave: (npc: NPC) => void;
  onDelete: () => void;
  onClose: () => void;
  npcIsOpen: boolean;
  onNPCOpen: () => void;
  onNPCClose: () => void;
  onNPCToggle: () => void;
}

export function NPCSheet({
  npc,
  onSave,
  onDelete,
  onClose,
  npcIsOpen,
  onNPCOpen,
  onNPCClose,
  onNPCToggle,
}: NPCSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NPC>(npc);
  const [skillInput, setSkillInput] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const updateAttribute = (attr: keyof NPC["attributes"], value: number) => {
    setFormData({
      ...formData,
      attributes: { ...formData.attributes, [attr]: value },
    });
  };

  const handleRecalculateHP = () => {
    const newHP = recalculateHP(
      formData.level,
      formData.attributes.con,
      formData.class,
      formData.maxHp,
    );
    setFormData({ ...formData, maxHp: newHP, hp: newHP });
  };

  const archetype = getArchetype(npc.class);
  const hpPercentage = npc.maxHp ? (npc.hp / npc.maxHp) * 100 : 100;
  const hpColor = getHPColor(hpPercentage);
  const hpClass = getHPClass(hpPercentage);

  if (!isEditing) {
    return (
      <div
        className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        data-archetype={archetype}
      >
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto texture-parchment">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="font-heading text-3xl text-balance flex items-center gap-3 text-text-primary">
                  <SparklesIcon className="w-8 h-8 text-class-accent" />
                  {npc.name}
                </CardTitle>
                <CardDescription className="font-body text-base mt-2 text-text-secondary">
                  {npc.race} {npc.class} -{" "}
                  <span className="text-class-accent font-bold">
                    Nível {npc.level}
                  </span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <span className="sr-only">Fechar</span>×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className={`card-inset ${hpClass}`}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <ShieldIcon
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: hpColor }}
                  />
                  <p className="section-label mb-2">Pontos de Vida</p>
                  <p
                    className="text-4xl font-bold font-body"
                    style={{ color: hpColor }}
                  >
                    {npc.hp}
                    {npc.maxHp && npc.maxHp !== npc.hp && (
                      <span className="text-lg text-text-tertiary ml-2">
                        / {npc.maxHp}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="font-heading text-xl mb-4 flex items-center gap-2 text-text-primary">
                <ScrollIcon className="w-5 h-5 text-class-accent" />
                Atributos
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(npc.attributes).map(([key, value]) => (
                  <Card key={key} className="card-inset">
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="section-label mb-1">{key}</p>
                      <p className="text-2xl font-bold font-body text-text-primary">
                        {value}
                      </p>
                      <p className="text-sm text-class-accent font-mono font-medium">
                        {calculateModifier(value)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {npc.skills.length > 0 && (
              <div>
                <h3 className="font-heading text-xl mb-3 flex items-center gap-2 text-text-primary">
                  <SwordIcon className="w-5 h-5 text-class-accent" />
                  Habilidades
                </h3>
                <div className="space-y-2">
                  {npc.skills.map((skill, index) => (
                    <Card key={index} className="card-inset">
                      <CardContent className="p-4">
                        <p className="font-body leading-relaxed text-text-primary">
                          {skill}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-heading text-xl mb-3 text-text-primary">
                Personalidade
              </h3>
              <Card className="card-inset">
                <CardContent className="p-4">
                  <p className="font-handwritten leading-relaxed text-pretty text-text-primary">
                    {npc.personality}
                  </p>
                </CardContent>
              </Card>
            </div>

            {npc.notes && (
              <div>
                <h3 className="font-heading text-xl mb-3 text-text-primary">
                  Notas
                </h3>
                <Card className="card-inset">
                  <CardContent className="p-4">
                    <p className="font-body leading-relaxed text-pretty text-text-primary">
                      {npc.notes}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-border-default">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Excluir NPC
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      data-archetype={archetype}
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto texture-parchment">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-heading text-2xl text-text-primary">
              Editar NPC
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <span className="sr-only">Fechar</span>×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="race">Raça</Label>
                <Input
                  id="race"
                  value={formData.race}
                  onChange={(e) =>
                    setFormData({ ...formData, race: e.target.value })
                  }
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) =>
                    setFormData({ ...formData, class: e.target.value })
                  }
                  className="font-body"
                  required
                />
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="hp">Pontos de Vida</Label>
                <Input
                  id="hp"
                  type="number"
                  min="1"
                  value={formData.maxHp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxHp: Number.parseInt(e.target.value) || 1,
                      hp: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleRecalculateHP}
              >
                Recalcular HP
              </Button>
            </div>

            <div>
              <h3 className="font-heading text-lg mb-3 text-text-primary">
                Atributos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(["str", "dex", "con", "int", "wis", "cha"] as const).map(
                  (attr) => (
                    <div key={attr} className="space-y-2">
                      <Label htmlFor={attr} className="section-label">
                        {attr}
                      </Label>
                      <Input
                        id={attr}
                        type="number"
                        min="1"
                        max="30"
                        value={formData.attributes[attr]}
                        onChange={(e) =>
                          updateAttribute(
                            attr,
                            Number.parseInt(e.target.value) || 10,
                          )
                        }
                        required
                      />
                      <p className="text-sm text-class-accent font-mono text-center font-medium">
                        Mod: {calculateModifier(formData.attributes[attr])}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div>
              <Label>Habilidades</Label>
              <div className="space-y-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      readOnly
                      className="font-body flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova habilidade..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="font-body flex-1"
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Personalidade</Label>
              <Textarea
                id="personality"
                value={formData.personality}
                onChange={(e) =>
                  setFormData({ ...formData, personality: e.target.value })
                }
                rows={3}
                className="font-handwritten"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="font-body"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border-default">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="divine">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
