"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/lib/storage"
import { generateId } from "@/lib/storage"

interface PlayerFormProps {
  player?: Player
  onSave: (player: Player) => void
  onCancel: () => void
}

export function PlayerForm({ player, onSave, onCancel }: PlayerFormProps) {
  const [formData, setFormData] = useState<Omit<Player, "id">>({
    name: player?.name || "",
    race: player?.race || "",
    class: player?.class || "",
    level: player?.level || 1,
    hp: player?.hp || 10,
    attributes: player?.attributes || { for: 10, des: 10, con: 10, int: 10, sab: 10, car: 10 },
    inventory: player?.inventory || [],
    notes: player?.notes || "",
  })

  const [currentItem, setCurrentItem] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: player?.id || generateId(),
      ...formData,
    })
  }

  const addItem = () => {
    if (currentItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        inventory: [...prev.inventory, currentItem.trim()],
      }))
      setCurrentItem("")
    }
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="parchment-texture metal-border">
        <CardHeader>
          <CardTitle className="font-sans text-2xl">{player ? "Editar Jogador" : "Novo Jogador"}</CardTitle>
          <CardDescription className="font-serif">Preencha a ficha do personagem</CardDescription>
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
              <Label htmlFor="race" className="font-sans">
                Raça
              </Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => setFormData((prev) => ({ ...prev, race: e.target.value }))}
                placeholder="Ex: Humano, Elfo, Anão"
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="font-sans">
                Classe
              </Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
                placeholder="Ex: Guerreiro, Mago, Ladino"
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
            <Label className="font-sans">Inventário</Label>
            <div className="flex gap-2">
              <Input
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                placeholder="Digite um item"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem()
                  }
                }}
                className="bg-card"
              />
              <Button type="button" onClick={addItem} variant="secondary">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.inventory.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeItem(index)}
                >
                  {item} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-sans">
              Anotações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Histórico, objetivos, notas importantes..."
              rows={4}
              className="bg-card font-serif"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-silver">
              Salvar Jogador
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
