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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DragonIcon, SwordIcon } from "@/components/icons";
import { Monster } from "@/lib/schemas";
import { MonsterApiImportDialog } from "./monster-api-import";

interface MonsterListProps {
  monsters: Monster[];
  onSelectMonster: (monster: Monster) => void;
  onImportMonster: (monster: Monster, mode: "save" | "edit") => void;
  onDeleteMonster: (id: string) => void;
}

export function MonsterList({
  monsters,
  onSelectMonster,
  onImportMonster,
  onDeleteMonster,
}: MonsterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const filteredMonsters = monsters.filter((monster) => {
    const matchesSearch =
      monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monster.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || monster.type === filterType;
    return matchesSearch && matchesType;
  });

  const monsterTypes = Array.from(new Set(monsters.map((m) => m.type)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar monstros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="metal-border bg-card"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportDialogOpen(true)}
            className="glow-silver"
          >
            Importar da API
          </Button>
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="glow-silver"
          >
            Todos
          </Button>
          {monsterTypes.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="glow-silver"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMonsters.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <DragonIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-sans text-lg">Nenhum monstro encontrado</p>
          </div>
        ) : (
          filteredMonsters.map((monster) => (
            <Card
              key={monster.id}
              className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer pt-0"
              onClick={() => onSelectMonster(monster)}
            >
              <CardContent className="p-0">
                <div className="space-y-3">
                  {monster.image && (
                    <div className="relative w-full bg-muted rounded-t-sm overflow-hidden">
                      <img
                        src={`https://www.dnd5eapi.co${monster.image}`}
                        alt={monster.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div className="absolute inset-e bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  )}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="font-sans text-lg text-balance mb-1">
                          {monster.name}
                        </CardTitle>
                        <CardDescription className="font-serif">
                          <Badge variant="secondary" className="text-xs">
                            {monster.type}
                          </Badge>
                          {monster.size && (
                            <Badge variant="outline" className="text-xs ml-1">
                              {monster.size}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <DragonIcon className="w-6 h-6 text-primary flex-shrink-0" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm font-serif">
                      <div className="flex items-center justify-between bg-muted/30 rounded px-2 py-1">
                        <span className="text-muted-foreground text-xs">
                          ND:
                        </span>
                        <span className="font-bold text-primary">
                          {monster.challenge_rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted/30 rounded px-2 py-1">
                        <span className="text-muted-foreground text-xs">
                          PV:
                        </span>
                        <span className="font-bold text-destructive">
                          {monster.hp}/{monster.maxHp}
                        </span>
                      </div>
                      {monster.armor_class &&
                        monster.armor_class.length > 0 && (
                          <div className="flex items-center justify-between bg-muted/30 rounded px-2 py-1">
                            <span className="text-muted-foreground text-xs">
                              CA:
                            </span>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {monster.armor_class[0]?.value ?? 10}
                            </span>
                          </div>
                        )}
                      {monster.xp && monster.xp > 0 && (
                        <div className="flex items-center justify-between bg-muted/30 rounded px-2 py-1">
                          <span className="text-muted-foreground text-xs">
                            XP:
                          </span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {monster.xp}
                          </span>
                        </div>
                      )}
                    </div>
                    {monster.special_abilities.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-2">
                          <SwordIcon className="w-3 h-3" />
                          <span className="text-xs font-semibold">
                            Habilidades Especiais:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {monster.special_abilities
                            .slice(0, 3)
                            .map((ability, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {ability.name}
                              </Badge>
                            ))}
                          {monster.special_abilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{monster.special_abilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <MonsterApiImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={(monster) => onImportMonster(monster, "save")}
      />
    </div>
  );
}
