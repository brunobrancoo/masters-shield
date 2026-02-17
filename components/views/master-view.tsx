"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DragonIcon,
  UsersIcon,
  SparklesIcon,
  ScrollIcon,
} from "@/components/icons";
import { MonsterList } from "@/components/monster-list";
import { MonsterForm } from "@/components/monster-form";
import { MonsterSheet } from "@/components/monster-sheet";
import { PlayerList } from "@/components/player-list";
import PlayerForm from "@/components/player-form";
import { NPCGenerator } from "@/components/npc-generator";
import { NPCList } from "@/components/npc-list";
import { NPCSheet } from "@/components/npc-sheet";
import { useDisclosure } from "@/lib/use-disclosure";
import { Dialog } from "@/components/ui/dialog";
import { useGame } from "@/app/_contexts/game-context";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { CharacterSheetContent } from "@/app/campaign/[campaignId]/character/[playableCharacterId]/page";
import { useCampaign } from "@/lib/campaign-context";
import { useEffect } from "react";

export function MasterView() {
  const playerDisclosure = useDisclosure();
  const monsterDisclosure = useDisclosure();
  const npcDisclosure = useDisclosure();
  const { open: sidebarOpen } = useSidebar();

  const {
    setNPCViewState,
    setPlayableCharacterViewState,
    setMonsterViewState,
    setActiveTab,
    selectedNPC,
    selectedMonster,
    selectedPlayableCharacter,
    playableCharacterView,
    npcView,
    monsterView,
    gameData,
    activeTab,
    setSelectedNPC,
    setSelectedMonster,
    setSelectedPlayableCharacter,
    handleSaveMonster,
    handleUpdateMonster,
    handleDeleteMonster,
    handleSavePlayer,
    handleDeletePlayableCharacter,
    handleGenerateNPC,
    handleUpdateNPC,
    handleDeleteNPC,
  } = useGame();

  const {
    isOpen: playerIsOpen,
    onOpen: onPlayerOpen,
    onClose: onPlayerClose,
    onToggle: onPlayerToggle,
  } = playerDisclosure;
  const {
    isOpen: monsterIsOpen,
    onOpen: onMonsterOpen,
    onClose: onMonsterClose,
    onToggle: onMonsterToggle,
  } = monsterDisclosure;
  const {
    isOpen: npcIsOpen,
    onOpen: onNPCOpen,
    onClose: onNPCClose,
    onToggle: onNPCToggle,
  } = npcDisclosure;
  const { campaign } = useCampaign();
  if (!campaign) return null;
  useEffect(() => {
    if (!selectedPlayableCharacter) setPlayableCharacterViewState("list");
  }, [selectedPlayableCharacter]);

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="monsters" className="font-sans">
              <DragonIcon className="w-4 h-4 mr-2" />
              Monstros
            </TabsTrigger>
            <TabsTrigger value="players" className="font-sans">
              <UsersIcon className="w-4 h-4 mr-2" />
              Jogadores
            </TabsTrigger>
            <TabsTrigger value="npcs" className="font-sans">
              <SparklesIcon className="w-4 h-4 mr-2" />
              NPCs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monsters" className="space-y-6">
            <Card className="metal-border bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-sans text-2xl flex items-center gap-2">
                      <DragonIcon className="w-4 h-4 mr-2" />
                      Bestiário
                    </CardTitle>
                    <CardDescription className="font-serif">
                      Gerencie as criaturas da sua campanha
                    </CardDescription>
                  </div>
                  {monsterView === "list" && (
                    <Button
                      onClick={() => {
                        setSelectedMonster(undefined);
                        setMonsterViewState("form");
                      }}
                      className="glow-silver"
                    >
                      Novo Monstro
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {monsterView === "list" && (
                  <MonsterList
                    monsters={gameData.monsters}
                    onSelectMonster={(m) => {
                      setSelectedMonster(m);
                      setMonsterViewState("sheet");
                    }}
                    onDeleteMonster={(id) => {}}
                  />
                )}
                {monsterView === "form" && (
                  <MonsterForm
                    monster={selectedMonster}
                    onSave={handleSaveMonster}
                    onCancel={() => {
                      setMonsterViewState("list");
                      setSelectedMonster(undefined);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <Card className="metal-border bg-card/50">
              {playableCharacterView === "list" && (
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-sans text-2xl flex items-center gap-2">
                        <UsersIcon className="w-6 h-6" />
                        Grupo de Aventureiros
                      </CardTitle>
                      <CardDescription className="font-serif">
                        Fichas dos personagens dos jogadores
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPlayableCharacter(undefined);
                        setPlayableCharacterViewState("form");
                      }}
                      className="glow-silver"
                    >
                      Novo Jogador
                    </Button>
                  </div>
                </CardHeader>
              )}
              <CardContent>
                {playableCharacterView === "list" && (
                  <PlayerList
                    players={gameData.playableCharacters}
                    onSelectPlayerAction={(p) => {
                      setSelectedPlayableCharacter(p);
                      setPlayableCharacterViewState("sheet");
                      onPlayerOpen();
                    }}
                    onDeletePlayerAction={(id) => {}}
                    onSaveAction={handleSavePlayer}
                  />
                )}
                {playableCharacterView === "form" &&
                  selectedPlayableCharacter?.id && (
                    <PlayerForm
                      key={selectedPlayableCharacter.id || "new"}
                      playableCharacter={selectedPlayableCharacter}
                      onSaveAction={handleSavePlayer}
                      onCancelAction={() => {
                        setPlayableCharacterViewState("list");
                        setSelectedPlayableCharacter(undefined);
                      }}
                    />
                  )}

                {playableCharacterView === "sheet" &&
                  selectedPlayableCharacter?.id && (
                    <CharacterSheetContent
                      campaignId={campaign.id}
                      playableCharacterId={selectedPlayableCharacter.id}
                      view="master"
                    />
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="npcs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <Card className="metal-border bg-card/50 min-w-40">
                  <CardHeader>
                    <CardTitle className="font-sans text-lg">
                      <ScrollIcon className="w-5 h-5 inline mr-2" />
                      Ações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={npcView === "generator" ? "default" : "outline"}
                      className={cn("w-full justify-start")}
                      onClick={() => setNPCViewState("generator")}
                    >
                      {sidebarOpen ? (
                        ""
                      ) : (
                        <SparklesIcon className="w-4 h-4 mr-2" />
                      )}
                      Gerar NPC
                    </Button>
                    <Button
                      variant={npcView === "list" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setNPCViewState("list")}
                    >
                      {sidebarOpen ? (
                        ""
                      ) : (
                        <UsersIcon className="w-4 h-4 mr-2" />
                      )}
                      Ver Lista ({gameData.npcs.length})
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4">
                {npcView === "generator" && (
                  <NPCGenerator onGenerate={handleGenerateNPC} />
                )}
                {npcView === "list" && (
                  <Card className="metal-border bg-card/50">
                    <CardHeader>
                      <CardTitle className="font-sans text-2xl flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6" />
                        NPCs Gerados
                      </CardTitle>
                      <CardDescription className="font-serif">
                        Personagens não-jogadores da campanha
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NPCList
                        npcs={gameData.npcs}
                        onSelectNPC={(n) => {
                          setSelectedNPC(n);
                          setNPCViewState("sheet");
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {monsterView === "sheet" && selectedMonster && (
        <MonsterSheet
          monster={selectedMonster}
          onSave={handleUpdateMonster}
          onDelete={() => handleDeleteMonster(selectedMonster.id)}
          onClose={() => {
            setMonsterViewState("list");
            setSelectedMonster(undefined);
          }}
          monsterIsOpen={monsterIsOpen}
          onMonsterOpen={onMonsterOpen}
          onMonsterClose={onMonsterClose}
          onMonsterToggle={onMonsterToggle}
        />
      )}

      {npcView === "sheet" && selectedNPC && (
        <NPCSheet
          npc={selectedNPC}
          onSave={handleUpdateNPC}
          onDelete={() => handleDeleteNPC(selectedNPC.id)}
          onClose={() => {
            setNPCViewState("list");
            setSelectedNPC(undefined);
          }}
          npcIsOpen={npcIsOpen}
          onNPCOpen={onNPCOpen}
          onNPCClose={onNPCClose}
          onNPCToggle={onNPCToggle}
        />
      )}

      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground font-serif">
            Escudo do Mestre Digital - Criado para mestres de RPG apaixonados
          </p>
        </div>
      </footer>
    </div>
  );
}
