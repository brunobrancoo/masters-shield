import type { PlayableCharacter } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiceIcon } from "@/components/icons";
import { Flame, Wind, Sword, Music, Sun } from "lucide-react";

interface PlayerClassResourcesSectionProps {
  playableCharacter: PlayableCharacter;
  onResourceChange: (resourceType: string, value: number) => void;
}

// Class resource configurations
const CLASS_RESOURCES: Record<
  string,
  { type: string; name: string; icon: React.ReactNode; color: string }[]
> = {
  sorcerer: [
    {
      type: "sorceryPoints",
      name: "Pontos de Feitiçaria",
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

  // Get current/max values based on resource type
  const getResourceValues = (
    type: string,
  ): { current: number; max: number } => {
    switch (type) {
      case "sorceryPoints":
        return {
          current:
            (playableCharacter as any).sorceryPoints?.sorceryPoints?.current ??
            0,
          max:
            (playableCharacter as any).sorceryPoints?.sorceryPoints?.max ?? 0,
        };
      case "kiPoints":
        return {
          current: (playableCharacter as any).kiPoints?.kiPoints?.current ?? 0,
          max: (playableCharacter as any).kiPoints?.kiPoints?.max ?? 0,
        };
      case "rages":
        return {
          current: (playableCharacter as any).rages?.rages?.current ?? 0,
          max: (playableCharacter as any).rages?.rages?.max ?? 0,
        };
      case "inspiration":
        return {
          current:
            (playableCharacter as any).inspiration?.inspiration?.current ?? 0,
          max: (playableCharacter as any).inspiration?.inspiration?.max ?? 1,
        };
      case "channelDivinity":
        // Only show for level 2+ clerics/paladins
        if (playableCharacter.level < 2) return { current: 0, max: 0 };
        return {
          current:
            (playableCharacter as any).channelDivinityCharges
              ?.channelDivinityCharges?.current ?? 0,
          max:
            (playableCharacter as any).channelDivinityCharges
              ?.channelDivinityCharges?.max ?? 1,
        };
      default:
        return { current: 0, max: 0 };
    }
  };

  return (
    <>
      {resources.map((resource) => {
        const { current, max } = getResourceValues(resource.type);

        // Skip if max is 0 (e.g., channel divinity at level 1)
        if (max === 0) return null;

        const styles = COLOR_STYLES[resource.color];

        return (
          <Card
            key={resource.type}
            className={`metal-border ${styles.bg} ${styles.border}`}
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
                      onClick={() => onResourceChange(resource.type, idx + 1)}
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
