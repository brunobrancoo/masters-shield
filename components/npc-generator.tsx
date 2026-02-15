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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SparklesIcon, DiceIcon } from "@/components/icons";
import { generateNPC } from "@/lib/npc-generator";
import { NPC } from "@/lib/schemas";

const RACES = [
  "Humano",
  "Elfo",
  "Anão",
  "Halfling",
  "Gnomo",
  "Meio-Elfo",
  "Meio-Orc",
  "Tiefling",
  "Draconato",
];

const CLASSES = [
  "Guerreiro",
  "Mago",
  "Clérigo",
  "Ladino",
  "Paladino",
  "Ranger",
  "Bárbaro",
  "Bardo",
  "Druida",
  "Monge",
  "Feiticeiro",
  "Bruxo",
];

interface NPCGeneratorProps {
  onGenerate: (npc: NPC) => void;
}

export function NPCGenerator({ onGenerate }: NPCGeneratorProps) {
  const [level, setLevel] = useState<number>(1);
  const [race, setRace] = useState<string>("random");
  const [className, setClassName] = useState<string>("random");
  const [generatedNPC, setGeneratedNPC] = useState<NPC | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Pequeno delay para animação
    setTimeout(() => {
      const npc = generateNPC(
        level,
        race === "random" ? undefined : race,
        className === "random" ? undefined : className,
      );
      setGeneratedNPC(npc);
      setIsGenerating(false);
    }, 500);
  };

  const handleSave = () => {
    if (generatedNPC) {
      onGenerate(generatedNPC);
      setGeneratedNPC(null);
    }
  };

  const calculateModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod.toString();
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
            Configure os parâmetros e gere um NPC automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level" className="font-sans">
                Nível
              </Label>
              <Select
                value={level.toString()}
                onValueChange={(v) => setLevel(Number.parseInt(v))}
              >
                <SelectTrigger id="level" className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((l) => (
                    <SelectItem key={l} value={l.toString()}>
                      Nível {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="race" className="font-sans">
                Raça
              </Label>
              <Select value={race} onValueChange={setRace}>
                <SelectTrigger id="race" className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Aleatória</SelectItem>
                  {RACES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class" className="font-sans">
                Classe
              </Label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger id="class" className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Aleatória</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full glow-silver"
            size="lg"
          >
            <DiceIcon className="w-5 h-5 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar NPC"}
          </Button>
        </CardContent>
      </Card>

      {generatedNPC && (
        <Card className="parchment-texture metal-border glow-gold animate-fadeIn">
          <CardHeader>
            <CardTitle className="font-sans text-2xl text-balance">
              {generatedNPC.name}
            </CardTitle>
            <CardDescription className="font-serif text-base">
              {generatedNPC.race} {generatedNPC.class} - Nível{" "}
              {generatedNPC.level}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground font-sans">PV</p>
                  <p className="text-3xl font-bold text-destructive">
                    {generatedNPC.hp}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground font-sans">
                    Nível
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {generatedNPC.level}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-sans text-lg mb-3">Atributos</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(generatedNPC.attributes).map(([key, value]) => (
                  <Card key={key} className="bg-card">
                    <CardContent className="pt-3 pb-2 text-center">
                      <p className="text-xs uppercase font-sans text-muted-foreground mb-1">
                        {key}
                      </p>
                      <p className="text-xl font-bold">{value}</p>
                      <p className="text-xs text-primary font-mono">
                        {calculateModifier(value)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {generatedNPC.skills.length > 0 && (
              <div>
                <h3 className="font-sans text-lg mb-2">Habilidades</h3>
                <div className="space-y-2">
                  {generatedNPC.skills.map((skill, index) => (
                    <Card key={index} className="bg-secondary/20">
                      <CardContent className="p-3">
                        <p className="font-serif text-sm">{skill}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h3 className="font-sans text-sm mb-2">Personalidade</h3>
                <p className="font-serif leading-relaxed">
                  {generatedNPC.personality}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setGeneratedNPC(null)}>
                Descartar
              </Button>
              <Button onClick={handleSave} className="glow-silver">
                Salvar NPC
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
