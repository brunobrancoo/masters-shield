"use client";

import { ShieldIcon, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGame } from "@/app/_contexts/game-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DiceRollModal from "./dice-roll";

export function PlayerHeader() {
  const { gameData } = useGame();
  const router = useRouter();

  return (
    <header className="border-b border-border-default bg-bg-surface/50 top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/campaign/select")}
              className="border-arcane-500/20 text-arcane-400 hover:bg-arcane-500/10 hover:border-arcane-500/30 text-xs px-3 py-1 h-auto"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Voltar
            </Button>
            <ShieldIcon className="w-10 h-10 text-class-accent glow-class" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-balance text-text-primary">
                Ficha do Jogador
              </h1>
              <p className="text-sm font-body text-text-secondary">
                Escudo do Mestre Digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DiceRollModal />
            <Card className="hidden md:block card-inset">
              <CardContent className="p-4">
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-class-accent font-body">
                      {gameData.playableCharacters.length}
                    </p>
                    <p className="text-xs text-text-secondary font-body">
                      Jogadores
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
