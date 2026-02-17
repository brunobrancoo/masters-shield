"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, X } from "lucide-react";
import { InitiativeEntryWithTemp } from "@/lib/schemas";
import { getHPColor, getHPClass } from "@/lib/theme";

interface InitiativeEntryCardProps {
  entry: InitiativeEntryWithTemp;
  index: number;
  isCurrentTurn: boolean;
  updateInitiative: (id: string, value: string) => void;
  removeEntry: (id: string) => void;
  updateHp: (id: string, delta: number) => void;
  updateTempHp: (id: string, tempHp: number) => void;
  rollIndividualInitiative: (id: string) => void;
  onCombat: boolean;
}

export default function InitiativeEntryCard({
  entry,
  index,
  isCurrentTurn,
  updateInitiative,
  removeEntry,
  updateHp,
  updateTempHp,
  rollIndividualInitiative,
  onCombat,
}: InitiativeEntryCardProps) {
  const hpPercent = (entry.hp / entry.maxHp) * 100;
  const hpColor = getHPColor(hpPercent);
  const hpClass = getHPClass(hpPercent);

  return (
    <Card
      className={`p-4 card-inset transition-all ${
        isCurrentTurn
          ? "ring-2 ring-class-accent glow-class bg-class-surface/30 scale-[1.02]"
          : "bg-bg-surface/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 min-w-[60px]">
          <Input
            type="number"
            value={entry.initiative}
            onChange={(e) => updateInitiative(entry.id, e.target.value)}
            className="h-12 text-center text-xl font-bold font-body"
            disabled={onCombat}
          />
          <span className="text-xs text-text-secondary font-body">
            Iniciativa
          </span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-lg leading-tight text-text-primary">
                  {entry.name}
                </h4>
                {!onCombat && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => rollIndividualInitiative(entry.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Rolar iniciativa
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="capitalize">{entry.type}</span>
                {entry.ac && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-class-accent">AC {entry.ac}</span>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEntry(entry.id)}
              className="h-8 w-8 p-0 hover:bg-damage/20 hover:text-damage"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-1">
            {entry.tempHp !== undefined && entry.tempHp > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-body text-class-accent">HP Temp</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTempHp(entry.id, Math.max(0, entry.tempHp! - 1))}
                    className="h-6 w-6 p-0 hover:bg-damage/20 hover:text-damage"
                  >
                    -
                  </Button>
                  <span className="font-bold font-body text-class-accent min-w-[2rem] text-center">
                    {entry.tempHp}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTempHp(entry.id, entry.tempHp! + 1)}
                    className="h-6 w-6 p-0 hover:bg-healing/20 hover:text-healing"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="font-body text-text-secondary">HP</span>
              <span className="font-bold font-body text-text-primary">
                {entry.hp}/{entry.maxHp}
              </span>
            </div>
            <div className="h-2 bg-bg-inset rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${hpClass}`}
                style={{
                  width: `${hpPercent}%`,
                  backgroundColor: hpColor,
                }}
              />
            </div>
            <div className="flex gap-1 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateHp(entry.id, -5)}
                className="h-7 px-2 hover:bg-damage/20 hover:text-damage"
              >
                -5
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateHp(entry.id, -1)}
                className="h-7 px-2 hover:bg-damage/20 hover:text-damage"
              >
                -1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateHp(entry.id, 1)}
                className="h-7 px-2 hover:bg-healing/20 hover:text-healing"
              >
                +1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateHp(entry.id, 5)}
                className="h-7 px-2 hover:bg-healing/20 hover:text-healing"
              >
                +5
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
