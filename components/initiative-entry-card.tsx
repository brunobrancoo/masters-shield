"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Swords, X } from "lucide-react";
import { InitiativeEntry } from "@/lib/interfaces/interfaces";
import { getHPColor, getHPClass } from "@/lib/theme";

interface InitiativeEntryCardProps {
  entry: InitiativeEntry;
  index: number;
  isCurrentTurn: boolean;
  updateInitiative: (id: string, value: string) => void;
  removeEntry: (id: string) => void;
  updateHp: (id: string, delta: number) => void;
  onCombat: boolean;
}

export default function InitiativeEntryCard({
  entry,
  index,
  isCurrentTurn,
  updateInitiative,
  removeEntry,
  updateHp,
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
              <h4 className="font-heading font-bold text-lg leading-tight text-text-primary">
                {entry.name}
              </h4>
              <p className="text-xs text-text-secondary capitalize">
                {entry.type}
              </p>
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
            <div className="flex items-center justify-between text-sm">
              <span className="font-body text-text-secondary">
                HP
              </span>
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
