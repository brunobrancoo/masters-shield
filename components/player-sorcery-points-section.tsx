import type { Player } from "@/lib/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiceIcon } from "@/components/icons";
import { Flame } from "lucide-react";

interface PlayerSorceryPointsSectionProps {
  player: Player;
  onSorceryPointChange: (value: number) => void;
}

export default function PlayerSorceryPointsSection({ player, onSorceryPointChange }: PlayerSorceryPointsSectionProps) {
  return (
    <Card className="metal-border bg-purple-500/10 border-purple-500/30">
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <DiceIcon className="w-6 h-6 text-purple-500" />
          Pontos de Feitiçaria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: player.maxSorceryPoints }).map(
            (_, idx) => {
              const isActive = idx < player.sorceryPoints;
              return (
                <button
                  key={idx}
                  onClick={() => onSorceryPointChange(idx + 1)}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-purple-500 text-purple-50 border-purple-500"
                      : "bg-transparent border-purple-500/30 hover:bg-purple-500/10"
                  }`}
                >
                  <Flame className="w-6 h-6" />
                </button>
              );
            },
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          {player.sorceryPoints} / {player.maxSorceryPoints} pontos
        </p>
      </CardContent>
    </Card>
  );
}
