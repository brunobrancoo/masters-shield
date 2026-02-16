import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollIcon } from "@/components/icons";
import { calculateModifier } from "@/lib/utils-dnd";
import { cn } from "@/lib/utils";

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
        <div className="flex flex-col gap-3">
          {Object.entries(playableCharacter.attributes).map(([key, value]) => (
            <Card key={key} className="bg-card text-center p-4">
              <CardContent className="flex justify-between items-center">
                <p className="text-md font-bold uppercase font-sans text-muted-foreground mb-1">
                  {key}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    calculateModifier(value).includes("+") && "text-green-800",
                    calculateModifier(value).includes("-") && "text-red-800",
                  )}
                >
                  {calculateModifier(value)}
                </p>
                <p className="text-lg text-primary font-mono">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
