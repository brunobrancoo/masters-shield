"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DragonIcon, SwordIcon, ShieldIcon, ScrollIcon } from "@/components/icons"
import { calculateModifier } from "@/lib/utils-dnd"
import type { Monster } from "@/lib/storage"

interface MonsterSheetProps {
  monster: Monster
  onSave: (monster: Monster) => void
  onDelete: () => void
  onClose: () => void
}

export function MonsterSheet({ monster, onSave, onDelete, onClose }: MonsterSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Monster>(monster)
  const [skillInput, setSkillInput] = useState("")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setIsEditing(false)
  }

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    })
  }

  const updateAttribute = (attr: keyof Monster["attributes"], value: number) => {
    setFormData({
      ...formData,
      attributes: { ...formData.attributes, [attr]: value },
    })
  }

  if (!isEditing) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto parchment-texture metal-border glow-gold">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="font-sans text-3xl text-balance flex items-center gap-3">
                  <DragonIcon className="w-8 h-8 text-primary" />
                  {monster.name}
                </CardTitle>
                <CardDescription className="font-serif text-base mt-2">
                  <Badge variant="secondary" className="text-sm">
                    {monster.type}
                  </Badge>
                  <span className="ml-3 text-muted-foreground">Nível {monster.level}</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <span className="sr-only">Fechar</span>×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <ShieldIcon className="w-8 h-8 mx-auto mb-2 text-destructive" />
                    <p className="text-sm text-muted-foreground font-sans">Pontos de Vida</p>
                    <p className="text-3xl font-bold text-destructive">{monster.hp}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <SwordIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground font-sans">Nível de Desafio</p>
                    <p className="text-3xl font-bold text-primary">{monster.level}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-sans text-xl mb-4 flex items-center gap-2">
                <ScrollIcon className="w-5 h-5" />
                Atributos
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(monster.attributes).map(([key, value]) => (
                  <Card key={key} className="bg-card">
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="text-xs uppercase font-sans text-muted-foreground mb-1">{key}</p>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-sm text-primary font-mono">{calculateModifier(value)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {monster.skills.length > 0 && (
              <div>
                <h3 className="font-sans text-xl mb-3 flex items-center gap-2">
                  <SwordIcon className="w-5 h-5" />
                  Habilidades Especiais
                </h3>
                <div className="space-y-2">
                  {monster.skills.map((skill, index) => (
                    <Card key={index} className="bg-secondary/20">
                      <CardContent className="p-4">
                        <p className="font-serif leading-relaxed">{skill}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {monster.notes && (
              <div>
                <h3 className="font-sans text-xl mb-3">Notas do Mestre</h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <p className="font-serif leading-relaxed text-pretty">{monster.notes}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto parchment-texture metal-border glow-gold">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="font-sans text-2xl">Editar Monstro</CardTitle>
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="font-serif"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="font-serif"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number.parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hp">Pontos de Vida</Label>
                <Input
                  id="hp"
                  type="number"
                  min="1"
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: Number.parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="font-sans text-lg mb-3">Atributos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(["for", "des", "con", "int", "sab", "car"] as const).map((attr) => (
                  <div key={attr} className="space-y-2">
                    <Label htmlFor={attr} className="uppercase text-xs">
                      {attr}
                    </Label>
                    <Input
                      id={attr}
                      type="number"
                      min="1"
                      max="30"
                      value={formData.attributes[attr]}
                      onChange={(e) => updateAttribute(attr, Number.parseInt(e.target.value) || 10)}
                      required
                    />
                    <p className="text-sm text-primary font-mono text-center">
                      Mod: {calculateModifier(formData.attributes[attr])}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Habilidades Especiais</Label>
              <div className="space-y-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={skill} readOnly className="font-serif flex-1" />
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveSkill(index)}>
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
                        e.preventDefault()
                        handleAddSkill()
                      }
                    }}
                    className="font-serif flex-1"
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas do Mestre</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="font-serif"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="glow-silver">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
