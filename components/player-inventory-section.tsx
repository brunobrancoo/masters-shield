import type { PlayableCharacter, InventoryItem } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SwordIcon } from "@/components/icons";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { D10 } from "@/components/icons";
import AddItemDialog from "@/components/add-item-dialog";
import { useEquipmentMultiple, useMagicItemsByName } from "@/lib/api/hooks";
import { parseDamageDice, formatDamageDice } from "@/lib/character-utils";
import { useMemo, useState } from "react";

interface PlayerInventorySectionProps {
  playableCharacter: PlayableCharacter;
  editItemIndex: number | null;
  setEditItemIndex: (index: number | null) => void;
  onAddItem: (item: InventoryItem) => void;
  onRemoveItem: (index: number) => void;
  onToggleEquip: (index: number) => void;
  onUpdateItem: (index: number, updatedItem: InventoryItem) => void;
  campaignId: string;
}

export default function PlayerInventorySection({
  playableCharacter,
  editItemIndex,
  setEditItemIndex,
  onAddItem,
  onRemoveItem,
  onToggleEquip,
  onUpdateItem,
  campaignId,
}: PlayerInventorySectionProps) {
  const inventory = playableCharacter.inventory || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const equipmentNames = useMemo(() => {
    const names = inventory
      .filter((item) => item.type !== "magical")
      .map((item) => item.index);
    return [...new Set(names)];
  }, [inventory]);

  const magicalItemNames = useMemo(() => {
    const magicalItems = inventory.filter((item) => item.type === "magical");
    return magicalItems.map((item) => ({ index: item.index, name: item.index }));
  }, [inventory]);

  const equipmentQueries = useEquipmentMultiple(equipmentNames);
  const magicItemsQueries = useMagicItemsByName(magicalItemNames.map((item) => item.name));

  const equipmentMap = useMemo(() => {
    const map: Record<string, any> = {};
    equipmentQueries.forEach((query) => {
      if (query.data?.equipments?.[0]) {
        const name = query.data.equipments[0].index;
        map[name] = query.data.equipments[0];
      }
    });
    return map;
  }, [equipmentQueries]);

  const magicItemsMap = useMemo(() => {
    const map: Record<string, any> = {};
    magicItemsQueries.forEach((query) => {
      if (query.data?.magicItems?.[0]) {
        const item = query.data.magicItems[0];
        const name = item.name;
        const index = item.index;
        map[index] = item;
        map[name] = item;
      }
    });
    return map;
  }, [magicItemsQueries]);

  const combinedMap = useMemo(() => {
    return { ...equipmentMap, ...magicItemsMap };
  }, [equipmentMap, magicItemsMap]);

  const getInventoryItemDisplay = (inventoryItem: InventoryItem) => {
    const item = inventoryItem;
    const apiItem = combinedMap[item.index] || combinedMap[item.name];

    if (!apiItem) {
      return {
        name: item.name || item.index,
        type: item.type === "magical" ? "Mágico" : "Item",
        damage: "",
        damageType: "",
        cost: "",
        desc: item.notes || "",
        extraInfo: "",
        weight: "",
      };
    }

    const isMagical = item.type === "magical";

    const categoryName = apiItem.equipment_category?.name || "Item";

    let damage = "";
    let damageType = "";
    let extraInfo: string[] = [];

    if (isMagical) {
      if (apiItem.rarity?.name) {
        extraInfo.push(`Raridade: ${apiItem.rarity.name}`);
      }
      if (apiItem.variant) {
        extraInfo.push("Variante");
      }
    } else if (apiItem.damage?.damage_dice) {
      damage = apiItem.damage.damage_dice;
      damageType = apiItem.damage.damage_type?.name || "";

      if (apiItem.weapon_category)
        extraInfo.push(`Categoria: ${apiItem.weapon_category}`);
      if (apiItem.weapon_range) extraInfo.push(`Alcance: ${apiItem.weapon_range}`);
      if (apiItem.range?.normal)
        extraInfo.push(`Normal: ${apiItem.range.normal} ft`);
      if (apiItem.range?.long) extraInfo.push(`Longo: ${apiItem.range.long} ft`);
      if (apiItem.throw_range?.short)
        extraInfo.push(
          `Arremesso: ${apiItem.throw_range.short}/${apiItem.throw_range.long} ft`,
        );

      if (apiItem.properties?.length > 0) {
        const propertyNames = apiItem.properties
          .map((p: any) => p.name)
          .join(", ");
        extraInfo.push(`Propriedades: ${propertyNames}`);
      }

      if (apiItem.two_handed_damage?.damage_dice) {
        const { dice: twoHandDice, number: twoHandNumber } = parseDamageDice(
          apiItem.two_handed_damage.damage_dice,
        );
        const formatted = formatDamageDice(twoHandDice, twoHandNumber);
        extraInfo.push(`Duas mãos: ${formatted}`);
      }
    } else if (apiItem.armor_category) {
      if (apiItem.armor_class?.base)
        extraInfo.push(`CA Base: ${apiItem.armor_class.base}`);
      if (apiItem.armor_class?.dex_bonus) extraInfo.push(`Bônus Dex: Sim`);
      if (apiItem.armor_class?.max_bonus)
        extraInfo.push(`Bônus Dex Máx: +${apiItem.armor_class.max_bonus}`);
      extraInfo.push(`Categoria: ${apiItem.armor_category}`);
      if (apiItem.str_minimum) extraInfo.push(`Str Mínima: ${apiItem.str_minimum}`);
      if (apiItem.stealth_disadvantage)
        extraInfo.push(`Desvantagem Furtividade`);
    } else if (apiItem.tool_category) {
      extraInfo.push(`Categoria: ${apiItem.tool_category}`);
    } else if (apiItem.gear_category?.name) {
      extraInfo.push(apiItem.gear_category.name);
    }

    const weight = apiItem.weight ? `${apiItem.weight} lb` : "";
    const cost = apiItem.cost ? `${apiItem.cost.quantity} ${apiItem.cost.unit}` : "";
    const desc = apiItem.desc?.[0] || "";

    return {
      name: apiItem.name,
      type: isMagical ? "Mágico" : categoryName,
      damage,
      damageType,
      cost,
      desc,
      extraInfo: extraInfo.join(" • "),
      weight,
    };
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "arma":
      case "weapon":
        return "text-martial-400 border-martial-400/30 bg-martial-400/10";
      case "armadura":
      case "armor":
        return "text-divine-400 border-divine-400/30 bg-divine-400/10";
      case "equipamento":
      case "gear":
        return "text-nature-400 border-nature-400/30 bg-nature-400/10";
      case "mágico":
      case "magical":
        return "text-arcane-400 border-arcane-400/30 bg-arcane-400/10";
      default:
        return "text-text-secondary border-border-default bg-bg-surface";
    }
  };

  const handleSaveNotes = (index: number) => {
    const item = inventory[index];
    onUpdateItem(index, {
      ...item,
      notes: editNotes,
    });
    setEditingIndex(null);
    setEditNotes("");
  };

  const handleEditNotes = (index: number) => {
    setEditingIndex(index);
    setEditNotes(inventory[index]?.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditNotes("");
  };

  return (
    <Card className="metal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-sans text-xl flex items-center gap-2">
            <SwordIcon className="w-6 h-6" />
            Inventário
          </CardTitle>
          <AddItemDialog onAdd={onAddItem} campaignId={campaignId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!inventory || inventory.length === 0 ? (
            <p className="text-center text-text-secondary py-4">
              Inventário vazio
            </p>
          ) : (
            inventory.map((inventoryItem, index) => {
              const display = getInventoryItemDisplay(inventoryItem);
              return (
                <div
                  key={index}
                  className={`bg-bg-inset p-3 rounded border ${inventoryItem.equipped ? "border-healing/50 bg-healing/5" : "border-border-subtle"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-bold font-heading text-text-primary">
                          {display.name}
                        </p>
                        <Badge
                          className={`text-[10px] uppercase tracking-wider ${getTypeColor(display.type)}`}
                        >
                          {display.type}
                        </Badge>
                        {inventoryItem.equipped && (
                          <span className="text-xs bg-healing/20 text-healing px-2 py-0.5 rounded font-medium">
                            Equipado
                          </span>
                        )}
                        {inventoryItem.type === "magical" && (
                          <span className="text-xs bg-arcane-500/20 text-arcane-400 px-2 py-0.5 rounded">
                            Mágico
                          </span>
                        )}
                      </div>
                      {display.damage && (
                        <p className="text-sm text-martial-400 font-medium">
                          Dano: {display.damage}
                          {display.damageType && ` (${display.damageType})`}
                        </p>
                      )}
                      {display.extraInfo && (
                        <p className="text-xs text-text-secondary">
                          {display.extraInfo}
                        </p>
                      )}
                      <div className="flex gap-3 text-xs text-text-secondary mt-1">
                        {display.cost && <span>Preço: {display.cost}</span>}
                        {display.weight && <span>Peso: {display.weight}</span>}
                      </div>
                      {display.desc && (
                        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                          {display.desc}
                        </p>
                      )}
                      {editingIndex === index ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-bg-inset border border-border-subtle rounded px-2 py-1 text-xs text-text-primary resize-y min-h-[60px]"
                            placeholder="Adicione notas sobre este item..."
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveNotes(index)}
                              className="text-xs h-7 px-3"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="text-xs h-7 px-3"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between mt-2">
                          {inventoryItem.notes && (
                            <p className="text-xs text-text-tertiary">
                              Notas: {inventoryItem.notes}
                            </p>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditNotes(index)}
                            className="text-text-secondary hover:text-text-primary p-1 h-6"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleEquip(index)}
                        className={
                          inventoryItem.equipped
                            ? "text-healing"
                            : "text-text-secondary"
                        }
                      >
                        {inventoryItem.equipped ? (
                          <span className="text-xs">Desequipar</span>
                        ) : (
                          <span className="text-xs">Equipar</span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        className="text-damage hover:text-damage/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
