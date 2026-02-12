import type { Player } from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons";
import { Plus, Minus } from "lucide-react";
import HPModal from "@/components/hp-modal";
import { getHPBackgroundColor, getHPColor } from "@/lib/utils/player-utils";

interface PlayerHPSectionProps {
  player: Player;
  onHPChange: (delta: number) => void;
  onHPModal: (amount: number) => void;
}

export default function PlayerHPSection({ player, onHPChange, onHPModal }: PlayerHPSectionProps) {
  return (
    <Card
      className={`metal-border ${getHPBackgroundColor(
        player.hp,
        player.maxHp,
      )}`}
    >
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <ShieldIcon className="w-6 h-6" />
          Pontos de Vida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onHPChange(-5)}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p
              className={`text-6xl font-bold ${getHPColor(
                player.hp,
                player.maxHp,
              )}`}
            >
              {player.hp}
            </p>
            <p className="text-sm text-muted-foreground">
              / {player.maxHp}
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onHPChange(5)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <HPModal player={player} onApply={onHPModal} />
      </CardContent>
    </Card>
  );
}
