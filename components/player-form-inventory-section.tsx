"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Package, Plus, Trash2, Edit, Check } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEquipment } from "@/lib/api/hooks";
import { isMeaningfulItem } from "@/lib/api/utils";
import EditItemDialog from "./edit-item-dialog";
import { convertApiEquipmentToItem } from "@/lib/interfaces/interfaces";

interface PlayerFormInventorySectionProps {
  fields: any[];
  onAddItem: (item: any) => void;
  onRemoveItem: (index: number) => void;
  onToggleEquip: (index: number) => void;
  onUpdateItem: (index: number, updatedItem: any) => void;
  itemSearchQuery: string;
  setItemSearchQuery: (value: string) => void;
  selectedEquipmentIndex: number | null;
  setSelectedEquipmentIndex: (value: number | null) => void;
  startingEquipmentOptions?: any[];
  selectedStartingEquipmentCount?: number;
  isNewCharacter?: boolean;
}

export default function PlayerFormInventorySection({
  fields,
  onAddItem,
  onRemoveItem,
  onToggleEquip,
  onUpdateItem,
  itemSearchQuery,
  setItemSearchQuery,
  selectedEquipmentIndex,
  setSelectedEquipmentIndex,
  startingEquipmentOptions,
  selectedStartingEquipmentCount = 0,
  isNewCharacter = false,
}: PlayerFormInventorySectionProps) {
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [selectedStartingEquipmentIndices, setSelectedStartingEquipmentIndices] = useState<
    Set<number>
  >(new Set());
  // Track which items in inventory are from starting equipment options
  const [startingEquipmentToInventoryIndex, setStartingEquipmentToInventoryIndex] =
    useState<Map<number, number>>(new Map());
  const debouncedItemSearch = useDebounce(itemSearchQuery, 300);
  const { data: equipmentData, isLoading: loadingEquipment } =
    useEquipment(debouncedItemSearch);

  const toggleStartingEquipment = (index: number, option: any) => {
    const newSelected = new Set(selectedStartingEquipmentIndices);
    const newMapping = new Map(startingEquipmentToInventoryIndex);

    if (newSelected.has(index)) {
      // Deselect: remove the item from inventory
      newSelected.delete(index);
      const inventoryIndex = newMapping.get(index);
      if (inventoryIndex !== undefined) {
        onRemoveItem(inventoryIndex);
        newMapping.delete(index);
        // Update indices for items after the removed one
        for (const [key, value] of newMapping.entries()) {
          if (value > inventoryIndex) {
            newMapping.set(key, value - 1);
          }
        }
      }
    } else {
      // Select: add the item to inventory
      newSelected.add(index);
      if (option.item) {
        const baseItem = convertApiEquipmentToItem(option.item, "class");
        const quantity = option.quantity || 1;
        for (let i = 0; i < quantity; i++) {
          onAddItem({ ...baseItem });
        }
        newMapping.set(index, fields.length);
      }
    }
    setSelectedStartingEquipmentIndices(newSelected);
    setStartingEquipmentToInventoryIndex(newMapping);
  };

  const StartingEquipmentCards = () => {
    console.log("StartingEquipmentCards render:", {
      isNewCharacter,
      startingEquipmentOptions,
      length: startingEquipmentOptions?.length,
    });

    if (
      !isNewCharacter ||
      !startingEquipmentOptions ||
      startingEquipmentOptions.length === 0
    ) {
      return null;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-text-tertiary uppercase tracking-wider">
            Equipamento Inicial
          </Label>
          <Badge
            className={`text-[10px] ${
              selectedStartingEquipmentIndices.size >=
              selectedStartingEquipmentCount
                ? "bg-nature-400/20 text-nature-400"
                : "bg-arcane-400/20 text-arcane-400"
            }`}
          >
            {selectedStartingEquipmentIndices.size}/{selectedStartingEquipmentCount}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {startingEquipmentOptions.map((option: any, idx: number) => {
            const isSelected = selectedStartingEquipmentIndices.has(idx);
            const isLimitReached =
              selectedStartingEquipmentIndices.size >=
              selectedStartingEquipmentCount;

            // Hide remaining options when limit is reached
            if (!isSelected && isLimitReached) {
              return null;
            }

            const item = option.item;
            const quantity = option.quantity || 1;
            const isSelectedHidden = !isSelected && isLimitReached;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleStartingEquipment(idx, option)}
                disabled={isSelectedHidden}
                className={`relative p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-arcane-500/10 border-arcane-400"
                    : "bg-bg-inset border-border-default hover:border-arcane-400/50"
                } ${isSelectedHidden ? "hidden" : ""}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-arcane-400 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 pr-6">
                    <span className="font-semibold text-sm text-text-primary">
                      {item?.name || "Item"}
                    </span>
                    {quantity > 1 && (
                      <Badge className="text-[10px] bg-nature-400/20 text-nature-400">
                        x{quantity}
                      </Badge>
                    )}
                    <Badge className="text-[10px] uppercase tracking-wider">
                      {item?.equipment_category?.name || "item"}
                    </Badge>
                  </div>

                  {item?.cost && (
                    <p className="text-xs text-text-tertiary mt-1">
                      {item.cost.quantity * quantity} {item.cost.unit}
                    </p>
                  )}

                  {item?.weight && (
                    <p className="text-xs text-text-tertiary">
                      {item.weight * quantity} lb
                    </p>
                  )}

                  {item?.damage?.damage_dice && (
                    <p className="text-xs text-text-tertiary">
                      Dano: {item.damage.damage_dice}{" "}
                      {item.damage.damage_type?.name}
                    </p>
                  )}

                  {item?.armor_class && (
                    <p className="text-xs text-text-tertiary">
                      CA: {item.armor_class.base}
                      {item.armor_class.dex_bonus && " + DES"}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

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

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
        <Package className="w-4 h-4 text-nature-400" />
        Inventário
      </Label>

      <div className="space-y-4">
        <StartingEquipmentCards />
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
                    .map((item: any, idx: number) => (
                      <button
                        key={item?.index || idx}
                        type="button"
                        onClick={() => {
                          onAddItem({
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
                <p className="text-xs text-text-tertiary mt-1">{field.type}</p>
                <p className="text-xs text-text-tertiary">
                  <span className="mr-1">💰</span>
                  {field.price} gp{" "}
                  {field.attackbonus !== 0 && `• ATK +${field.attackbonus}`}{" "}
                  {field.defensebonus !== 0 && `• DEF +${field.defensebonus}`}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleEquip(index)}
                >
                  {field.equipped ? (
                    <span className="text-xs">Desequipar</span>
                  ) : (
                    <span className="text-xs">Equipar</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditItemIndex(index)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editItemIndex !== null && fields[editItemIndex] && (
        <EditItemDialog
          item={fields[editItemIndex]}
          index={editItemIndex}
          open={editItemIndex !== null}
          setOpen={(open) => setEditItemIndex(open ? editItemIndex : null)}
          onUpdate={onUpdateItem}
        />
      )}
    </div>
  );
}
