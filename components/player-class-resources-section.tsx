import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiceIcon, SwordIcon } from "@/components/icons";
import { Flame, Wind, Sword, Music, Sun, Shield } from "lucide-react";

interface PlayerClassResourcesSectionProps {
  playableCharacter: PlayableCharacter;
  onResourceChange: (resourceType: string, value: number) => void;
}

// Class resource configurations
export const CLASS_RESOURCES: Record<
  string,
  { type: string; name: string; icon: React.ReactNode; color: string }[]
> = {
  fighter: [
    {
      type: "actionSurges",
      name: "Action Surges",
      icon: <SwordIcon className="w-6 h-6" />,
      color: "martial",
    },
    {
      type: "indomitables",
      name: "Indomitables",
      icon: <Shield className="w-6 h-6" />,
      color: "martial",
    },
  ],
  sorcerer: [
    {
      type: "sorceryPoints",
      name: "Sorcery Points",
      icon: <Flame className="w-6 h-6" />,
      color: "purple",
    },
  ],
  monk: [
    {
      type: "kiPoints",
      name: "Pontos de Ki",
      icon: <Wind className="w-6 h-6" />,
      color: "nature",
    },
  ],
  barbarian: [
    {
      type: "rages",
      name: "Fúrias",
      icon: <Sword className="w-6 h-6" />,
      color: "martial",
    },
  ],
  bard: [
    {
      type: "inspiration",
      name: "Inspiração Bárdica",
      icon: <Music className="w-6 h-6" />,
      color: "arcane",
    },
  ],
  cleric: [
    {
      type: "channelDivinity",
      name: "Canalizar Divindade",
      icon: <Sun className="w-6 h-6" />,
      color: "divine",
    },
  ],
  paladin: [
    {
      type: "channelDivinity",
      name: "Canalizar Divindade",
      icon: <Sun className="w-6 h-6" />,
      color: "divine",
    },
  ],
  rogue: [
    {
      type: "sneakAttackDice",
      name: "Dado de ataque furtivo",
      icon: <Sun className="w-6 h-6" />,
      color: "black",
    },
  ],
};

const COLOR_STYLES: Record<
  string,
  { bg: string; border: string; text: string; button: string }
> = {
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-500",
    button:
      "bg-purple-500 text-purple-50 border-purple-500 hover:bg-purple-500/20",
  },
  nature: {
    bg: "bg-nature-500/10",
    border: "border-nature-500/30",
    text: "text-nature-500",
    button:
      "bg-nature-500 text-nature-50 border-nature-500 hover:bg-nature-500/20",
  },
  martial: {
    bg: "bg-martial-500/10",
    border: "border-martial-500/30",
    text: "text-martial-500",
    button:
      "bg-martial-500 text-martial-50 border-martial-500 hover:bg-martial-500/20",
  },
  arcane: {
    bg: "bg-arcane-500/10",
    border: "border-arcane-500/30",
    text: "text-arcane-500",
    button:
      "bg-arcane-500 text-arcane-50 border-arcane-500 hover:bg-arcane-500/20",
  },
  divine: {
    bg: "bg-divine-500/10",
    border: "border-divine-500/30",
    text: "text-divine-500",
    button:
      "bg-divine-500 text-divine-50 border-divine-500 hover:bg-divine-500/20",
  },
};

export default function PlayerClassResourcesSection({
  playableCharacter,
  onResourceChange,
}: PlayerClassResourcesSectionProps) {
  const classKey = playableCharacter.classIndex?.toLowerCase();
  const resources = CLASS_RESOURCES[classKey];

  if (!resources || resources.length === 0) {
    return null;
  }

  // Get all current/max values for the class as a record
  const getResourceValues = (
    classIndex: string,
  ): Record<string, { current: number; max: number }> => {
    const char = playableCharacter as any;

    switch (classIndex) {
      case "fighter":
        return {
          actionSurges: {
            current: char.actionSurges?.current ?? 0,
            max: char.actionSurges?.max ?? 0,
          },
          indomitables: {
            current: char.indomitables?.current ?? 0,
            max: char.indomitables?.max ?? 0,
          },
        };
      case "sorcerer":
        return {
          sorceryPoints: {
            current: char.sorceryPoints?.current ?? 0,
            max: char.sorceryPoints?.max ?? 0,
          },
        };
      case "monk":
        return {
          kiPoints: {
            current: char.kiPoints?.current ?? 0,
            max: char.kiPoints?.max ?? 0,
          },
        };
      case "barbarian":
        return {
          rages: {
            current: char.rages?.current ?? 0,
            max: char.rages?.max ?? 0,
          },
        };
      case "bard":
        return {
          inspiration: {
            current: char.inspiration?.current ?? 0,
            max: char.inspiration?.max ?? 1,
          },
        };
      case "cleric":
        // Only show for level 2+ clerics/paladins
        if (playableCharacter.level < 2) {
          return { channelDivinity: { current: 0, max: 0 } };
        }
        return {
          channelDivinity: {
            current: char.channelDivinityCharges?.current ?? 0,
            max: char.channelDivinityCharges?.max ?? 1,
          },
        };
      case "paladin":
        // Paladin logic added for consistency (assuming similar structure to cleric)
        if (playableCharacter.level < 2) {
          return { channelDivinity: { current: 0, max: 0 } };
        }
        return {
          channelDivinity: {
            current: char.channelDivinityCharges?.current ?? 0,
            max: char.channelDivinityCharges?.max ?? 1,
          },
        };
      default:
        return {};
    }
  };

  const allResourceValues = getResourceValues(classKey);

  return (
    <>
      {resources.map((resource) => {
        // Look up the specific resource values using the resource type
        const { current, max } = allResourceValues[resource.type] || {
          current: 0,
          max: 0,
        };

        // Skip if max is 0 (e.g., channel divinity at level 1)
        if (max === 0) return null;

        const styles = COLOR_STYLES[resource.color];

        return (
          <Card
            key={resource.type}
            className={`metal-border ${styles.bg} ${styles.border} my-4`}
          >
            <CardHeader>
              <CardTitle
                className={`font-sans text-xl flex items-center gap-2 ${styles.text}`}
              >
                <DiceIcon className={`w-6 h-6 ${styles.text}`} />
                {resource.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: max }).map((_, idx) => {
                  const isActive = idx < current;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        console.log("CLICKING", resource.type);

                        onResourceChange(resource.type, idx + 1);
                      }}
                      className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                        isActive
                          ? styles.button
                          : `bg-transparent ${styles.border} hover:${styles.bg}`
                      }`}
                    >
                      {resource.icon}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3">
                {current} / {max} {resource.name.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
