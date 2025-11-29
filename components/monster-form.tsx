"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Monster } from "@/lib/storage"
import { generateId } from "@/lib/storage"

interface MonsterFormProps {
  monster?: Monster
  onSave: (monster: Monster) => void
  onCancel: () => void
}

export function MonsterForm({ monster, onSave, onCancel }: MonsterFormProps) {
  const [formData, setFormData] = useState<Omit<Monster, "id">>({
    name: monster?.name || "",
    type: monster?.type || "",
    level: monster?.level || 1,
    hp: monster?.hp || 10,
    attributes: monster?.attributes || { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    skills: monster?.skills || [],
    notes: monster?.notes || "",
  })

  const [currentSkill, setCurrentSkill] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: monster?.id || generateId(),
      ...formData,
    })
  }

  const addSkill = () => {
    if (currentSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="parchment-texture metal-border">
        <CardHeader>
          <CardTitle className="font-sans text-2xl">{monster ? "Editar Monstro" : "Novo Monstro"}</CardTitle>
          <CardDescription className="font-serif">Preencha as informações da criatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-sans">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="font-sans">
                Tipo
              </Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="Ex: Humanoide, Morto-vivo, Dragão"
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="font-sans">
                Nível
              </Label>
              <Input
                id="level"
                type="number"
                min="1"
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hp" className="font-sans">
                Pontos de Vida
              </Label>
              <Input
                id="hp"
                type="number"
                min="1"
                value={formData.hp}
                onChange={(e) => setFormData((prev) => ({ ...prev, hp: Number.parseInt(e.target.value) }))}
                required
                className="bg-card"
              />
            </div>
          </div>

          <div>
            <Label className="font-sans mb-3 block">Atributos</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(formData.attributes).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key} className="text-xs uppercase font-sans">
                    {key.toUpperCase()}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="1"
                    max="30"
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        attributes: {
                          ...prev.attributes,
                          [key]: Number.parseInt(e.target.value),
                        },
                      }))
                    }
                    className="bg-card text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-sans">Habilidades</Label>
            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Digite uma habilidade"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                className="bg-card"
              />
              <Button type="button" onClick={addSkill} variant="secondary">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSkill(index)}
                >
                  {skill} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-sans">
              Notas
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Informações adicionais sobre o monstro..."
              rows={4}
              className="bg-card font-serif"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-silver">
              Salvar Monstro
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
