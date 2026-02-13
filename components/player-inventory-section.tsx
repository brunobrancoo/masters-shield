import type { PlayableCharacter, Item } from "@/lib/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SwordIcon } from "@/components/icons";
import { Edit, Trash2 } from "lucide-react";
import { D10 } from "@/components/icons";
import AddItemDialog from "@/components/add-item-dialog";
import EditItemDialog from "@/components/edit-item-dialog";
import { rollItemDamage, formatDamageRoll } from "@/lib/utils/utils";

interface PlayerInventorySectionProps {
  playableCharacter: PlayableCharacter;
  editItemIndex: number | null;
  setEditItemIndex: (index: number | null) => void;
  onAddItem: (item: Item) => void;
  onRemoveItem: (index: number) => void;
  onToggleEquip: (index: number) => void;
  onUpdateItem: (index: number, updatedItem: Item) => void;
  campaignId: string;
}

export default function PlayerInventorySection({ playableCharacter, editItemIndex, setEditItemIndex, onAddItem, onRemoveItem, onToggleEquip, onUpdateItem, campaignId }: PlayerInventorySectionProps) {
  const handleRollItemDamage = (item: Item) => {
    const result = rollItemDamage(item);
    if (result) {
      const damageType = item.damageLegacy?.type || item.damage?.damage_type?.name;
      alert(formatDamageRoll(result.rolls, result.total, damageType));
    }
  };

  const handleEditItem = (index: number) => {
    setEditItemIndex(index);
  };

  return (
    <>
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
            {!playableCharacter.inventory || playableCharacter.inventory.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Inventário vazio
              </p>
            ) : (
              playableCharacter.inventory.map((item, index) => (
                <div key={index} className="bg-card/50 p-3 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold font-serif">
                          {item.name}
                        </p>
                        {item.equipped && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                            Equipado
                          </span>
                        )}
                        {item.magic && (
                          <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded">
                            Mágico
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.type === "weapon"
                          ? `${item.type} • ${item.distance || item.weapon_range || ""} • ${item.damageLegacy ? `${item.damageLegacy.dice}d${item.damageLegacy.number}` : item.damage?.damage_dice || ""}${item.damageLegacy?.type || item.damage?.damage_type?.name || ""}`
                          : item.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Preço: {item.price ?? `${item.cost?.quantity ?? 0} ${item.cost?.unit ?? "gp"}`}{" "}
                        {item.attackbonus !== 0 &&
                          `• ATK +${item.attackbonus}`}{" "}
                        {item.defensebonus !== 0 &&
                          `• DEF +${item.defensebonus}`}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {item.type === "weapon" && item.damage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRollItemDamage(item)}
                          className="text-primary"
                        >
                          <D10 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleEquip(index)}
                      >
                        {item.equipped ? (
                          <span className="text-xs">Desequipar</span>
                        ) : (
                          <span className="text-xs">Equipar</span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editItemIndex !== null && playableCharacter && playableCharacter.inventory && (
        <EditItemDialog
          item={playableCharacter.inventory[editItemIndex]}
          index={editItemIndex}
          open={editItemIndex !== null}
          setOpen={(open) =>
            setEditItemIndex(open ? editItemIndex : null)
          }
          onUpdate={onUpdateItem}
        />
      )}
    </>
  );
}
