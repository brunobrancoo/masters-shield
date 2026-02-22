"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useEquipment, useMagicItems } from "@/lib/api/hooks";
import type { InventoryItem } from "@/lib/schemas";
import { Plus, Search, SearchIcon, Sparkles } from "lucide-react";
import { isMeaningfulItem } from "@/lib/api/utils";

interface AddItemDialogProps {
  onAdd: (item: InventoryItem) => void;
  campaignId: string;
  onAddMagicalItemData?: (index: string, data: any) => void;
}

export default function AddItemDialog({
  onAdd,
  campaignId,
}: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {
    data: equipmentData,
    isLoading: isLoadingEquipment,
    error: equipmentError,
  } = useEquipment(debouncedSearchQuery);

  const {
    data: magicItemsData,
    isLoading: isLoadingMagic,
    error: magicItemsError,
  } = useMagicItems(debouncedSearchQuery);

  const [activeTab, setActiveTab] = useState<"normal" | "homebrew" | "magical">(
    "normal",
  );
  const getTypeColor = (typename: string | undefined) => {
    switch (typename) {
      case "Weapon":
        return "text-martial-400 border-martial-400/30 bg-martial-400/10";
      case "Armor":
        return "text-divine-400 border-divine-400/30 bg-divine-400/10";
      case "Gear":
        return "text-nature-400 border-nature-400/30 bg-nature-400/10";
      default:
        return "text-text-secondary border-border-default bg-bg-surface";
    }
  };

  const getTypeLabel = (typename: string | undefined, equipment: any) => {
    if (typename === "Weapon" && equipment?.weapon_category) {
      return equipment.weapon_category;
    }
    if (typename === "Armor" && equipment?.armor_category) {
      return equipment.armor_category;
    }
    return typename || "Item";
  };

  const handleAddNormalItem = (item: any) => {
    const inventoryItem: InventoryItem = {
      index: item.index,
      name: item.name,
      type: "normal",
      notes: "",
      equipped: false,
    };
    onAdd(inventoryItem);
    setOpen(false);
    setSearchQuery("");
  };

  const handleAddMagicalItem = (item: any) => {
    onAdd({
      index: item.name,
      name: item.name,
      type: "magical",
      notes: "",
      equipped: false,
    });
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchQuery("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glow-class">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-elevated border-border-strong p-8">
        <DialogHeader className="border-b border-border-default pb-6 mb-2">
          <DialogTitle className="font-heading text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-arcane-500/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-arcane-400" />
            </span>
            Adicionar Item
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="normal"
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "normal" | "homebrew" | "magical")
          }
        >
          <TabsList className="w-full mb-6">
            <TabsTrigger value="normal">Itens Normais</TabsTrigger>
            <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
            <TabsTrigger value="magical">Itens Magicos</TabsTrigger>
          </TabsList>

          <TabsContent value="normal">
            <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
              <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
                Buscar na API D&D 5e
              </Label>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-text-tertiary">
                  {isLoadingEquipment ? (
                    <div className="w-5 h-5 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SearchIcon />
                  )}
                </div>
                <Input
                  placeholder="Digite para buscar itens automaticamente..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="bg-bg-inset border-border-default focus:border-arcane-400 focus:ring-arcane-400/20 h-12 flex-1"
                />
              </div>

              <div className="mt-4">
                {debouncedSearchQuery.length > 0 ? (
                  <div className="border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                    {isLoadingEquipment ? (
                      <div className="p-6 text-center">
                        <div className="w-8 h-8 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-text-secondary">
                          Consultando a API D&D 5e...
                        </p>
                      </div>
                    ) : equipmentData?.equipments &&
                      equipmentData.equipments.length > 0 ? (
                      <div className="divide-y divide-border-subtle">
                        {equipmentData.equipments
                          .filter(isMeaningfulItem)
                          .map((item: any, idx: number) => (
                            <button
                              key={item?.index || idx}
                              type="button"
                              onClick={() => handleAddNormalItem(item)}
                              className="w-full text-left px-5 py-4 transition-all flex justify-between items-center hover:bg-bg-surface border-l-4 border-l-transparent hover:border-l-arcane-400"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-semibold text-text-primary">
                                    {item?.name}
                                  </span>
                                  <Badge
                                    className={`text-[10px] uppercase tracking-wider ${getTypeColor(item?.__typename)}`}
                                  >
                                    {getTypeLabel(item?.__typename, item)}
                                  </Badge>
                                </div>
                                {item?.desc && item.desc[0] && (
                                  <p className="text-xs text-text-tertiary line-clamp-1">
                                    {item.desc[0]}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                {item?.damage?.damage_dice && (
                                  <span className="text-sm font-mono text-martial-400">
                                    {item.damage.damage_dice}
                                  </span>
                                )}
                                {item?.cost && (
                                  <span className="text-sm text-divine-400 font-medium">
                                    {item.cost.quantity} {item.cost.unit}
                                  </span>
                                )}
                                <Plus className="w-4 h-4 text-arcane-400" />
                              </div>
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <svg
                          className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-text-secondary">
                          Nenhum item encontrado para "{debouncedSearchQuery}"
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">
                          Tente termos como "sword", "armor", "shield"...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-border-default rounded-md bg-bg-inset/50">
                    <svg
                      className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50"
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
                    <p className="text-sm text-text-secondary">
                      Digite para buscar itens na API D&D 5e automaticamente
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">
                      A busca e executada 300ms apos voce parar de digitar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="homebrew">
            <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
              <div className="p-6 text-center">
                <p className="text-sm text-text-secondary mb-2">
                  Funcionalidade em desenvolvimento
                </p>
                <p className="text-xs text-text-tertiary">
                  Em breve voce podera adicionar itens homebrew personalizados
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="magical">
            <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
              <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
                Buscar Itens Mágicos na API D&D 5e
              </Label>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-text-tertiary">
                  {isLoadingMagic ? (
                    <div className="w-5 h-5 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles />
                  )}
                </div>
                <Input
                  placeholder="Digite para buscar itens mágicos automaticamente..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="bg-bg-inset border-border-default focus:border-arcane-400 focus:ring-arcane-400/20 h-12 flex-1"
                />
              </div>

              <div className="mt-4">
                {debouncedSearchQuery.length > 0 ? (
                  <div className="border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                    {isLoadingMagic ? (
                      <div className="p-6 text-center">
                        <div className="w-8 h-8 border-2 border-arcane-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm text-text-secondary">
                          Consultando a API D&D 5e...
                        </p>
                      </div>
                    ) : magicItemsData?.magicItems &&
                      magicItemsData.magicItems.length > 0 ? (
                      <div className="divide-y divide-border-subtle">
                        {magicItemsData.magicItems.map(
                          (item: any, idx: number) => (
                            <button
                              key={item?.index || idx}
                              type="button"
                              onClick={() => handleAddMagicalItem(item)}
                              className="w-full text-left px-5 py-4 transition-all flex justify-between items-center hover:bg-bg-surface border-l-4 border-l-transparent hover:border-l-arcane-400"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-semibold text-text-primary">
                                    {item?.name}
                                  </span>
                                  {item?.rarity?.name && (
                                    <span className="text-xs bg-arcane-500/20 text-arcane-400 px-2 py-0.5 rounded">
                                      {item.rarity.name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                  {item?.equipment_category?.name && (
                                    <span>{item.equipment_category.name}</span>
                                  )}
                                </div>
                                {item?.desc && item.desc[0] && (
                                  <p className="text-xs text-text-tertiary line-clamp-2 mt-1">
                                    {item.desc[0]}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                {item?.variant && (
                                  <span className="text-xs bg-arcane-500/20 text-arcane-400 px-2 py-0.5 rounded">
                                    Variante
                                  </span>
                                )}
                                <Plus className="w-4 h-4 text-arcane-400" />
                              </div>
                            </button>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <svg
                          className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-text-secondary">
                          Nenhum item mágico encontrado para "
                          {debouncedSearchQuery}"
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">
                          Tente termos como "staff", "wand", "ring"...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center border-2 border-dashed border-border-default rounded-md bg-bg-inset/50">
                    <svg
                      className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50"
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
                    <p className="text-sm text-text-secondary">
                      Digite para buscar itens mágicos na API D&D 5e
                      automaticamente
                    </p>
                    <p className="text-xs text-text-tertiary mt-2">
                      A busca e executada 300ms apos voce parar de digitar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
