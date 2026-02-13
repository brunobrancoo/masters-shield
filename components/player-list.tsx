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
import { UsersIcon, ShieldIcon, SwordIcon } from "@/components/icons";
import { CrossIcon, ForkKnifeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { PlayableCharacter } from "@/lib/interfaces/interfaces";

interface PlayerListProps {
  players: PlayableCharacter[];
  onSelectPlayerAction: (player: PlayableCharacter) => void;
  onDeletePlayerAction: (id: string) => void;
  onSaveAction: (player: PlayableCharacter) => void;
}

export function PlayerList({
  players,
  onSelectPlayerAction,
  onDeletePlayerAction,
  onSaveAction,
}: PlayerListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = players.filter((player) => {
    return (
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.raceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Buscar jogadores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="metal-border bg-card"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-sans text-lg">Nenhum jogador encontrado</p>
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <Card
              key={player.id}
              className="parchment-texture metal-border hover:glow-gold transition-all "
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle
                      className="font-sans text-lg text-balance cursor-pointer"
                      onClick={() => onSelectPlayerAction(player)}
                    >
                      {player.name}
                    </CardTitle>
                    <CardDescription className="font-serif mt-1">
                      {player.raceName} {player.className}
                    </CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => {}}>
                      <SwordIcon className="w-6 h-6 text-primary" />
                    </Button>

                    <Button variant="ghost">
                      <CrossIcon className="w-6 h-6 text-primary" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-serif">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nível:</span>
                    <Badge variant="default">{player.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PV:</span>
                    <span className="font-bold text-destructive">
                      {player.hp}/{player.maxHp}
                    </span>
                  </div>
                  {player.inventory.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs text-muted-foreground">
                        {player.inventory.length}{" "}
                        {player.inventory.length === 1 ? "item" : "itens"} no
                        inventário
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
