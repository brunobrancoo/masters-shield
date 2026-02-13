"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { ShieldIcon, SwordIcon, ScrollIcon } from "@/components/icons";
import { DialogTitle } from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { PlayableCharacter } from "@/lib/interfaces/interfaces";
import { getArchetype, getHPColor, getHPClass } from "@/lib/theme";

interface PlayerSheetProps {
  playableCharacter: PlayableCharacter;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  playerIsOpen: boolean;
  onPlayerOpen: () => void;
  onPlayerClose: () => void;
  onPlayerToggle: () => void;
}

export function PlayerSheet({
  playableCharacter,
  onEdit,
  onDelete,
  onClose,
  playerIsOpen,
  onPlayerOpen,
  onPlayerClose,
  onPlayerToggle,
}: PlayerSheetProps) {
  const calculateModifier = (value: number) => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  const archetype = getArchetype(playableCharacter.className);
  const hpPercentage = playableCharacter.maxHp ? (playableCharacter.hp / playableCharacter.maxHp) * 100 : 100;
  const hpColor = getHPColor(hpPercentage);
  const hpClass = getHPClass(hpPercentage);

  return (
    <DialogContent
      className="max-w-2xl p-6"
      showCloseButton={false}
      data-archetype={archetype}
    >
      <DialogTitle className="hidden" />
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="font-heading text-3xl flex items-center gap-3 text-text-primary">
                <ShieldIcon className="w-8 h-8 text-class-accent" />
                {playableCharacter.name}
              </CardTitle>
              <CardDescription className="font-body text-base mt-2 text-text-secondary">
                {playableCharacter.raceName} {playableCharacter.className} -{" "}
                <span className="text-class-accent font-bold">
                  Nível {playableCharacter.level}
                </span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* HP */}
          <Card className={`card-inset ${hpClass}`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <ShieldIcon className="w-8 h-8 mx-auto mb-2" style={{ color: hpColor }} />
                <p className="section-label mb-2">
                  Pontos de Vida
                </p>
                <p className="text-4xl font-bold font-body" style={{ color: hpColor }}>
                  {playableCharacter.hp}
                  {playableCharacter.maxHp && playableCharacter.maxHp !== playableCharacter.hp && (
                    <span className="text-lg text-text-tertiary ml-2">
                      / {playableCharacter.maxHp}
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          <div>
            <h3 className="font-heading text-xl mb-4 flex items-center gap-2 text-text-primary">
              <ScrollIcon className="w-5 h-5 text-class-accent" />
              Atributos
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(playableCharacter.attributes).map(([key, value]) => (
                <Card key={key} className="card-inset">
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className="section-label mb-1">
                      {key}
                    </p>
                    <p className="text-2xl font-bold font-body text-text-primary">{value}</p>
                    <p className="text-sm text-class-accent font-mono font-medium">
                      {calculateModifier(value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Inventory */}
          {(playableCharacter.inventory && playableCharacter.inventory.length > 0) && (
            <div>
              <h3 className="font-heading text-xl mb-3 flex items-center gap-2 text-text-primary">
                <SwordIcon className="w-5 h-5 text-class-accent" />
                Inventário
              </h3>
              <Card className="card-inset">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {playableCharacter.inventory.map((item, index) => (
                      <div
                        key={index}
                        className="bg-bg-surface p-3 rounded border border-border-subtle"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold font-heading text-sm text-text-primary">{item.name}</p>
                          {item.equipped && (
                            <span className="text-xs bg-class-accent text-white px-2 py-0.5 rounded badge-base">
                              Equipado
                            </span>
                          )}
                          {item.magic && (
                            <span className="text-xs bg-arcane-400/20 text-arcane-400 px-2 py-0.5 rounded badge-base">
                              Mágico
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">
                          {item.type === "weapon"
                            ? `Arma • ${item.distance === "melee" ? "Corpo a corpo" : "À distância"} • ${item.damageLegacy ? `${item.damageLegacy.dice}d${item.damageLegacy.number}` : item.damage?.damage_dice || ""}${item.damageLegacy?.type || item.damage?.damage_type?.name || ""}`
                            : item.type === "armor"
                              ? "Armadura"
                              : "Escudo"}
                        </p>
                        <p className="text-xs text-text-secondary">
                          Preço: {item.price ?? `${item.cost?.quantity ?? 0} ${item.cost?.unit ?? "gp"}`}{" "}
                          {item.attackbonus !== 0 &&
                            `• ATK +${item.attackbonus}`}{" "}
                          {item.defensebonus !== 0 &&
                            `• DEF +${item.defensebonus}`}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-text-secondary mt-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notes */}
          {playableCharacter.notes && (
            <div>
              <h3 className="font-heading text-xl mb-3 text-text-primary">Anotações</h3>
              <Card className="card-inset">
                <CardContent className="p-4">
                  <p className="font-handwritten leading-relaxed text-pretty text-text-primary">
                    {playableCharacter.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border-default">
            <Button variant="outline" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );
}
