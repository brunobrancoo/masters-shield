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
import { Monster } from "@/lib/interfaces/interfaces";

interface MonsterListProps {
  monsters: Monster[];
  onSelectMonster: (monster: Monster) => void;
  onDeleteMonster: (id: string) => void;
}

export function MonsterList({
  monsters,
  onSelectMonster,
  onDeleteMonster,
}: MonsterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

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
              className="parchment-texture metal-border hover:glow-gold transition-all cursor-pointer"
              onClick={() => onSelectMonster(monster)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-sans text-lg text-balance">
                      {monster.name}
                    </CardTitle>
                    <CardDescription className="font-serif">
                      <Badge variant="secondary" className="mt-1">
                        {monster.type}
                      </Badge>
                    </CardDescription>
                  </div>
                  <DragonIcon className="w-6 h-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-serif">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nível:</span>
                    <span className="font-bold text-primary">
                      {monster.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PV:</span>
                    <span className="font-bold text-destructive">
                      {monster.hp}
                    </span>
                  </div>
                  {monster.skills.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <SwordIcon className="w-3 h-3" />
                        <span className="text-xs">Habilidades:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {monster.skills.slice(0, 2).map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {monster.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{monster.skills.length - 2}
                          </Badge>
                        )}
                      </div>
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
