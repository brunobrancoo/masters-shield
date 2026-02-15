import type { PlayableCharacter } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldIcon } from "@/components/icons";
import { Plus, Minus } from "lucide-react";
import HPModal from "@/components/hp-modal";
import { getHPBackgroundColor, getHPColor } from "@/lib/utils/player-utils";

interface PlayerHPSectionProps {
  playableCharacter: PlayableCharacter;
  onHPChange: (delta: number) => void;
  onHPModal: (amount: number) => void;
}

export default function PlayerHPSection({
  playableCharacter,
  onHPChange,
  onHPModal,
}: PlayerHPSectionProps) {
  return (
    <Card
      className={`metal-border ${getHPBackgroundColor(
        playableCharacter.hp,
        playableCharacter.maxHp,
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
          <Button variant="outline" size="lg" onClick={() => onHPChange(-5)}>
            <Minus className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p
              className={`text-6xl font-bold ${getHPColor(
                playableCharacter.hp,
                playableCharacter.maxHp,
              )}`}
            >
              {playableCharacter.hp}
            </p>
            <p className="text-sm text-muted-foreground">
              / {playableCharacter.maxHp}
            </p>
          </div>
          <Button variant="outline" size="lg" onClick={() => onHPChange(5)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <HPModal playableCharacter={playableCharacter} onApply={onHPModal} />
      </CardContent>
    </Card>
  );
}
