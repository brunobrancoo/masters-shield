import type { Player, Buff } from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import AddBuffDialog from "@/components/add-buff-dialog";

interface PlayerBuffsSectionProps {
  player: Player;
  onAddBuff: (buff: Buff) => void;
  onRemoveBuff: (index: number) => void;
}

export default function PlayerBuffsSection({ player, onAddBuff, onRemoveBuff }: PlayerBuffsSectionProps) {
  return (
    <Card className="metal-border bg-primary/10 border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-sans text-lg text-primary">
            Buffs
          </CardTitle>
          <AddBuffDialog onAdd={onAddBuff} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!player.buffs || player.buffs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum buff ativo
            </p>
          ) : (
            player.buffs.map((buff, index) => (
              <div
                key={index}
                className="bg-card/50 p-3 rounded text-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-primary">
                      {buff.name}
                    </p>
                    {buff.description && (
                      <p className="text-muted-foreground text-xs">
                        {buff.description}
                      </p>
                    )}
                    <p className="text-xs mt-1">
                      <span className="text-muted-foreground">
                        Origem:
                      </span>{" "}
                      {buff.source}
                    </p>
                    {buff.duration && (
                      <p className="text-xs">
                        <span className="text-muted-foreground">
                          Duração:
                        </span>{" "}
                        {buff.duration}
                      </p>
                    )}
                    <p className="text-xs text-primary">
                      {buff.affects.effect}: +{buff.affects.amount}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveBuff(index)}
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
