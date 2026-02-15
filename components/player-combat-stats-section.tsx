import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlayerCombatStatsSectionProps {
  playableCharacter: PlayableCharacter;
}

export default function PlayerCombatStatsSection({
  playableCharacter,
}: PlayerCombatStatsSectionProps) {
  const attackBonus = playableCharacter.profBonus ?? 0;
  const spellAttack = playableCharacter.spellAttack ?? 0;

  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl">Status de Combate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">CA</p>
            <p className="text-2xl font-bold text-primary">
              {playableCharacter.ac}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Deslocamento
            </p>
            <p className="text-2xl font-bold">{playableCharacter.speed} ft</p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Iniciativa
            </p>
            <p className="text-2xl font-bold text-primary">
              {playableCharacter.initiativeBonus >= 0
                ? `+${playableCharacter.initiativeBonus}`
                : playableCharacter.initiativeBonus}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Percepção Passiva
            </p>
            <p className="text-2xl font-bold">
              {playableCharacter.passivePerception}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Bônus de Proficiência
            </p>
            <p className="text-2xl font-bold">
              {attackBonus >= 0 ? `+${attackBonus}` : attackBonus}
            </p>
          </div>
          <div className="text-center bg-card/50 p-4 rounded">
            <p className="text-xs uppercase text-muted-foreground mb-1">
              Ataque de Magia
            </p>
            <p className="text-2xl font-bold text-purple-500">
              {spellAttack >= 0 ? `+${spellAttack}` : spellAttack}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center bg-card/50 p-3 rounded">
          <p className="text-xs uppercase text-muted-foreground mb-1">
            Dificuldade de Desafio (CD)
          </p>
          <p className="text-xl font-bold">{playableCharacter.spellCD}</p>
        </div>
      </CardContent>
    </Card>
  );
}
