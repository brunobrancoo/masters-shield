"use client";

import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Swords,
  Plus,
  Play,
  SkipForward,
  RotateCcw,
  Trash2,
  LogOut,
  Swords as SwitchCampaign,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useCombat } from "@/app/_contexts/combat-context";
import { useAuth } from "@/lib/auth-context";
import InitiativeEntryCard from "./initiative-entry-card";
import AddEntryForm from "./add-entry-form";

export default function AppSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const {
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
                      return (
                        <InitiativeEntryCard
                          key={entry.id}
                          entry={entry}
                          index={index}
                          isCurrentTurn={isCurrentTurn}
                          updateInitiative={updateInitiative}
                          removeEntry={removeEntry}
                          updateHp={updateHp}
                          onCombat={onCombat}
                        />
                      );
                    })
                  )}
                </div>

                <AddEntryForm
                  showAddForm={showAddForm}
                  resetAddForm={resetAddForm}
                  sourceType={sourceType}
                  setSourceType={setSourceType as any}
                  selectedSourceId={selectedSourceId}
                  setSelectedSourceId={setSelectedSourceId}
                  getSourceList={getSourceList}
                  initiativeEntries={initiativeEntries}
                  addExistingEntry={() => {}}
                  customName={customName}
                  setCustomName={setCustomName}
                  customInitiative={customInitiative}
                  setCustomInitiative={setCustomInitiative}
                  customHp={customHp}
                  setCustomHp={setCustomHp}
                  customMaxHp={customMaxHp}
                  setCustomMaxHp={setCustomMaxHp}
                  addCustomEntry={addCustomEntry}
                />

                {!showAddForm && (
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
                )}

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
