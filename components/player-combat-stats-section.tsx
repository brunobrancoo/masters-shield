import type { Player } from "@/lib/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerCombatStatsSectionProps {
  player: Player;
}

export default function PlayerCombatStatsSection({ player }: PlayerCombatStatsSectionProps) {
  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl">
          Status de Combate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              CA
            </p>
            <p className="text-2xl font-bold text-primary">
              {player.ac}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Deslocamento
            </p>
            <p className="text-2xl font-bold">{player.speed} ft</p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Iniciativa
            </p>
            <p className="text-2xl font-bold text-primary">
              {player.initiativeBonus >= 0
                ? `+${player.initiativeBonus}`
                : player.initiativeBonus}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Percepção Passiva
            </p>
            <p className="text-2xl font-bold">
              {player.passivePerception}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Bônus de Ataque Base
            </p>
            <p className="text-2xl font-bold">
              {player.attackBaseBonus >= 0
                ? `+${player.attackBaseBonus}`
                : player.attackBaseBonus}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Ataque de Magia
            </p>
            <p className="text-2xl font-bold text-purple-500">
              {player.spellAttack >= 0
                ? `+${player.spellAttack}`
                : player.spellAttack}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center bg-card/50 p-3 rounded">
          <p className="text-xs uppercase text-muted-foreground mb-1">
            Dificuldade de Desafio (CD)
          </p>
          <p className="text-xl font-bold">{player.spellCD}</p>
        </div>
      </CardContent>
    </Card>
  );
}
