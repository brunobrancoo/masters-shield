"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldIcon, UsersIcon } from "@/components/icons";
import { Player } from "@/lib/interfaces/interfaces";
import { useGame } from "@/app/_contexts/game-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerForm from "@/components/player-form";
import { UserPlus } from "lucide-react";

export default function CharacterSelectionPage() {
  const router = useRouter();
  const { gameData, handleSavePlayer } = useGame();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPlayers = gameData.players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "all" || player.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const playerClasses = Array.from(
    new Set(gameData.players.map((p) => p.class)),
  );

  return (
    <div className="min-h-screen bg-background parchment-texture">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-sans text-3xl mb-2 flex items-center gap-3">
              <ShieldIcon className="w-8 h-8 text-primary" />
              Selecionar Personagem
            </h1>
            <p className="font-serif text-muted-foreground">
              Escolha seu personagem para ver a ficha completa
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Buscar personagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="metal-border bg-card"
          />

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterClass === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilterClass("all")}
              className="glow-silver"
            >
              Todas as Classes
            </Button>
            {playerClasses.map((className) => (
              <Button
                key={className}
                variant={filterClass === className ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterClass(className)}
                className="glow-silver"
              >
                {className}
              </Button>
            ))}
          </div>
        </div>

        {/* Create Player Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full glow-silver"
            variant="outline"
          >
            Criar novo personagem
          </Button>
        </div>

        {/* Player Grid */}
        {filteredPlayers.length === 0 ? (
          <Card className="metal-border bg-card/50">
            <CardContent className="py-12 text-center">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-sans text-lg text-muted-foreground">
                Nenhum personagem encontrado
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4"
                variant={"martial"}
              >
                Crie um novo personagem
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <Card
                key={player.id}
                className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer"
                onClick={() => router.push(`/player/${player.id}`)}
              >
                <CardHeader>
                  <CardTitle className="font-sans text-xl text-balance">
                    {player.name}
                  </CardTitle>
                  <CardDescription className="font-serif">
                    {player.race} {player.class} -{" "}
                    <span className="text-primary font-bold">
                      Nível {player.level}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-serif">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Pontos de Vida:
                      </span>
                      <span className="font-bold text-destructive">
                        {player.hp}/{player.maxHp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Classe de Armadura:
                      </span>
                      <span className="font-bold text-primary">
                        {player.ac ?? 10}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Character Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <ScrollArea className="flex-1 min-h-0">
            <DialogContent className="max-w-5xl max-h-[90vh] bg-bg-elevated border-border-strong p-0 flex flex-col overflow-auto">
              <DialogHeader className="shrink-0 border-b border-border-default p-8 pb-6">
                <DialogTitle className="font-heading text-2xl flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-arcane-500/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-arcane-400" />
                  </span>
                  Criar Novo Personagem
                </DialogTitle>
              </DialogHeader>

              <div className="p-8">
                <PlayerForm
                  onSaveAction={(player) => {
                    handleSavePlayer(player);
                    setIsCreateModalOpen(false);
                  }}
                  onCancelAction={() => setIsCreateModalOpen(false)}
                  hideActions
                />
              </div>

              <DialogFooter className="shrink-0 border-t border-border-default p-6 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border-border-default hover:bg-bg-surface"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="player-form"
                  className="bg-arcane-500 hover:bg-arcane-400 text-white glow-arcane"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Personagem
                </Button>
              </DialogFooter>
            </DialogContent>
          </ScrollArea>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground font-serif">
            Ficha do Jogador - Escudo do Mestre Digital
          </p>
        </div>
      </footer>
    </div>
  );
}
