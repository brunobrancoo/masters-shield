"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateId } from "@/lib/storage";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateAttributes } from "@/lib/dice";
import { Attributes, Player, attributeKeys } from "@/lib/interfaces/interfaces";

const playerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  race: z.string().min(1, "Raça obrigatória"),
  class: z.string().min(1, "Classe obrigatória"),
  level: z.coerce.number().min(1, "Nível deve ser pelo menos 1"),
  hp: z.coerce.number().min(1, "HP deve ser pelo menos 1"),
  attributes: z.object({
    for: z.coerce.number().min(1).max(30),
    des: z.coerce.number().min(1).max(30),
    con: z.coerce.number().min(1).max(30),
    int: z.coerce.number().min(1).max(30),
    sab: z.coerce.number().min(1).max(30),
    car: z.coerce.number().min(1).max(30),
  }),
  inventory: z.array(z.object({ value: z.string().min(1) })).default([]),
  notes: z.string().default(""),
});

type PlayerFormData = z.infer<typeof playerSchema>;

interface PlayerFormProps {
  player?: Player;
  onSaveAction: (player: Player) => void;
  onCancelAction: () => void;
}

export function PlayerForm({
  player,
  onSaveAction,
  onCancelAction,
}: PlayerFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: player
      ? {
          ...player,
          inventory: player.inventory.map((item) => ({ value: item })),
        }
      : {
          name: "",
          race: "",
          class: "",
          level: 1,
          hp: 10,
          attributes: {
            for: 10,
            des: 10,
            con: 10,
            int: 10,
            sab: 10,
            car: 10,
          },
          inventory: [],
          notes: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  useEffect(() => {
    if (player) {
      reset({
        ...player,
        inventory: player.inventory.map((item) => ({ value: item })),
      });
    }
  }, [player, reset]);

  const onSubmit = (data: PlayerFormData) => {
    onSaveAction({
      id: player?.id || generateId(),
      ...data,
      inventory: data.inventory.map((item) => item.value),
      notes: data.notes || "",
      items: [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="parchment-texture metal-border">
        <CardHeader>
          <CardTitle className="font-sans text-2xl">
            {player ? "Editar Jogador" : "Novo Jogador"}
          </CardTitle>
          <CardDescription className="font-serif">
            Preencha a ficha do personagem
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className="bg-card" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="race">Raça</Label>
              <Input
                id="race"
                placeholder="Ex: Humano, Elfo, Anão"
                className="bg-card"
                {...register("race")}
              />
              {errors.race && (
                <p className="text-red-500 text-sm">{errors.race.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="class">Classe</Label>
              <Input
                id="class"
                placeholder="Ex: Guerreiro, Mago, Ladino"
                className="bg-card"
                {...register("class")}
              />
              {errors.class && (
                <p className="text-red-500 text-sm">{errors.class.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="level">Nível</Label>
              <Input
                id="level"
                type="number"
                min="1"
                className="bg-card"
                {...register("level")}
              />
            </div>

            <div>
              <Label htmlFor="hp">Pontos de Vida</Label>
              <Input
                id="hp"
                type="number"
                min="1"
                className="bg-card"
                {...register("hp")}
              />
            </div>
          </div>

          {/* Attributes */}
          <div>
            <div className="flex justify-between">
              <Label className="font-sans mb-3 block">Atributos</Label>
              <Button
                type="button"
                onClick={() => {
                  const genAtt = generateAttributes();
                  console.log(attributeKeys);

                  const attributes = attributeKeys.reduce((acc, key, index) => {
                    acc[key] = genAtt[index]?.result ?? 0;
                    return acc;
                  }, {} as Attributes);

                  setValue("attributes", attributes);
                }}
              >
                Rolar atributos
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(["for", "des", "con", "int", "sab", "car"] as const).map(
                (key) => (
                  <div key={key}>
                    <Label className="text-xs uppercase">{key}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      className="text-center bg-card"
                      {...register(`attributes.${key}`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.attributes?.[key] && (
                      <p className="text-red-500 text-xs">
                        {errors.attributes[key]?.message}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-2">
            <Label className="font-sans">Inventário</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite um item"
                id="newItem"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      append({ value });
                      input.value = "";
                    }
                  }
                }}
                className="bg-card"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const input = document.getElementById(
                    "newItem",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    append({ value: input.value.trim() });
                    input.value = "";
                  }
                }}
              >
                Adicionar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {fields.map((field, index) => (
                <Badge
                  key={field.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => remove(index)}
                >
                  {field.value} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              rows={4}
              className="bg-card"
              {...register("notes")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancelAction}>
              Cancelar
            </Button>
            <Button type="submit" className="glow-silver">
              Salvar Jogador
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
