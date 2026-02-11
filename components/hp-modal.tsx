"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { Player } from "@/lib/interfaces/interfaces";

interface HPModalProps {
  player: Player;
  onApply: (amount: number) => void;
}

export default function HPModal({ player, onApply }: HPModalProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const amount = parseInt(value);
    if (!isNaN(amount)) {
      onApply(amount);
      setValue("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <Edit className="w-4 h-4 mr-2" />
          Editar HP Personalizado
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Pontos de Vida</DialogTitle>
          <DialogDescription>
            Digite um valor positivo para curar ou negativo para causar dano.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="hp-amount">Valor (use - para dano)</Label>
            <Input
              id="hp-amount"
              type="number"
              placeholder="Ex: 10 ou -5"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-card"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            HP atual:{" "}
            <span className="font-bold text-destructive">{player.hp}</span> /{" "}
            {player.maxHp}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
