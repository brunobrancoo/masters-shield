"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon } from "@/components/icons";
import { NPC } from "@/lib/interfaces/interfaces";

interface NPCListProps {
  npcs: NPC[];
  onSelectNPC: (npc: NPC) => void;
}

export function NPCList({ npcs, onSelectNPC }: NPCListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNPCs = npcs.filter((npc) => {
    return (
      npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      npc.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      npc.race.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Buscar NPCs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="metal-border bg-card"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNPCs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-sans text-lg">Nenhum NPC encontrado</p>
          </div>
        ) : (
          filteredNPCs.map((npc) => (
            <Card
              key={npc.id}
              className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer"
              onClick={() => onSelectNPC(npc)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-sans text-lg text-balance">
                      {npc.name}
                    </CardTitle>
                    <CardDescription className="font-serif mt-1">
                      {npc.race} {npc.class}
                    </CardDescription>
                  </div>
                  <SparklesIcon className="w-6 h-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-serif">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nível:</span>
                    <Badge variant="default">{npc.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PV:</span>
                    <span className="font-bold text-destructive">{npc.hp}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground italic truncate">
                      {npc.personality}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
