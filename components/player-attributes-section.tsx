import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollIcon } from "@/components/icons";
import { calculateModifier } from "@/lib/utils-dnd";

interface PlayerAttributesSectionProps {
  playableCharacter: PlayableCharacter;
}

export default function PlayerAttributesSection({
  playableCharacter,
}: PlayerAttributesSectionProps) {
  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <ScrollIcon className="w-6 h-6" />
          Atributos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(playableCharacter.attributes).map(([key, value]) => (
            <Card key={key} className="bg-card text-center">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs uppercase font-sans text-muted-foreground mb-1">
                  {key}
                </p>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-lg text-primary font-mono">
                  {calculateModifier(value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
