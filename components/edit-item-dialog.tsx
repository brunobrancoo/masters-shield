"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@/lib/interfaces/interfaces";
import { ItemFormData, itemSchema } from "@/lib/schemas";

interface EditItemDialogProps {
  item: Item;
  index: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: (index: number, item: Item) => void;
}

export default function EditItemDialog({
  item,
  index,
  open,
  setOpen,
  onUpdate,
}: EditItemDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      type: item.type,
      distance: item.distance,
      damage: item.damage,
      magic: item.magic,
      attackbonus: item.attackbonus,
      defensebonus: item.defensebonus,
      notes: item.notes,
      equipped: item.equipped,
    },
  });

  useEffect(() => {
    reset({
      name: item.name,
      price: item.price,
      type: item.type,
      distance: item.distance,
      damage: item.damage,
      magic: item.magic,
      attackbonus: item.attackbonus,
      defensebonus: item.defensebonus,
      notes: item.notes,
      equipped: item.equipped,
    });
  }, [item, reset]);

  const onSubmit = (data: ItemFormData) => {
    onUpdate(index, data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-item-name">Nome *</Label>
                <Input
                  id="edit-item-name"
                  {...register("name")}
                  className="bg-card"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-item-type">Tipo</Label>
                <Input
                  id="edit-item-type"
                  {...register("type")}
                  className="bg-card"
                  placeholder="Tipo de equipamento"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-item-price">Preço (gp)</Label>
                <Input
                  id="edit-item-price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  className="bg-card"
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-item-magic"
                  className="flex items-center gap-2"
                >
                  <input type="checkbox" {...register("magic")} />
                  Item Mágico
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-item-attackbonus">Bônus de Ataque</Label>
                <Input
                  id="edit-item-attackbonus"
                  type="number"
                  {...register("attackbonus", { valueAsNumber: true })}
                  className="bg-card"
                />
              </div>
              <div>
                <Label htmlFor="edit-item-defensebonus">Bônus de Defesa</Label>
                <Input
                  id="edit-item-defensebonus"
                  type="number"
                  {...register("defensebonus", { valueAsNumber: true })}
                  className="bg-card"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-item-distance">Distância</Label>
                <Input
                  id="edit-item-distance"
                  {...register("distance")}
                  className="bg-card"
                  placeholder="melee, ranged, 10ft..."
                />
              </div>
              <div>
                <Label htmlFor="edit-damage-dice">Dados de Dano</Label>
                <Input
                  id="edit-damage-dice"
                  type="number"
                  {...register("damage.dice", { valueAsNumber: true })}
                  className="bg-card"
                />
              </div>
              <div>
                <Label htmlFor="edit-damage-number">Valor do Dado</Label>
                <Input
                  id="edit-damage-number"
                  type="number"
                  {...register("damage.number", { valueAsNumber: true })}
                  className="bg-card"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-damage-type">Tipo de Dano</Label>
              <Input
                id="edit-damage-type"
                {...register("damage.type")}
                className="bg-card"
                placeholder="Ex: corte, fogo"
              />
            </div>
            <div>
              <Label htmlFor="edit-item-notes">Notas</Label>
              <Textarea
                id="edit-item-notes"
                rows={2}
                {...register("notes")}
                className="bg-card"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
