import type { Player, SpellSlots } from "@/lib/interfaces/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@/components/icons";

interface PlayerSpellSlotsSectionProps {
  player: Player;
  onSpellSlotChange: (level: keyof SpellSlots, value: number) => void;
}

const spellLevelColors = {
  1: {
    bg: "bg-nature-500",
    border: "border-nature-500",
    hover: "hover:bg-nature-500/20",
    text: "text-nature-foreground",
  },
  2: {
    bg: "bg-martial-400",
    border: "border-martial-400",
    hover: "hover:bg-martial-400/20",
    text: "text-martial-foreground",
  },
  3: {
    bg: "bg-arcane-400",
    border: "border-arcane-400",
    hover: "hover:bg-arcane-400/20",
    text: "text-arcane-foreground",
  },
  4: {
    bg: "bg-divine-400",
    border: "border-divine-400",
    hover: "hover:bg-divine-400/20",
    text: "text-divine-foreground",
  },
  5: {
    bg: "bg-purple-500",
    border: "border-purple-500",
    hover: "hover:bg-purple-500/20",
    text: "text-purple-foreground",
  },
  6: {
    bg: "bg-pink-500",
    border: "border-pink-500",
    hover: "hover:bg-pink-500/20",
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

export default function PlayerSpellSlotsSection({ player, onSpellSlotChange }: PlayerSpellSlotsSectionProps) {
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
            const colors = spellLevelColors[level as keyof typeof spellLevelColors];
            return (
              <div
                key={level}
                className="text-center bg-card/50 p-4 rounded"
              >
                <p className={`text-xs uppercase font-bold mb-3 ${colors.text}`}>
                  Nível {level}
                </p>
                <div className="flex justify-center gap-1 flex-wrap">
                  {Array.from({
                    length:
                      player.maxSpellSlots[level as keyof SpellSlots] ??
                      0,
                  }).map((_, idx) => {
                    const slotValue =
                      player.spellSlots?.[level as keyof SpellSlots] ?? 0;
                    const isActive = idx < slotValue;
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          onSpellSlotChange(
                            level as keyof SpellSlots,
                            idx + 1,
                          )
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          isActive
                            ? `${colors.bg} ${colors.text} ${colors.border}`
                            : `bg-transparent ${colors.border}/30 ${colors.hover}`
                        }`}
                        title={`Slot ${idx + 1}: ${slotValue}/${player.maxSpellSlots[level as keyof SpellSlots]} restantes`}
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
