"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Package, Plus, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEquipment } from "@/lib/api/hooks";
import { useFieldArray } from "react-hook-form";
import { isMeaningfulItem } from "@/lib/api/utils";

interface PlayerFormInventorySectionProps {
  register: any;
  control: any;
  watch: any;
  setValue: any;
  itemSearchQuery: string;
  setItemSearchQuery: (value: string) => void;
  setSelectedEquipmentIndex: (value: number | null) => void;
  selectedEquipmentIndex: number | null;
  fields: any[];
}

export default function PlayerFormInventorySection({
  register,
  control,
  watch,
  setValue,
  itemSearchQuery,
  setItemSearchQuery,
  setSelectedEquipmentIndex,
  selectedEquipmentIndex,
  fields,
}: PlayerFormInventorySectionProps) {
  const debouncedItemSearch = useDebounce(itemSearchQuery, 300);
  const { data: equipmentData, isLoading: loadingEquipment } =
    useEquipment(debouncedItemSearch);

  const { append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  const parseDamageDice = (
    damageDice: string | undefined,
  ): { dice: number; number: number } => {
    if (!damageDice || typeof damageDice !== "string") {
      return { dice: 1, number: 4 };
    }
    const match = damageDice.match(/^(\d+)d(\d+)$/i);
    if (match) {
      const dice = parseInt(match[1], 10);
      const number = parseInt(match[2], 10);
      if (!isNaN(dice) && !isNaN(number)) {
        return { dice, number };
      }
    }
    return { dice: 1, number: 4 };
  };

  const mapDamageType = (damageTypeName: string | undefined): string => {
    if (!damageTypeName) return "";
    const damageTypeMap: Record<string, string> = {
      slashing: "corte",
      piercing: "perfuração",
      bludgeoning: "impacto",
      fire: "fogo",
      cold: "frio",
      acid: "ácido",
      thunder: "trovas",
      lightning: "relâmpago",
      poison: "veneno",
      psychic: "psíquico",
      radiant: "radiante",
      necrotic: "necrótico",
      force: "força",
    };
    return (
      damageTypeMap[damageTypeName.toLowerCase()] ||
      damageTypeName.toLowerCase()
    );
  };

  const handleSelectEquipment = (equipment: any, index: number) => {
    setSelectedEquipmentIndex(index);
    const currentRace = (watch as any)("race") || "";
    const currentClass = (watch as any)("class") || "";
    setValue("name", equipment.name || "", { shouldDirty: true });
    setValue("race", currentRace);
    setValue("class", currentClass);
  };

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Package className="w-4 h-4 text-nature-400" />
        Inventário
      </Label>

      <div className="space-y-4">
        <div className="bg-bg-inset rounded-lg border border-border-default p-4">
          <Label className="text-xs text-text-tertiary uppercase tracking-wider mb-2 block flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
            Buscar na API D&D 5e
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 text-text-tertiary">
              {loadingEquipment ? (
                <div className="w-5 h-5 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>
            <Input
              placeholder="Digite para buscar itens..."
              value={itemSearchQuery}
              onChange={(e) => {
                setItemSearchQuery(e.target.value);
                setSelectedEquipmentIndex(null);
              }}
              className="bg-bg-surface border-border-default focus:border-arcane-400 h-11 flex-1"
            />
          </div>

          {debouncedItemSearch.length > 0 &&
            equipmentData?.equipments &&
            equipmentData.equipments.length > 0 && (
              <div className="mt-3 border border-border-default rounded-md bg-bg-surface max-h-72 overflow-y-auto">
                <div className="divide-y divide-border-subtle">
                  {equipmentData.equipments
                    .filter(isMeaningfulItem)
                    .map(
                      (item: any, idx: number) => (
                      <button
                        key={item?.index || idx}
                        type="button"
                        onClick={() => {
                          append({
                            name: item.name || "",
                            price: item.cost
                              ? item.cost.unit === "gp"
                                ? item.cost.quantity
                                : item.cost.unit === "sp"
                                  ? item.cost.quantity / 10
                                  : item.cost.quantity / 100
                              : 0,
                            type: item.equipment_category?.name || "item",
                            distance: item.weapon_range
                              ? item.weapon_range.toLowerCase()
                              : "melee",
                            damage: {
                              dice:
                                parseDamageDice(item.damage?.damage_dice)
                                  ?.dice || 1,
                              number:
                                parseDamageDice(item.damage?.damage_dice)
                                  ?.number || 4,
                              type: mapDamageType(
                                item.damage?.damage_type?.name,
                              ),
                            },
                            magic: false,
                            attackbonus: 0,
                            defensebonus: 0,
                            notes: item.desc?.join("\n") || "",
                            equipped: false,
                          });
                          setItemSearchQuery("");
                          setSelectedEquipmentIndex(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-bg-inset transition-all flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {item.name}
                            </span>
                            <Badge className="text-[10px] uppercase tracking-wider">
                              {item.equipment_category?.name}
                            </Badge>
                          </div>
                          {item.cost && (
                            <p className="text-xs text-text-tertiary mt-1">
                              {item.cost.quantity} {item.cost.unit}
                            </p>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-arcane-400" />
                        </button>
                      ))}
                </div>
              </div>
            )}
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-bg-inset p-3 rounded flex items-start justify-between border border-border-subtle"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{field.name}</p>
                  {field.equipped && (
                    <Badge className="text-[10px] bg-martial-400/20 text-martial-400">
                      Equipado
                    </Badge>
                  )}
                  {field.magic && (
                    <Badge className="text-[10px] bg-arcane-400/20 text-arcane-400">
                      Mágico
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                  {field.type === "weapon"
                    ? `Arma • ${field.distance === "melee" ? "Corpo a corpo" : "À distância"} • ${field.damage.dice}d${field.damage.number}${field.damage.type ? ` ${field.damage.type}` : ""}`
                    : field.type === "armor"
                      ? "Armadura"
                      : "Escudo"}
                </p>
                <p className="text-xs text-text-tertiary">
                  <span className="mr-1">💰</span>
                  {field.price} gp{" "}
                  {field.attackbonus !== 0 && `• ATK +${field.attackbonus}`}{" "}
                  {field.defensebonus !== 0 &&
                    `• DEF +${field.defensebonus}`}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
