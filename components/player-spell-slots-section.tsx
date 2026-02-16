import type { PlayableCharacter, SpellSlots } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@/components/icons";

const spellLevelColors = {
  1: {
    bg: "bg-green-800",
    border: "border-green-800",
    hover: "hover:bg-green-800/20",
    text: "text-green-foreground",
  },
  2: {
    bg: "bg-red-700",
    border: "border-red-700",
    hover: "hover:bg-red-700/20",
    text: "text-red-foreground",
  },
  3: {
    bg: "bg-cyan-800",
    border: "border-cyan-800",
    hover: "hover:bg-cyan-800/20",
    text: "text-cyan-foreground",
  },
  4: {
    bg: "bg-yellow-800",
    border: "border-yellow-800",
    hover: "hover:bg-yellow-800/20",
    text: "text-yellow-foreground",
  },
  5: {
    bg: "bg-purple-800",
    border: "border-purple-800",
    hover: "hover:bg-purple-800/20",
    text: "text-purple-foreground",
  },
  6: {
    bg: "bg-pink-800",
    border: "border-pink-800",
    hover: "hover:bg-pink-800/20",
    text: "text-pink-foreground",
  },
  7: {
    bg: "bg-orange-500",
    border: "border-orange-500",
    hover: "hover:bg-orange-500/20",
    text: "text-orange-foreground",
  },
  8: {
    bg: "bg-red-500",
    border: "border-red-500",
    hover: "hover:bg-red-500/20",
    text: "text-red-foreground",
  },
  9: {
    bg: "bg-cyan-500",
    border: "border-cyan-500",
    hover: "hover:bg-cyan-500/20",
    text: "text-cyan-foreground",
  },
};

// Caster classes that have spell slots
const CASTER_CLASSES = [
  "bard",
  "cleric",
  "druid",
  "paladin",
  "ranger",
  "sorcerer",
  "warlock",
  "wizard",
];

interface PlayerSpellSlotsSectionProps {
  playableCharacter: PlayableCharacter;
  onSpellSlotChange: (level: keyof SpellSlots, value: number) => void;
}

export default function PlayerSpellSlotsSection({
  playableCharacter,
  onSpellSlotChange,
}: PlayerSpellSlotsSectionProps) {
  // Only render for caster classes
  const isCaster = CASTER_CLASSES.includes(
    playableCharacter.classIndex?.toLowerCase(),
  );

  if (!isCaster || !playableCharacter.spellSlots) {
    return null;
  }

  return (
    <Card className="metal-border">
      <CardHeader>
        <CardTitle className="font-sans text-xl flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          Slots de Magia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
            const colors =
              spellLevelColors[level as keyof typeof spellLevelColors];
            const maxSlots =
              playableCharacter.spellSlots?.[level as keyof SpellSlots]?.max ??
              0;

            // Skip levels with 0 slots
            if (maxSlots === 0) return null;

            return (
              <div key={level} className="text-center bg-card/50 p-4 rounded">
                <p
                  className={`text-xs uppercase font-bold mb-3 ${colors.text}`}
                >
                  Nível {level}
                </p>
                <div className="flex justify-center gap-1 flex-wrap">
                  {Array.from({ length: maxSlots }).map((_, idx) => {
                    const slotValue =
                      playableCharacter.spellSlots?.[level as keyof SpellSlots]
                        ?.current ?? 0;
                    const isActive = idx < slotValue;
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          onSpellSlotChange(level as keyof SpellSlots, idx + 1)
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isActive
                            ? `${colors.bg} ${colors.text} ${colors.border}`
                            : `bg-transparent ${colors.border}/30 ${colors.hover}`
                        }`}
                        title={`Slot ${idx + 1}: ${slotValue}/${maxSlots} restantes`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
