"use client";
import { ShieldIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useGame } from "@/app/_contexts/game-context";
import { useDisclosure } from "@/lib/use-disclosure";
import DiceRollModal from "./dice-roll";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  const { gameData } = useGame();
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  return (
    <header className="border-b border-border-default bg-bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <SidebarTrigger />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldIcon className="w-10 h-10 text-class-accent glow-class" />
            <div>
              <h1 className="text-3xl font-heading font-bold text-balance text-text-primary">
                Escudo do Mestre Digital
              </h1>
              <p className="text-sm font-body text-text-secondary">
                Gerencie suas campanhas de RPG com praticidade
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <DiceRollModal />
            <Card className="hidden md:block card-inset">
              <CardContent className="p-4">
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-class-accent font-body">
                      {gameData.monsters.length}
                    </p>
                    <p className="text-xs text-text-secondary font-body">
                      Monstros
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-class-accent font-body">
                      {gameData.playableCharacters.length}
                    </p>
                    <p className="text-xs text-text-secondary font-body">
                      Jogadores
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-class-accent font-body">
                      {gameData.npcs.length}
                    </p>
                    <p className="text-xs text-text-secondary font-body">
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
