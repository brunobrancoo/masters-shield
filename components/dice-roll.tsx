"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { D10, D12, D20, D4, D6, D8, DiceIcon } from "./icons";
import { Minus, Plus } from "lucide-react";
import type { DiceType, RollResult } from "@/lib/interfaces/dice-roll";
import { DiceRoller } from "@/lib/classes/dices";
import { isResolvedLazyResult } from "next/dist/server/lib/lazy-result";

interface DiceCount {
  d4: number;
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
}

const DICE_CONFIG: { type: DiceType; label: string; sides: number }[] = [
  { type: "d4", label: "d4", sides: 4 },
  { type: "d6", label: "d6", sides: 6 },
  { type: "d8", label: "d8", sides: 8 },
  { type: "d10", label: "d10", sides: 10 },
  { type: "d12", label: "d12", sides: 12 },
  { type: "d20", label: "d20", sides: 20 },
  { type: "d100", label: "d100", sides: 100 },
];

const diceIcons: Record<
  DiceType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  d4: D4,
  d6: D6,
  d8: D8,
  d10: D10,
  d12: D12,
  d20: D20,
  d100: D10,
};

export default function DiceRollModal() {
  const [diceCount, setDiceCount] = useState<DiceCount>({
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 1,
    d100: 0,
  });

  const [results, setResults] = useState<RollResult[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const updateDiceCount = (type: DiceType, delta: number) => {
    setDiceCount((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(99, prev[type] + delta)),
    }));
  };

  const handleRoll = () => {
    setIsRolling(true);
    const newResults: RollResult[] = [];

    setTimeout(() => {
      DICE_CONFIG.forEach(({ type, sides }) => {
        const count = diceCount[type];
        if (count > 0) {
          const roller = new DiceRoller(sides);
          const rollResult = roller.roll(count);
          newResults.push(rollResult);
        }
      });

      setResults(newResults);
      setIsRolling(false);
    }, 600);
  };

  const handleClear = () => {
    setDiceCount({
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 1,
      d100: 0,
    });
    setResults([]);
  };

  const grandTotal = results.reduce((sum, result) => sum + result.total, 0);
  const hasActiveDice = Object.values(diceCount).some((count) => count > 0);

  const getRollClass = (roll: number, sides: number): string => {
    if (sides === 20) {
      if (roll === 20) return "animate-crit text-divine-glow glow-divine";
      if (roll === 1) return "animate-crit text-monster-glow glow-danger";
    }
    return "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="group relative transition-transform hover:scale-110 active:scale-95"
          aria-label="Rolar dados"
        >
          <D20 className="h-14 w-14 text-class-accent transition-all group-hover:text-class-accent/80" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl flex items-center gap-3 text-balance text-text-primary">
            <D20 className="w-8 h-8 text-class-accent" />
            Rolador de Dados
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dice Selection - Horizontal List */}
          <div className="space-y-3">
            <h3 className="font-body text-sm text-text-secondary uppercase tracking-wide section-label mb-3">
              Selecione os dados
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {DICE_CONFIG.map(({ type, label }) => {
                const Icon = diceIcons[type as DiceType] ?? DiceIcon;
                return (
                  <div
                    key={type}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border-default bg-bg-surface card-inset"
                  >
                    <div
                      className={`relative ${isRolling && diceCount[type] > 0 ? "dice-shake" : ""}`}
                    >
                      <Icon className="w-8 h-8 text-text-primary" />
                      <span className="absolute -bottom-1 -right-1 text-xs font-bold text-class-accent bg-bg-inset rounded-full w-5 h-5 flex items-center justify-center border border-class-accent/30">
                        {label.substring(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateDiceCount(type, -1)}
                        disabled={diceCount[type] === 0}
                        className="h-7 w-7 p-0 hover:bg-damage/20 hover:text-damage"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="font-bold text-lg font-body text-text-primary">
                          {diceCount[type]}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateDiceCount(type, 1)}
                        disabled={diceCount[type] >= 99}
                        className="h-7 w-7 p-0 hover:bg-class-accent/20 hover:text-class-accent"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roll Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleRoll}
              disabled={!hasActiveDice}
              size="lg"
              className="flex-1 text-lg font-body"
              variant="martial"
            >
              <DiceIcon className="w-5 h-5 mr-2" />
              Rolar Dados
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
              className="px-6 bg-transparent"
            >
              Limpar
            </Button>
          </div>

          {isRolling && (
            <div className="text-center py-8 animate-pulse">
              <DiceIcon
                className="w-12 h-12 mx-auto mb-2 text-class-accent animate-spin"
                style={{ animationDuration: "0.8s" }}
              />
              <p className="text-text-secondary font-body text-lg">
                Rolando os dados...
              </p>
            </div>
          )}
          {/* Results Display */}
          {results.length > 0 && !isRolling && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="border-t border-border-default pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-body text-sm text-text-secondary uppercase tracking-wide section-label mb-0">
                    Resultados
                  </h3>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary font-body">
                      Total Geral
                    </p>
                    <p className="text-4xl font-bold text-class-accent glow-class font-mono">
                      {grandTotal}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border-default bg-bg-surface card-inset"
                    >
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <DiceIcon className="w-5 h-5 text-class-accent" />
                        <span className="font-bold text-lg font-body text-text-primary">
                          {result.rolls.length}
                          {result.type}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {result.rolls.map((roll, rollIdx) => (
                            <span
                              key={rollIdx}
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-md bg-class-accent/10 border border-class-accent/30 font-bold text-text-primary font-mono ${getRollClass(roll, parseInt(result.type.slice(1)))}`}
                            >
                              {roll}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right min-w-[60px]">
                        <p className="text-xs text-text-secondary font-body">
                          Total
                        </p>
                        <p className="text-2xl font-bold text-class-accent font-mono">
                          {result.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.length === 0 && hasActiveDice && (
            <div className="text-center py-8 text-text-secondary font-body">
              <DiceIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Clique em "Rolar Dados" para ver os resultados</p>
            </div>
          )}

          {!hasActiveDice && results.length === 0 && (
            <div className="text-center py-8 text-text-secondary font-body">
              <DiceIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Selecione os dados que deseja rolar</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
