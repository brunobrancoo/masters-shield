"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Swords,
  Plus,
  X,
  Play,
  SkipForward,
  RotateCcw,
  Trash2,
  LogOut,
  Swords as SwitchCampaign,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InitiativeEntry,
  Monster,
  NPC,
  Player,
} from "@/lib/interfaces/interfaces";
import { useGame } from "@/app/_contexts/game-context";
import { ScrollArea } from "./ui/scroll-area";
import { useCombat } from "@/app/_contexts/combat-context";
import { getAttMod } from "@/lib/utils";
import { getHPColor, getHPClass } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const {
    addExistingEntry,
    initiativeEntries,
    setInitiativeEntries,
    removeEntry,
    showAddForm,
    setShowAddForm,
    setSelectedSourceId,
    selectedSourceId,
    round,
    onCombat,
    setRound,
    setCustomName,
    setCustomMaxHp,
    setCustomInitiative,
    setCustomHp,
    customName,
    customMaxHp,
    customInitiative,
    customHp,
    resetAddForm,
    addCustomEntry,
    currentTurn,
    setCurrentTurn,
    setOnCombat,
    updateHp,
    getSourceList,
    sourceType,
    setSourceType,
    addAllPlayers,
    rollInitiatives,
    initiativeRolls,
    clearAll,
    addAllMonsters,
    addAllNPCs,
  } = useCombat();

  // Add entry form
  const [addType, setAddType] = useState<"existing" | "custom">("existing");

  const sortedEntries = [...initiativeEntries].sort(
    (a, b) => b.initiative - a.initiative,
  );
  const activeEntry = sortedEntries[currentTurn];

  const { gameData } = useGame();

  const updateInitiative = (id: string, value: string) => {
    const num = Number.parseInt(value) || 0;
    setInitiativeEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, initiative: num } : e)),
    );
  };

  const startCombat = () => {
    if (initiativeEntries.length === 0) return;
    setOnCombat(true);
    setCurrentTurn(0);
    setRound(1);
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

  return (
    <Sidebar side="right" className="z-50">
      <SidebarHeader className="px-6 py-4 border-b border-border-default bg-bg-surface/50">
        <h2 className="font-heading text-2xl flex items-center gap-3 text-balance text-text-primary">
          <Swords className="w-6 h-6 text-class-accent" />
          Tracker de Iniciativa
        </h2>
        <p className="font-body text-sm text-text-secondary">
          {onCombat
            ? `Rodada ${round} - Turno de ${activeEntry?.name || "..."}`
            : "Gerencie a ordem de combate"}
        </p>
      </SidebarHeader>
      <SidebarContent className="px-8 mt-8">
        <ScrollArea>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="space-y-4">
                {/* Combat Controls */}
                {initiativeEntries.length > 0 && (
                  <div className="flex gap-2">
                    {!onCombat ? (
                      <>
                        <Button
                          onClick={startCombat}
                          className="flex-1"
                          size="lg"
                          variant="divine"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar Combate
                        </Button>
                        <Button
                          onClick={rollInitiatives}
                          disabled={initiativeRolls.length > 0}
                          className="flex-1"
                          size="lg"
                          variant="outline"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Rolar todas as iniciativas
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={nextTurn}
                          className="flex-1"
                          size="lg"
                          variant="martial"
                        >
                          <SkipForward className="w-4 h-4 mr-2" />
                          Próximo Turno
                        </Button>
                        <Button
                          onClick={resetCombat}
                          variant="outline"
                          size="lg"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reiniciar
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Initiative List */}
                <div className="space-y-2">
                  {sortedEntries.length === 0 ? (
                    <Card className="p-8 text-center card-inset">
                      <Swords className="w-12 h-12 mx-auto mb-3 text-text-secondary opacity-30" />
                      <p className="text-text-secondary font-body">
                        Nenhum participante no combate
                      </p>
                      <p className="text-sm text-text-secondary font-body mt-1">
                        Adicione participantes para começar
                      </p>
                    </Card>
                  ) : (
                    sortedEntries.map((entry, index) => {
                      const isCurrentTurn = onCombat && index === currentTurn;
                      const hpPercent = (entry.hp / entry.maxHp) * 100;
                      const hpColor = getHPColor(hpPercent);
                      const hpClass = getHPClass(hpPercent);

                      return (
                        <Card
                          key={entry.id}
                          className={`p-4 card-inset transition-all ${
                            isCurrentTurn
                              ? "ring-2 ring-class-accent glow-class bg-class-surface/30 scale-[1.02]"
                              : "bg-bg-surface/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Initiative Number */}
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                              <Input
                                type="number"
                                value={entry.initiative}
                                onChange={(e) =>
                                  updateInitiative(entry.id, e.target.value)
                                }
                                className="h-12 text-center text-xl font-bold font-body"
                                disabled={onCombat}
                              />
                              <span className="text-xs text-text-secondary font-body">
                                Iniciativa (
                                {
                                  //QUEBROU! TEM QUE TER PRA MONSTER E NPC TAMBÉM
                                  initiativeRolls.find(
                                    (roll) => roll.id === entry.id,
                                  )?.roll
                                }{" "}
                                {initiativeRolls.some(
                                  (roll) => roll.id === entry.id,
                                ) && "+ "}
                                dex mod {entry.dexMod})
                              </span>
                            </div>

                            {/* Info */}
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

                              {/* HP Bar */}
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
                    })
                  )}
                </div>

                {/* Add Entry Form */}
                {!showAddForm ? (
                  <>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Participante
                    </Button>

                    <Button
                      onClick={() => addAllPlayers()}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Todos os Jogadores
                    </Button>
                    <Button
                      onClick={() => addAllNPCs()}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Todos os NPCs
                    </Button>
                    <Button
                      onClick={() => addAllMonsters()}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Todos os Monstros
                    </Button>
                  </>
                ) : (
                  <Card className="p-4 card-inset bg-bg-surface/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-text-primary">Novo Participante</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetAddForm}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={addType === "existing" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAddType("existing")}
                        className="flex-1"
                      >
                        Existente
                      </Button>
                      <Button
                        variant={addType === "custom" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAddType("custom")}
                        className="flex-1"
                      >
                        Personalizado
                      </Button>
                    </div>

                    {addType === "existing" ? (
                      <div className="space-y-3">
                        <Select
                          value={sourceType}
                          onValueChange={(v: any) => setSourceType(v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monster">Monstro</SelectItem>
                            <SelectItem value="player">Jogador</SelectItem>
                            <SelectItem value="npc">NPC</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={selectedSourceId}
                          onValueChange={setSelectedSourceId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getSourceList().map((item) => {
                              if (
                                initiativeEntries.some(
                                  (entry) => entry.id === item.id,
                                )
                              )
                                return;
                              return (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={addExistingEntry}
                          className="w-full"
                          disabled={!selectedSourceId}
                        >
                          Adicionar
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Input
                          placeholder="Nome"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            placeholder="Iniciativa"
                            value={customInitiative}
                            onChange={(e) =>
                              setCustomInitiative(+e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            placeholder="HP"
                            value={customHp}
                            onChange={(e) => setCustomHp(+e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Max HP"
                            value={customMaxHp}
                            onChange={(e) => setCustomMaxHp(+e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={addCustomEntry}
                          className="w-full"
                          disabled={!customName || !customInitiative}
                        >
                          Adicionar
                        </Button>
                      </div>
                    )}
                  </Card>
                )}

                {/* Clear All */}
                {initiativeEntries.length > 0 && (
                  <Button
                    onClick={clearAll}
                    variant="destructive"
                    className="w-full"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Tudo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-border bg-bg-surface/50">
        <div className="px-6 py-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("/campaign/select")}
          >
            <SwitchCampaign className="w-4 h-4 mr-2" />
            Trocar Campanha
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
