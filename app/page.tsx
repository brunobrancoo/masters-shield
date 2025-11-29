"use client";

import { useState, useEffect } from "react";
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
  ShieldIcon,
  DragonIcon,
  UsersIcon,
  SparklesIcon,
  ScrollIcon,
} from "@/components/icons";
import type { Monster, Player, NPC, GameData } from "@/lib/storage";
import { loadGameData, saveGameData } from "@/lib/storage";
import { MonsterList } from "@/components/monster-list";
import { MonsterForm } from "@/components/monster-form";
import { MonsterSheet } from "@/components/monster-sheet";
import { PlayerList } from "@/components/player-list";
import { PlayerForm } from "@/components/player-form";
import { PlayerSheet } from "@/components/player-sheet";
import { NPCGenerator } from "@/components/npc-generator";
import { NPCList } from "@/components/npc-list";
import { NPCSheet } from "@/components/npc-sheet";
import type { MonsterFormData, NPCFormData } from "@/lib/schemas";
import { useDisclosure } from "@/lib/use-disclosure";
import { Dialog } from "@/components/ui/dialog";

type ViewMode = "list" | "form" | "sheet";

export default function MasterShieldApp() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [gameData, setGameData] = useState<GameData>({
    monsters: [],
    players: [],
    npcs: [],
  });

  const [activeTab, setActiveTab] = useState("monsters");

  // Monster state
  const [monsterView, setMonsterView] = useState<ViewMode>("list");
  const [selectedMonster, setSelectedMonster] = useState<Monster | undefined>();

  // Player state
  const [playerView, setPlayerView] = useState<ViewMode>("list");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  // NPC state
  const [npcView, setNPCView] = useState<"generator" | "list" | "sheet">(
    "generator",
  );
  const [selectedNPC, setSelectedNPC] = useState<NPC | undefined>();

  // Load data on mount
  useEffect(() => {
    const data = loadGameData();
    setGameData(data);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveGameData(gameData);
  }, [gameData]);

  // Monster handlers
  const handleSaveMonster = (monster: Monster) => {
    setGameData((prev) => {
      const exists = prev.monsters.find((m) => m.id === monster.id);
      if (exists) {
        return {
          ...prev,
          monsters: prev.monsters.map((m) =>
            m.id === monster.id ? monster : m,
          ),
        };
      }
      return {
        ...prev,
        monsters: [...prev.monsters, monster],
      };
    });
    setMonsterView("list");
    setSelectedMonster(undefined);
  };

  const handleUpdateMonster = (data: MonsterFormData) => {
    if (!selectedMonster) return;

    const updatedMonster: Monster = {
      ...selectedMonster,
      ...data,
    };

    setGameData((prev) => ({
      ...prev,
      monsters: prev.monsters.map((m) =>
        m.id === selectedMonster.id ? updatedMonster : m,
      ),
    }));

    setSelectedMonster(updatedMonster);
  };

  const handleDeleteMonster = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      monsters: prev.monsters.filter((m) => m.id !== id),
    }));
    setMonsterView("list");
    setSelectedMonster(undefined);
  };

  // Player handlers
  const handleSavePlayer = (player: Player) => {
    setGameData((prev) => {
      const exists = prev.players.find((p) => p.id === player.id);
      if (exists) {
        return {
          ...prev,
          players: prev.players.map((p) => (p.id === player.id ? player : p)),
        };
      }
      return {
        ...prev,
        players: [...prev.players, player],
      };
    });
    setPlayerView("list");
    setSelectedPlayer(undefined);
  };

  const handleDeletePlayer = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
    }));
    setPlayerView("list");
    setSelectedPlayer(undefined);
  };

  // NPC handlers
  const handleGenerateNPC = (npc: NPC) => {
    setGameData((prev) => ({
      ...prev,
      npcs: [...prev.npcs, npc],
    }));
    setNPCView("list");
  };

  const handleUpdateNPC = (data: NPCFormData) => {
    if (!selectedNPC) return;

    const updatedNPC: NPC = {
      ...selectedNPC,
      ...data,
    };

    setGameData((prev) => ({
      ...prev,
      npcs: prev.npcs.map((n) => (n.id === selectedNPC.id ? updatedNPC : n)),
    }));

    setSelectedNPC(updatedNPC);
  };

  const handleDeleteNPC = (id: string) => {
    setGameData((prev) => ({
      ...prev,
      npcs: prev.npcs.filter((n) => n.id !== id),
    }));
    setNPCView("list");
    setSelectedNPC(undefined);
  };

  return (
    <div className="min-h-screen bg-background parchment-texture">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldIcon className="w-10 h-10 text-primary glow-silver" />
              <div>
                <h1 className="text-3xl font-sans font-bold text-balance">
                  Escudo do Mestre Digital
                </h1>
                <p className="text-sm font-serif text-muted-foreground">
                  Gerencie suas campanhas de RPG com praticidade
                </p>
              </div>
            </div>

            <Card className="hidden md:block bg-primary/10 border-primary/30">
              <CardContent className="p-4">
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {gameData.monsters.length}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      Monstros
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {gameData.players.length}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      Jogadores
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {gameData.npcs.length}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      NPCs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

          {/* Monsters Tab */}
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
                        setMonsterView("form");
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
                      setMonsterView("sheet");
                    }}
                    onDeleteMonster={handleDeleteMonster}
                  />
                )}
                {monsterView === "form" && (
                  <MonsterForm
                    monster={selectedMonster}
                    onSave={handleSaveMonster}
                    onCancel={() => {
                      setMonsterView("list");
                      setSelectedMonster(undefined);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <Card className="metal-border bg-card/50">
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
                  {playerView === "list" && (
                    <Button
                      onClick={() => {
                        setSelectedPlayer(undefined);
                        setPlayerView("form");
                      }}
                      className="glow-silver"
                    >
                      Novo Jogador
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {playerView === "list" && (
                  <PlayerList
                    onSaveAction={handleSavePlayer}
                    players={gameData.players}
                    onSelectPlayerAction={(p) => {
                      setSelectedPlayer(p);
                      setPlayerView("sheet");
                      onOpen();
                    }}
                    onDeletePlayerAction={handleDeletePlayer}
                  />
                )}
                {playerView === "form" && (
                  <PlayerForm
                    player={selectedPlayer}
                    onSaveAction={handleSavePlayer}
                    onCancelAction={() => {
                      setPlayerView("list");
                      setSelectedPlayer(undefined);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NPCs Tab */}
          <TabsContent value="npcs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Sidebar with quick actions */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="metal-border bg-card/50">
                  <CardHeader>
                    <CardTitle className="font-sans text-lg">
                      <ScrollIcon className="w-5 h-5 inline mr-2" />
                      Ações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={npcView === "generator" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setNPCView("generator")}
                    >
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Gerar NPC
                    </Button>
                    <Button
                      variant={npcView === "list" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setNPCView("list")}
                    >
                      <UsersIcon className="w-4 h-4 mr-2" />
                      Ver Lista ({gameData.npcs.length})
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Main content area */}
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
                          setNPCView("sheet");
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

      {/* Modals */}
      {monsterView === "sheet" && selectedMonster && (
        <MonsterSheet
          monster={selectedMonster}
          onSave={handleUpdateMonster}
          onDelete={() => handleDeleteMonster(selectedMonster.id)}
          onClose={() => {
            setMonsterView("list");
            setSelectedMonster(undefined);
          }}
        />
      )}

      {playerView === "sheet" && selectedPlayer && (
        <Dialog
          open={isOpen}
          onOpenChange={() => {
            setPlayerView("list");
            setSelectedPlayer(undefined);
            onToggle();
          }}
        >
          {selectedPlayer && (
            <PlayerSheet
              player={selectedPlayer}
              onEdit={() => {
                setPlayerView("form");
                onClose();
              }}
              onDelete={() => {
                handleDeletePlayer(selectedPlayer.id);
                onClose();
              }}
              onClose={() => {
                setPlayerView("list");
                setSelectedPlayer(undefined);
                onClose();
              }}
            />
          )}
        </Dialog>
      )}

      {npcView === "sheet" && selectedNPC && (
        <NPCSheet
          npc={selectedNPC}
          onSave={handleUpdateNPC}
          onDelete={() => handleDeleteNPC(selectedNPC.id)}
          onClose={() => {
            setNPCView("list");
            setSelectedNPC(undefined);
          }}
        />
      )}

      {/* Footer */}
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
