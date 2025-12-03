"use client";
import { ShieldIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useGame } from "@/app/contexts/game-context";
import { DiceIcon } from "./icons";
import { useDisclosure } from "@/lib/use-disclosure";
import DiceRollModal from "./dice-roll";

export default function Header() {
  const { gameData } = useGame();
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  return (
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

          <div className="flex items-center gap-8">
            <DiceRollModal />
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
      </div>
    </header>
  );
}
