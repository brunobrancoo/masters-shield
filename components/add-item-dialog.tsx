"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import { useEquipment } from "@/lib/api/hooks";
import { Item, Homebrew } from "@/lib/interfaces/interfaces";
import { ItemFormData, itemSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { isMeaningfulItem } from "@/lib/api/utils";
import { createHomebrew, onHomebrewsChange } from "@/lib/firebase-storage";

interface AddItemDialogProps {
  onAdd: (item: Item) => void;
  campaignId: string;
}

export default function AddItemDialog({ onAdd, campaignId }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: equipmentData, isLoading } = useEquipment(
    debouncedSearchQuery,
  );
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"api" | "homebrew">("api");
  const [homebrewSearchQuery, setHomebrewSearchQuery] = useState("");
  const debouncedHomebrewSearchQuery = useDebounce(homebrewSearchQuery, 300);
  const [homebrews, setHomebrews] = useState<Homebrew[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      price: 0,
      type: "weapon",
      distance: "melee",
      damage: { dice: 1, number: 4, type: "" },
      magic: false,
      attackbonus: 0,
      defensebonus: 0,
      notes: "",
      equipped: false,
    },
  });

  useEffect(() => {
    if (equipmentData) {
      console.log("D&D 5e API Equipment Response:", equipmentData);
      console.log("Filtered equipment:", equipmentData.equipments?.filter(isMeaningfulItem));
    }
  }, [equipmentData]);

  useEffect(() => {
    if (!campaignId) return;

    const unsubscribe = onHomebrewsChange(campaignId, (data) => {
      setHomebrews(data);
    });

    return () => unsubscribe();
  }, [campaignId]);

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

  const handleSelectApiItem = (equipment: any, index: number) => {
    setSelectedItemIndex(index);

    setValue("name", equipment.name || "", { shouldDirty: true });
    const categoryType = equipment.equipment_category?.name || "Item";
    setValue("type", categoryType, { shouldDirty: true });

    if (equipment.cost) {
      const priceInGp =
        equipment.cost.unit === "gp"
          ? equipment.cost.quantity
          : equipment.cost.unit === "sp"
            ? equipment.cost.quantity / 10
            : equipment.cost.quantity / 100;
      setValue("price", Math.round(priceInGp * 100) / 100, {
        shouldDirty: true,
      });
    } else {
      setValue("price", 0, { shouldDirty: true });
    }

    const isWeapon =
      equipment.damage !== undefined ||
      equipment.two_handed_damage !== undefined;
    const isArmor = equipment.armor_category !== undefined;

    if (isWeapon) {
      const damageDice =
        equipment.damage?.damage_dice ||
        equipment.two_handed_damage?.damage_dice;
      const { dice, number } = parseDamageDice(damageDice);
      const damageTypeName =
        equipment.damage?.damage_type?.name ||
        equipment.two_handed_damage?.damage_type?.name;
      const mappedType = mapDamageType(damageTypeName);
      setValue("damage.dice", dice, { shouldDirty: true });
      setValue("damage.number", number, { shouldDirty: true });
      setValue("damage.type", mappedType, { shouldDirty: true });

      let distanceValue = "melee";
      if (equipment.weapon_range) {
        distanceValue = equipment.weapon_range.toLowerCase();
      } else if (equipment.category_range) {
        distanceValue = equipment.category_range.toLowerCase();
      } else if (
        equipment.properties?.some((p: any) =>
          p?.name?.toLowerCase().includes("ammunition"),
        )
      ) {
        distanceValue = "ranged";
      }
      setValue("distance", distanceValue, { shouldDirty: true });
      setValue("defensebonus", 0, { shouldDirty: true });
    } else if (isArmor) {
      if (equipment.armor_class?.base) {
        setValue("defensebonus", equipment.armor_class.base, {
          shouldDirty: true,
        });
      } else {
        setValue("defensebonus", 0, { shouldDirty: true });
      }
      setValue("damage.dice", 1, { shouldDirty: true });
      setValue("damage.number", 4, { shouldDirty: true });
      setValue("damage.type", "", { shouldDirty: true });
      setValue("distance", "melee", { shouldDirty: true });
    } else {
      setValue("damage.dice", 1, { shouldDirty: true });
      setValue("damage.number", 4, { shouldDirty: true });
      setValue("damage.type", "", { shouldDirty: true });
      setValue("distance", "melee", { shouldDirty: true });
      setValue("defensebonus", 0, { shouldDirty: true });
    }

    setValue("attackbonus", 0, { shouldDirty: true });

    const notes: string[] = [];
    if (equipment.desc && equipment.desc.length > 0) {
      notes.push(...equipment.desc.slice(0, 2));
    }
    if (equipment.weight) {
      notes.push(`Peso: ${equipment.weight} lb`);
    }
    if (equipment.properties?.length > 0) {
      const propNames = equipment.properties
        .map((p: any) => p?.name)
        .filter(Boolean);
      if (propNames.length > 0) {
        notes.push(`Propriedades: ${propNames.join(", ")}`);
      }
    }
    if (equipment.range?.normal) {
      notes.push(
        `Alcance: ${equipment.range.normal} ft${equipment.range.long ? ` / ${equipment.range.long} ft` : ""}`,
      );
    }
    if (
      equipment.two_handed_damage?.damage_dice &&
      equipment.two_handed_damage.damage_dice !== equipment.damage?.damage_dice
    ) {
      notes.push(
        `Duas mãos: ${equipment.two_handed_damage.damage_dice} ${equipment.two_handed_damage.damage_type?.name || ""}`,
      );
    }
    if (equipment.armor_class) {
      const acInfo = [`CA Base: ${equipment.armor_class.base}`];
      if (equipment.armor_class.dex_bonus) {
        acInfo.push(`+ Destreza`);
      }
      if (equipment.armor_class.max_bonus) {
        acInfo.push(`(max +${equipment.armor_class.max_bonus})`);
      }
      notes.push(acInfo.join(" "));
    }
    setValue("notes", notes.join("\n"), { shouldDirty: true });
    setTimeout(() => {
      trigger();
    }, 0);
  };

  const onSubmit = async (data: ItemFormData) => {
    const item: Item = { ...data, equipped: false };
    onAdd(item);

    const selectedHomebrew = filteredHomebrews.find(
      (hb) => hb.name === data.name
    );

    if (!selectedHomebrew && campaignId) {
      try {
        await createHomebrew(campaignId, {
          name: data.name,
          itemType: "item",
          item: item,
        });
      } catch (error) {
        console.error("Failed to save to homebrew:", error);
      }
    }

    reset();
    setOpen(false);
    setSearchQuery("");
    setHomebrewSearchQuery("");
    setSelectedItemIndex(null);
  };

  const filteredHomebrews = useMemo(() => {
    if (!debouncedHomebrewSearchQuery) {
      return homebrews.filter((hb) => hb.itemType === "item");
    }

    return homebrews.filter((hb) => {
      return (
        hb.itemType === "item" &&
        hb.name.toLowerCase().includes(debouncedHomebrewSearchQuery.toLowerCase())
      );
    });
  }, [homebrews, debouncedHomebrewSearchQuery]);

  const handleSelectHomebrewItem = (homebrew: Homebrew) => {
    setSelectedItemIndex(null);

    if (homebrew.item) {
      setValue("name", homebrew.item.name, { shouldDirty: true });
      setValue("type", homebrew.item.type, { shouldDirty: true });
      setValue("price", homebrew.item.price, { shouldDirty: true });
      setValue("distance", homebrew.item.distance, { shouldDirty: true });
      setValue("damage.dice", homebrew.item.damage.dice, { shouldDirty: true });
      setValue("damage.number", homebrew.item.damage.number, { shouldDirty: true });
      setValue("damage.type", homebrew.item.damage.type, { shouldDirty: true });
      setValue("magic", homebrew.item.magic, { shouldDirty: true });
      setValue("attackbonus", homebrew.item.attackbonus, { shouldDirty: true });
      setValue("defensebonus", homebrew.item.defensebonus, { shouldDirty: true });
      setValue("notes", homebrew.item.notes, { shouldDirty: true });
      setValue("equipped", homebrew.item.equipped, { shouldDirty: true });
    }

    setTimeout(() => trigger(), 0);
  };

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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchQuery("");
          setHomebrewSearchQuery("");
          setSelectedItemIndex(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glow-class">
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-bg-elevated border-border-strong p-8">
        <DialogHeader className="border-b border-border-default pb-6 mb-2">
          <DialogTitle className="font-heading text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-arcane-500/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-arcane-400" />
            </span>
            Adicionar Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
          <Tabs defaultValue="api" value={activeTab} onValueChange={(v) => setActiveTab(v as "api" | "homebrew")}>
            <TabsList className="w-full">
              <TabsTrigger value="api">API D&D 5e</TabsTrigger>
              <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
            </TabsList>

            <TabsContent value="api">
              <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
                <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-arcane-400 animate-pulse"></span>
                  Buscar na API D&D 5e
                </Label>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-text-tertiary">
                    {isLoading ? (
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
                    placeholder="Digite para buscar itens automaticamente..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedItemIndex(null);
                    }}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 focus:ring-arcane-400/20 h-12 flex-1"
                  />
                </div>

                <div className="mt-4">
                  {debouncedSearchQuery.length > 0 && (
                    <div className="border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                      {isLoading ? (
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
                                onClick={() => handleSelectApiItem(item, idx)}
                                className={`w-full text-left px-5 py-4 transition-all flex justify-between items-center group ${selectedItemIndex === idx
                                    ? "bg-arcane-400/10 border-l-4 border-l-arcane-400"
                                    : "hover:bg-bg-surface border-l-4 border-l-transparent"
                                  }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-semibold text-text-primary group-hover:text-arcane-300 transition-colors">
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
                                  {selectedItemIndex === idx && (
                                    <span className="text-arcane-400">
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
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </span>
                                  )}
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
                            Tente termos como "sword", "armor",
                            "shield"...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {debouncedSearchQuery.length === 0 && (
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
                        A busca é executada 300ms após você parar de digitar
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="homebrew">
              <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
                <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-nature-400 animate-pulse"></span>
                  Buscar na coleção Homebrew
                </Label>

                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Digite para buscar itens homebrew..."
                    value={homebrewSearchQuery}
                    onChange={(e) => {
                      setHomebrewSearchQuery(e.target.value);
                      setSelectedItemIndex(null);
                    }}
                    className="bg-bg-inset border-border-default focus:border-nature-400 h-11 flex-1"
                  />
                </div>

                <div className="mt-4 border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                  {filteredHomebrews.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-text-secondary">
                        {homebrewSearchQuery
                          ? `Nenhum item homebrew encontrado para "${homebrewSearchQuery}"`
                          : "Nenhum item homebrew adicionado ainda"}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        Itens adicionados manualmente aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-subtle">
                      {filteredHomebrews.map((homebrew) => (
                        <button
                          key={homebrew.id}
                          type="button"
                          onClick={() => handleSelectHomebrewItem(homebrew)}
                          className="w-full text-left px-4 py-3 hover:bg-bg-surface transition-all flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{homebrew.name}</span>
                              <Badge className="text-[10px] bg-nature-400/20 text-nature-400">
                                Custom
                              </Badge>
                            </div>
                            {homebrew.item?.notes && (
                              <p className="text-xs text-text-tertiary mt-1 line-clamp-1">
                                {homebrew.item.notes}
                              </p>
                            )}
                          </div>
                          <Plus className="w-4 h-4 text-nature-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t-2 border-border-default pt-8">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-6 block flex items-center gap-2">
              <span className="w-1 h-4 bg-divine-400 rounded-full"></span>
              Ou preencha manualmente
            </Label>

            <div className="bg-bg-surface rounded-lg border border-border-default p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="item-name"
                    className="text-text-secondary font-medium"
                  >
                    Nome <span className="text-damage">*</span>
                  </Label>
                  <Input
                    id="item-name"
                    {...register("name")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: Espada Longa"
                  />
                  {errors.name && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="item-type"
                    className="text-text-secondary font-medium"
                  >
                    Tipo
                  </Label>
                  <Input
                    id="item-type"
                    {...register("type")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Tipo de equipamento"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <Label
                    htmlFor="item-price"
                    className="text-text-secondary font-medium"
                  >
                    Preço (po)
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-divine-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                        >
                          G
                        </text>
                      </svg>
                    </div>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      className="bg-bg-inset border-border-default focus:border-arcane-400 h-11 flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-inset rounded-lg border border-border-subtle">
                  <input
                    type="checkbox"
                    id="item-magic"
                    {...register("magic")}
                    className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                  />
                  <Label
                    htmlFor="item-magic"
                    className="flex items-center gap-2 cursor-pointer mb-0"
                  >
                    <span className="text-arcane-400">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Item Mágico</span>
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="item-attackbonus"
                    className="text-text-secondary font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-martial-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Bônus de Ataque
                  </Label>
                  <Input
                    id="item-attackbonus"
                    type="number"
                    {...register("attackbonus", { valueAsNumber: true })}
                    className="bg-bg-inset border-border-default focus:border-martial-400 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="item-defensebonus"
                    className="text-text-secondary font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-divine-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Bônus de Defesa
                  </Label>
                  <Input
                    id="item-defensebonus"
                    type="number"
                    {...register("defensebonus", { valueAsNumber: true })}
                    className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
                  />
                </div>
              </div>

              <div className="p-6 bg-martial-400/5 border border-martial-400/20 rounded-lg">
                <Label className="font-heading text-sm uppercase tracking-wider text-martial-400 mb-5 block flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Dano
                </Label>
                <div className="grid grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs text-text-tertiary uppercase tracking-wider">
                      Distância
                    </Label>
                    <Input
                      {...register("distance")}
                      className="bg-bg-inset border-border-default focus:border-martial-400"
                      placeholder="melee, ranged, 10ft..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-text-tertiary uppercase tracking-wider">
                      Dados
                    </Label>
                    <Input
                      type="number"
                      {...register("damage.dice", { valueAsNumber: true })}
                      className="bg-bg-inset border-border-default focus:border-martial-400"
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-text-tertiary uppercase tracking-wider">
                      d
                    </Label>
                    <Input
                      type="number"
                      {...register("damage.number", {
                        valueAsNumber: true,
                      })}
                      className="bg-bg-inset border-border-default focus:border-martial-400"
                      placeholder="8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-text-tertiary uppercase tracking-wider">
                      Tipo
                    </Label>
                    <Input
                      {...register("damage.type")}
                      className="bg-bg-inset border-border-default focus:border-martial-400"
                      placeholder="Corte"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="item-notes"
                  className="text-text-secondary font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-nature-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Notas
                </Label>
                <Textarea
                  id="item-notes"
                  rows={3}
                  {...register("notes")}
                  className="bg-bg-inset border-border-default focus:border-nature-400 resize-none"
                  placeholder="Propriedades especiais, história do item, etc..."
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border-default pt-8 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
                setSearchQuery("");
                setHomebrewSearchQuery("");
                setSelectedItemIndex(null);
              }}
              className="border-border-default hover:bg-bg-surface"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-arcane-500 hover:bg-arcane-400 text-white glow-arcane"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
