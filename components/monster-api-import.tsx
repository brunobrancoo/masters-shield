"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useMonsters } from "@/lib/api/hooks";
import { mapGraphQLMonsterToMonster } from "@/lib/api/mappers";
import { graphqlClient } from "@/lib/graphql/client";
import { GetMonsterDocument } from "@/lib/generated/graphql";
import { Monster } from "@/lib/schemas";
import { Badge } from "./ui/badge";

interface MonsterApiImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (monster: Monster) => void;
}

export function MonsterApiImportDialog({
  open,
  onOpenChange,
  onImport,
}: MonsterApiImportDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useMonsters(debouncedQuery);

  const handleImportClick = async (monsterIndex: string) => {
    const result = await graphqlClient.request(GetMonsterDocument, {
      index: monsterIndex,
    });
    if (result.monster) {
      const mapped = mapGraphQLMonsterToMonster(result.monster);
      onImport(mapped);
      onOpenChange(false);
    }
  };

  const getCardColorByCR = (cr: number | string | undefined) => {
    const numericCR = typeof cr === "number" ? cr : parseFloat(cr || "0");
    if (numericCR <= 1) return "!border-emerald-600 !bg-emerald-950/40";
    if (numericCR <= 4) return "!border-green-600 !bg-green-950/40";
    if (numericCR <= 10) return "!border-amber-600 !bg-amber-950/40";
    if (numericCR <= 15) return "!border-orange-600 !bg-orange-950/40";
    return "!border-red-600 !bg-red-950/40";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-4 max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Importar Monstro da API D&D 5e</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Buscar monstro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <svg
                    className="w-12 h-12 mb-4 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p>Carregando monstros...</p>
                </div>
              ) : data?.monsters && data.monsters.length > 0 ? (
                <div className="space-y-3">
                  {data.monsters.map((monster) => (
                    <Card
                      key={monster?.index}
                      className={`transition-colors cursor-pointer ${getCardColorByCR(
                        monster?.challenge_rating,
                      )}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          {monster?.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={`https://dnd5eapi.co${monster.image}`}
                                alt={monster.name}
                                className="w-20 h-20 object-cover rounded-md bg-muted"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-2">
                            <p className="font-semibold text-base truncate">
                              {monster?.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className="text-xs py-0.5 rounded-full"
                                variant="secondary"
                              >
                                {monster?.type}
                              </Badge>
                              <Badge
                                className="text-xs py-0.5 rounded-full font-medium"
                                variant="default"
                              >
                                ND {monster?.challenge_rating}
                              </Badge>
                              {monster?.size && (
                                <Badge
                                  className="text-xs py-0.5 rounded-full"
                                  variant="outline"
                                >
                                  {monster.size}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="flex items-center gap-1">
                                <span className="font-medium text-muted-foreground">
                                  HP:
                                </span>
                                <span className="font-semibold text-foreground">
                                  {monster?.hit_points}
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium text-muted-foreground">
                                  AC:
                                </span>
                                <span className="font-semibold text-foreground">
                                  {monster?.armor_class?.[0]?.value ??
                                    monster?.armor_class?.value}
                                </span>
                              </span>
                              {monster?.xp && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium text-muted-foreground">
                                    XP:
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    {monster.xp}
                                  </span>
                                </span>
                              )}
                            </div>
                            {monster?.alignment && (
                              <p className="text-xs text-muted-foreground">
                                {monster.alignment}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex items-start">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleImportClick(monster?.index || "")
                              }
                            >
                              Importar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg
                    className="w-16 h-16 mb-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="font-medium text-lg mb-1">
                    Nenhum monstro encontrado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? `Não encontramos resultados para "${searchQuery}". Tente outro termo de busca.`
                      : "Digite o nome de um monstro para começar a busca."}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
