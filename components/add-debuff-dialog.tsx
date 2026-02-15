"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Buff } from "@/lib/schemas";
import { buffSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";

interface AddDebuffDialogProps {
  onAdd: (buff: Buff) => void;
}

export default function AddDebuffDialog({ onAdd }: AddDebuffDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Buff>({
    resolver: zodResolver(buffSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      source: "",
      affects: { effect: "", amount: 0 },
    },
  });

  const onSubmit = (data: Buff) => {
    onAdd(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Debuff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="debuff-name">Nome *</Label>
              <Input
                id="debuff-name"
                {...register("name")}
                className="bg-card"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="debuff-description">Descrição</Label>
              <Textarea
                id="debuff-description"
                rows={2}
                {...register("description")}
                className="bg-card"
              />
            </div>
            <div>
              <Label htmlFor="debuff-source">Origem</Label>
              <Input
                id="debuff-source"
                {...register("source")}
                className="bg-card"
              />
            </div>
            <div>
              <Label htmlFor="debuff-duration">Duração</Label>
              <Input
                id="debuff-duration"
                {...register("duration")}
                className="bg-card"
                placeholder="Ex: 1 hora, até descanso curto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="debuff-effect">Efeito *</Label>
                <Input
                  id="debuff-effect"
                  {...register("affects.effect")}
                  className="bg-card"
                  placeholder="Ex: ac, strength"
                />
                {errors.affects?.effect && (
                  <p className="text-red-500 text-xs">
                    {errors.affects.effect.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="debuff-amount">Valor *</Label>
                <Input
                  id="debuff-amount"
                  type="number"
                  {...register("affects.amount", { valueAsNumber: true })}
                  className="bg-card"
                />
                {errors.affects?.amount && (
                  <p className="text-red-500 text-xs">
                    {errors.affects.amount.message}
                  </p>
                )}
              </div>
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
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
