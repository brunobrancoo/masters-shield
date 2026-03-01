"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparklesIcon, DiceIcon } from "@/components/icons";
import { Pencil } from "lucide-react";
import { PlayableCharacter } from "@/lib/schemas";
import { generateRandomNPCData, getNPCFormDefaults } from "@/lib/npc-randomizer";

interface NPCGeneratorProps {
  onGenerate: (npc: PlayableCharacter) => void;
  onCreateManual: () => void;
}

export function NPCGenerator({ onGenerate, onCreateManual }: NPCGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRandom = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomData = generateRandomNPCData();
      const npc = getNPCFormDefaults(randomData) as PlayableCharacter;
      onGenerate(npc);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card className="parchment-texture metal-border">
        <CardHeader>
          <CardTitle className="font-sans text-2xl flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-primary" />
            Gerador de NPCs
          </CardTitle>
          <CardDescription className="font-serif">
            Escolha como criar seu NPC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGenerateRandom}
            disabled={isGenerating}
            className="w-full glow-silver"
            size="lg"
          >
            <DiceIcon className="w-5 h-5 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar NPC Aleatório"}
          </Button>

          <div className="text-center text-muted-foreground font-serif text-sm">
            ou
          </div>

          <Button
            onClick={onCreateManual}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Pencil className="w-5 h-5 mr-2" />
            Criar NPC Manualmente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
