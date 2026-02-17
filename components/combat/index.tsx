"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Swords,
  X,
  SkipForward,
  Plus,
  SparklesIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { useCombat } from "@/app/_contexts/combat-context";
import { useGame } from "@/app/_contexts/game-context";

const spellLevelColors = {
  1: "bg-green-800 border-green-800 hover:bg-green-800/20 text-green-foreground",
  2: "bg-red-700 border-red-700 hover:bg-red-700/20 text-red-foreground",
  3: "bg-cyan-800 border-cyan-800 hover:bg-cyan-800/20 text-cyan-foreground",
  4: "bg-yellow-800 border-yellow-800 hover:bg-yellow-800/20 text-yellow-foreground",
  5: "bg-purple-800 border-purple-800 hover:bg-purple-800/20 text-purple-foreground",
  6: "bg-pink-800 border-pink-800 hover:bg-pink-800/20 text-pink-foreground",
  7: "bg-orange-500 border-orange-500 hover:bg-orange-500/20 text-orange-foreground",
  8: "bg-red-500 border-red-500 hover:bg-red-500/20 text-red-foreground",
  9: "bg-cyan-500 border-cyan-500 hover:bg-cyan-500/20 text-cyan-foreground",
};

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

export default function FullScreenCombat() {
  const {
    initiativeEntries,
    setInitiativeEntries,
    round,
    onCombat,
    setRound,
    setOnCombat,
    currentTurn,
    setCurrentTurn,
    fullScreenMode,
    setFullScreenMode,
    updateHp,
    updateTempHp,
    updateSpellSlot,
    updateClassResource,
    rollIndividualInitiative,
  } = useCombat();
  const { gameData } = useGame();

  const sortedEntries = [...initiativeEntries].sort(
    (a, b) => b.initiative - a.initiative,
  );
  const activeEntry = sortedEntries[currentTurn];

  const updateInitiative = (id: string, value: string) => {
    const num = Number.parseInt(value) || 0;
    setInitiativeEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, initiative: num } : e)),
    );
  };

  const nextTurn = () => {
    if (currentTurn >= sortedEntries.length - 1) {
      setCurrentTurn(0);
      setRound((r) => r + 1);
    } else {
      setCurrentTurn((t) => t + 1);
    }
  };

  const resetCombat = () => {
    setOnCombat(false);
    setCurrentTurn(0);
    setRound(1);
  };
  function pauseCombat() {
    setOnCombat(false);
  }

  return (
    <div className="fixed inset-0 bg-bg-background backdrop-blur-xl z-50 overflow-hidden flex flex-col">
      <div className="bg-bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-2xl flex items-center gap-3 text-text-primary">
            <Swords className="w-6 h-6 text-class-accent" />
            Combate
          </h1>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-body text-text-secondary">
              Rodada {round}
            </span>
            {onCombat && activeEntry && (
              <>
                <span>•</span>
                <span className="font-bold font-body text-class-accent">
                  {activeEntry.name}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onCombat ? (
            <>
              <Button onClick={nextTurn} size="lg" variant="martial">
                <SkipForward className="w-4 h-4 mr-2" />
                Próximo Turno
              </Button>
              <Button onClick={pauseCombat} size="lg" variant="outline">
                <PauseIcon className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setOnCombat(true)}
              size="lg"
              variant="divine"
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              Voltar ao Combate
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullScreenMode(false)}
            title="Sair do modo tela cheia"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {sortedEntries.length === 0 ? (
          <Card className="p-12 text-center card-inset">
            <Swords className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-30" />
            <p className="text-text-secondary font-body text-lg">
              Nenhum participante no combate
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedEntries.map((entry, index) => {
              const isCurrentTurn = onCombat && index === currentTurn;
              const isPlayer = entry.type === "playableCharacter";
              const instance =
                gameData.playableCharacters.find(
                  (p: any) => p.id === entry.id,
                ) || null;

              return (
                <Card
                  key={entry.id}
                  className={`p-4 card-inset transition-all ${
                    isCurrentTurn
                      ? "ring-2 ring-class-accent glow-class bg-class-surface/30 scale-[1.02]"
                      : "bg-bg-surface/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-heading font-bold text-lg text-text-primary">
                            {entry.name} - {instance?.className}:{" "}
                            {entry.initiative}
                          </h3>
                          {isPlayer && instance && (
                            <button
                              onClick={() => rollIndividualInitiative(entry.id)}
                              className="text-xs bg-stone-500 hover:bg-stone-500/80 px-2 py-1 rounded text-white font-bold ml-auto"
                            >
                              Rolar iniciativa
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span className="capitalize">{entry.type}</span>
                          {entry.ac && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-class-accent">
                                AC {entry.ac}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {entry.tempHp !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-body text-class-accent">
                            HP Temporário
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateTempHp(
                                  entry.id,
                                  Math.max(0, entry.tempHp! - 5),
                                )
                              }
                              className="h-8 w-8 p-0 hover:bg-damage/20 hover:text-damage"
                            >
                              -5
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateTempHp(entry.id, entry.tempHp! - 1)
                              }
                              className="h-8 w-8 p-0 hover:bg-healing/20 hover:text-healing"
                            >
                              -
                            </Button>

                            <span className="font-bold font-body text-class-accent min-w-[2rem] text-center">
                              {entry.tempHp}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateTempHp(
                                  entry.id,
                                  Math.max(0, entry.tempHp! + 1),
                                )
                              }
                              className="h-8 w-8 p-0 hover:bg-damage/20 hover:text-damage"
                            >
                              +
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateTempHp(entry.id, entry.tempHp! + 5)
                              }
                              className="h-8 w-8 p-0 hover:bg-healing/20 hover:text-healing"
                            >
                              +5
                            </Button>
                          </div>
                        </div>
                      )}

                      {instance !== null && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-body text-text-secondary">
                              HP
                            </span>
                            <span className="font-bold font-body text-text-primary">
                              {instance.hp}/{instance.maxHp}
                            </span>
                          </div>

                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(entry.id, -5)}
                              className="h-7 px-2 hover:bg-damage/20 hover:text-damage flex-1"
                            >
                              -5
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(entry.id, -1)}
                              className="h-7 px-2 hover:bg-damage/20 hover:text-damage flex-1"
                            >
                              -1
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(entry.id, 1)}
                              className="h-7 px-2 hover:bg-healing/20 hover:text-healing flex-1"
                            >
                              +1
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateHp(entry.id, 5)}
                              className="h-7 px-2 hover:bg-healing/20 hover:text-healing flex-1"
                            >
                              +5
                            </Button>
                          </div>
                        </>
                      )}

                      {isPlayer &&
                        instance &&
                        instance.spellSlots &&
                        CASTER_CLASSES.includes(
                          instance.classIndex?.toLowerCase(),
                        ) && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center gap-1 mb-2">
                              <SparklesIcon className="w-3 h-3 text-class-accent" />
                              <span className="text-xs font-bold text-text-secondary">
                                Slots
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(instance.spellSlots).map(
                                ([level, slots]: [string, any]) => {
                                  if (slots.max === 0) return null;
                                  const levelNum = parseInt(level);
                                  const colors =
                                    spellLevelColors[
                                      levelNum as keyof typeof spellLevelColors
                                    ] || "";
                                  return (
                                    <button
                                      key={level}
                                      onClick={() => {
                                        const newValue =
                                          slots.current === 0
                                            ? slots.max
                                            : slots.current - 1;
                                        updateSpellSlot(
                                          entry.id,
                                          levelNum,
                                          newValue,
                                        );
                                      }}
                                      className={`px-2 py-1 text-xs rounded border-2 ${colors}`}
                                      title={`Nível ${level}: ${slots.current}/${slots.max}`}
                                    >
                                      {slots.current}/{slots.max}
                                    </button>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        )}

                      {isPlayer && instance && (
                        <div className="pt-2 border-t border-border">
                          {[
                            "sorceryPoints",
                            "kiPoints",
                            "rages",
                            "inspiration",
                            "actionSurges",
                            "indomitables",
                            "channelDivinityCharges",
                          ].map((resource) => {
                            const resourceValue = (instance as any)[resource];
                            if (
                              !resourceValue ||
                              typeof resourceValue !== "object" ||
                              !("current" in resourceValue)
                            )
                              return null;
                            const resourceNames: Record<string, string> = {
                              sorceryPoints: "Pontos de Sorcery",
                              kiPoints: "Pontos de Ki",
                              rages: "Fúrias",
                              inspiration: "Inspiração",
                              actionSurges: "Surto de Ação",
                              indomitables: "Indomáveis",
                              channelDivinityCharges: "Canalizar Divindade",
                            };
                            return (
                              <div
                                key={resource}
                                className="flex items-center justify-between text-sm mt-1"
                              >
                                <span className="font-body text-text-secondary text-xs">
                                  {resourceNames[resource] || resource}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateClassResource(
                                        entry.id,
                                        resource,
                                        Math.max(0, resourceValue.current - 1),
                                      )
                                    }
                                    className="h-6 w-6 p-0 hover:bg-damage/20 hover:text-damage"
                                  >
                                    -
                                  </Button>
                                  <span className="font-bold font-body text-text-primary text-xs min-w-[2rem] text-center">
                                    {resourceValue.current}/{resourceValue.max}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      updateClassResource(
                                        entry.id,
                                        resource,
                                        Math.min(
                                          resourceValue.max,
                                          resourceValue.current + 1,
                                        ),
                                      )
                                    }
                                    className="h-6 w-6 p-0 hover:bg-healing/20 hover:text-healing"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
