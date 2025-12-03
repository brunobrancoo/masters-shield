"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ShieldIcon, SwordIcon, ScrollIcon } from "@/components/icons";
import { DialogTitle } from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { Player } from "@/lib/interfaces/interfaces";

interface PlayerSheetProps {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PlayerSheet({
  player,
  onEdit,
  onDelete,
  onClose,
}: PlayerSheetProps) {
  const calculateModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  return (
    <DialogContent
      className="min-w-3xl max-h-[90vh] overflow-y-auto parchment-texture metal-border glow-gold p-0"
      showCloseButton={false}
    >
      <DialogTitle className="hidden" />
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="font-sans text-3xl flex items-center gap-3">
                <ShieldIcon className="w-8 h-8 text-primary" />
                {player.name}
              </CardTitle>
              <CardDescription className="font-serif text-base mt-2">
                {player.race} {player.class} -{" "}
                <span className="text-primary font-bold">
                  Nível {player.level}
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* HP */}
          <Card className="bg-destructive/10 border-destructive/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <ShieldIcon className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-muted-foreground font-sans">
                  Pontos de Vida
                </p>
                <p className="text-4xl font-bold text-destructive">
                  {player.hp}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          <div>
            <h3 className="font-sans text-xl mb-4 flex items-center gap-2">
              <ScrollIcon className="w-5 h-5" />
              Atributos
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(player.attributes).map(([key, value]) => (
                <Card key={key} className="bg-card">
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="text-xs uppercase font-sans text-muted-foreground mb-1">
                      {key}
                    </p>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-primary font-mono">
                      {calculateModifier(value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Inventory */}
          {player.inventory.length > 0 && (
            <div>
              <h3 className="font-sans text-xl mb-3 flex items-center gap-2">
                <SwordIcon className="w-5 h-5" />
                Inventário
              </h3>
              <Card className="bg-secondary/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {player.inventory.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded bg-card"
                      >
                        <span className="text-primary">•</span>
                        <span className="font-serif">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notes */}
          {player.notes && (
            <div>
              <h3 className="font-sans text-xl mb-3">Anotações</h3>
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <p className="font-serif leading-relaxed text-pretty">
                    {player.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );
}
