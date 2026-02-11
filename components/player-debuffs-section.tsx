import type { Player, Buff } from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import AddDebuffDialog from "@/components/add-debuff-dialog";

interface PlayerDebuffsSectionProps {
  player: Player;
  onAddDebuff: (debuff: Buff) => void;
  onRemoveDebuff: (index: number) => void;
}

export function PlayerDebuffsSection({ player, onAddDebuff, onRemoveDebuff }: PlayerDebuffsSectionProps) {
  return (
    <Card className="metal-border bg-destructive/10 border-destructive/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-sans text-lg text-destructive">
            Debuffs
          </CardTitle>
          <AddDebuffDialog onAdd={onAddDebuff} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!player.debuffs || player.debuffs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum debuff ativo
            </p>
          ) : (
            player.debuffs.map((debuff, index) => (
              <div
                key={index}
                className="bg-card/50 p-3 rounded text-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-destructive">
                      {debuff.name}
                    </p>
                    {debuff.description && (
                      <p className="text-muted-foreground text-xs">
                        {debuff.description}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      <span className="text-muted-foreground">
                        Origem:
                      </span>{" "}
                      {debuff.source}
                    </p>
                    {debuff.duration && (
                      <p className="text-xs">
                        <span className="text-muted-foreground">
                          Duração:
                        </span>{" "}
                        {debuff.duration}
                      </p>
                    )}
                    <p className="text-xs text-destructive">
                      {debuff.affects.effect}: {debuff.affects.amount}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveDebuff(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
