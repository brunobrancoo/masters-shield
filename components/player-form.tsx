"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateId } from "@/lib/storage";

import { useForm, useFieldArray } from "react-hook-form";
import { playerSchema } from "@/lib/schemas";
import { generateAttributes } from "@/lib/dice";
import { Attributes, Player, attributeKeys } from "@/lib/interfaces/interfaces";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClasses, useRaces, useEquipment } from "@/lib/api/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import {
  User,
  UserPlus,
  Heart,
  Shield,
  Zap,
  Sword,
  BookOpen,
  Dice1,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Wind,
  Eye,
  Skull,
  TrendingUp,
  Wand2,
  Coins,
  Package,
  Target,
  Gauge,
} from "lucide-react";

const skillSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  savingThrowAttribute: z.enum(["for", "des", "con", "int", "sab", "car"]),
});

const featureSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  uses: z.number().optional(),
  source: z.string(),
});

const buffSchema = z.object({
  name: z.string().min(1),
  duration: z.string().optional(),
  description: z.string(),
  source: z.string(),
  affects: z.object({
    effect: z.string(),
    amount: z.number(),
  }),
});

type PlayerFormData = z.infer<typeof playerSchema>;
type SkillFormData = z.infer<typeof skillSchema>;
type FeatureFormData = z.infer<typeof featureSchema>;
type BuffFormData = z.infer<typeof buffSchema>;

interface PlayerFormProps {
  player?: Player;
  onSaveAction: (player: Player) => void;
  onCancelAction?: () => void;
  hideActions?: boolean;
}

export function PlayerForm({
  player,
  onSaveAction,
  onCancelAction,
  hideActions = false,
}: PlayerFormProps) {
  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { data: racesData, isLoading: loadingRaces } = useRaces();
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const debouncedItemSearch = useDebounce(itemSearchQuery, 300);
  const { data: equipmentData, isLoading: loadingEquipment } =
    useEquipment(debouncedItemSearch);
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = useState<
    number | null
  >(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: player
      ? {
          ...player,
          inventory: (player as any).inventory || [],
        }
      : {
          name: "",
          race: "",
          class: "",
          level: 1,
          hp: 10,
          maxHp: 10,
          attributes: {
            for: 10,
            des: 10,
            con: 10,
            int: 10,
            sab: 10,
            car: 10,
          },
          inventory: [],
          notes: "",
          ac: 10,
          speed: 30,
          initiativeBonus: 0,
          passivePerception: 10,
          proficiencyBonus: 2,
          sorceryPoints: 0,
          maxSorceryPoints: 0,
          skills: [],
          features: [],
          buffs: [],
          debuffs: [],
          spellCD: 0,
          spellAttack: 0,
          attackBaseBonus: 0,
          spells: [],
          spellSlots: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
          maxSpellSlots: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
          },
        },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  const {
    fields: buffFields,
    append: appendBuff,
    remove: removeBuff,
  } = useFieldArray({
    control,
    name: "buffs",
  });

  const {
    fields: debuffFields,
    append: appendDebuff,
    remove: removeDebuff,
  } = useFieldArray({
    control,
    name: "debuffs",
  });

  useEffect(() => {
    if (player) {
      reset(player);
    }
  }, [player, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  const onSubmit = (data: PlayerFormData) => {
    onSaveAction({
      ...player,
      ...data,
      id: player?.id,
      notes: data.notes || "",
      maxHp: data.maxHp,
      spells: player?.spells || [],
    } as Player);
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

  const handleSelectEquipment = (equipment: any, index: number) => {
    setSelectedEquipmentIndex(index);
    const currentRace = (watch as any)("race") || "";
    const currentClass = (watch as any)("class") || "";
    setValue("name", equipment.name || "", { shouldDirty: true });
    setValue("race", currentRace);
    setValue("class", currentClass);
  };

  return (
    <form id="player-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <User className="w-4 h-4 text-arcane-400" />
            Informações Básicas
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Nome <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <User className="w-4 h-4 text-text-tertiary mt-3 flex-shrink-0" />
                <Input
                  id="name"
                  className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  {...register("name")}
                  placeholder="Nome do personagem"
                />
              </div>
              {errors.name && (
                <p className="text-destructive text-xs flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="race"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Raça
              </Label>
              <div className="flex gap-2">
                <Sparkles className="w-4 h-4 text-nature-400 mt-3 flex-shrink-0" />
                <Input
                  id="race"
                  list="races-list"
                  className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
                  {...register("race")}
                  placeholder="Ex: Humano, Elfo"
                />
              </div>
              <datalist id="races-list">
                {racesData?.races?.map((r: any) => (
                  <option key={r.index} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </datalist>
              {errors.race && (
                <p className="text-destructive text-xs flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.race.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="class"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Classe
              </Label>
              <div className="flex gap-2">
                <BookOpen className="w-4 h-4 text-arcane-400 mt-3 flex-shrink-0" />
                <Input
                  id="class"
                  list="classes-list"
                  className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  {...register("class")}
                  placeholder="Ex: Guerreiro, Mago"
                />
              </div>
              <datalist id="classes-list">
                {classesData?.classes?.map((c: any) => (
                  <option key={c.index} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </datalist>
              {errors.class && (
                <p className="text-destructive text-xs flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.class.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="level"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Nível
              </Label>
              <div className="flex gap-2">
                <TrendingUp className="w-4 h-4 text-arcane-400 mt-3 flex-shrink-0" />
                <Input
                  id="level"
                  type="number"
                  min="1"
                  max="20"
                  className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  {...register("level", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Health Section */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            Saúde & Vida
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="hp"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Pontos de Vida Atuais
              </Label>
              <div className="flex gap-2">
                <Heart className="w-4 h-4 text-destructive mt-3 flex-shrink-0" />
                <Input
                  id="hp"
                  type="number"
                  min="1"
                  className="bg-bg-inset border-border-default focus:border-destructive h-11"
                  {...register("hp", { valueAsNumber: true })}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxHp"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                Pontos de Vida Máximos
              </Label>
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-divine-400 mt-3 flex-shrink-0" />
                <Input
                  id="maxHp"
                  type="number"
                  min="1"
                  className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
                  {...register("maxHp", { valueAsNumber: true })}
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <Sword className="w-4 h-4 text-martial-400" />
            Estatísticas de Combate
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="ac"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Shield className="w-3 h-3 text-divine-400" />
                Classe de Armadura
              </Label>
              <Input
                id="ac"
                type="number"
                min="1"
                className="bg-bg-inset border-border-default focus:border-divine-400 h-11"
                {...register("ac", { valueAsNumber: true })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="speed"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Wind className="w-3 h-3 text-nature-400" />
                Deslocamento
              </Label>
              <Input
                id="speed"
                type="number"
                min="0"
                className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
                {...register("speed", { valueAsNumber: true })}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="initiativeBonus"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Zap className="w-3 h-3 text-arcane-400" />
                Bônus de Iniciativa
              </Label>
              <Input
                id="initiativeBonus"
                type="number"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("initiativeBonus", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="passivePerception"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Eye className="w-3 h-3 text-nature-400" />
                Percepção Passiva
              </Label>
              <Input
                id="passivePerception"
                type="number"
                className="bg-bg-inset border-border-default focus:border-nature-400 h-11"
                {...register("passivePerception", { valueAsNumber: true })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="attackBaseBonus"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Sword className="w-3 h-3 text-martial-400" />
                Bônus de Ataque Base
              </Label>
              <Input
                id="attackBaseBonus"
                type="number"
                className="bg-bg-inset border-border-default focus:border-martial-400 h-11"
                {...register("attackBaseBonus", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="spellAttack"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Wand2 className="w-3 h-3 text-arcane-400" />
                Ataque de Magia
              </Label>
              <Input
                id="spellAttack"
                type="number"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("spellAttack", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Spellcasting */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-arcane-400" />
            Magia & Feitiços
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="spellCD"
                className="text-text-secondary font-medium"
              >
                CD de Magia
              </Label>
              <Input
                id="spellCD"
                type="number"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("spellCD", { valueAsNumber: true })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="proficiencyBonus"
                className="text-text-secondary font-medium"
              >
                Bônus de Proficiência
              </Label>
              <Input
                id="proficiencyBonus"
                type="number"
                min="2"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("proficiencyBonus", { valueAsNumber: true })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-text-secondary font-medium mb-3 block">
              Slots de Magia (Máximo)
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                <div key={level}>
                  <div className="flex items-center gap-1 mb-1">
                    <Wand2 className="w-3 h-3 text-arcane-400" />
                    <Label className="text-xs text-text-tertiary">
                      Nível {level}
                    </Label>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    className="w-full bg-bg-inset border-border-default focus:border-arcane-400 text-center h-9 text-sm"
                    {...(register as any)(`maxSpellSlots.${level}`)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="sorceryPoints"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-arcane-400" />
                Pontos de Feitiçaria (Atual)
              </Label>
              <Input
                id="sorceryPoints"
                type="number"
                min="0"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("sorceryPoints", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="maxSorceryPoints"
                className="text-text-secondary font-medium flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-arcane-400" />
                Pontos de Feitiçaria (Max)
              </Label>
              <Input
                id="maxSorceryPoints"
                type="number"
                min="0"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                {...register("maxSorceryPoints", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Attributes Section */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Gauge className="w-4 h-4 text-martial-400" />
              Atributos
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const genAtt = generateAttributes();
                const attributes = attributeKeys.reduce((acc, key, index) => {
                  acc[key] = genAtt[index]?.result ?? 0;
                  return acc;
                }, {} as Attributes);
                setValue("attributes", attributes);
              }}
              className="flex items-center gap-2"
            >
              <Dice1 className="w-4 h-4" />
              Rolar Atributos
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(["for", "des", "con", "int", "sab", "car"] as const).map(
              (key) => (
                <div key={key}>
                  <Label className="text-xs text-text-tertiary uppercase mb-1 block">
                    {key}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      className="text-center bg-bg-inset border-border-default focus:border-arcane-400 h-12 font-bold text-lg"
                      {...register(`attributes.${key}`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.attributes?.[key] && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.attributes[key]?.message}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Inventory Section with API */}
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
                      {equipmentData.equipments.map(
                        (item: any, idx: number) => (
                          <button
                            key={idx}
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
                        ),
                      )}
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
                      <Coins className="w-3 h-3 inline mr-1 text-divine-400" />
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

        {/* Notes */}
        <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
          <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-nature-400" />
            Anotações
          </Label>
          <Textarea
            id="notes"
            rows={4}
            className="bg-bg-inset border-border-default focus:border-nature-400 resize-none"
            {...register("notes")}
            placeholder="Observações, histórico do personagem..."
          />
        </div>

        {/* Skills, Features, Buffs, Debuffs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
              <Target className="w-4 h-4 text-arcane-400" />
              Habilidades
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const skillName = prompt("Nome da habilidade:");
                if (skillName) {
                  const skillDesc = prompt("Descrição:");
                  if (skillDesc) {
                    const skillAttr = prompt(
                      "Atributo (for/des/con/int/sab/car):",
                    );
                    if (
                      skillAttr &&
                      ["for", "des", "con", "int", "sab", "car"].includes(
                        skillAttr,
                      )
                    ) {
                      appendSkill({
                        name: skillName,
                        description: skillDesc,
                        savingThrowAttribute: skillAttr as any,
                      });
                    }
                  }
                }
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Habilidade
            </Button>
            <div className="space-y-2 mt-3">
              {skillFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-bg-inset p-3 rounded border border-border-subtle"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{field.name}</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.description}
                      </p>
                      <Badge className="text-[10px] mt-1 bg-arcane-400/20 text-arcane-400">
                        {field.savingThrowAttribute}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-divine-400" />
              Características
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const featureName = prompt("Nome da característica:");
                if (featureName) {
                  const featureDesc = prompt("Descrição:");
                  if (featureDesc) {
                    const featureSource = prompt(
                      "Origem (classe, raça, etc.):",
                    );
                    if (featureSource) {
                      const featureUses = prompt(
                        "Usos (deixe vazio para ilimitado):",
                      );
                      appendFeature({
                        name: featureName,
                        description: featureDesc,
                        source: featureSource,
                        uses: featureUses
                          ? Number.parseInt(featureUses)
                          : undefined,
                      });
                    }
                  }
                }
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Característica
            </Button>
            <div className="space-y-2 mt-3">
              {featureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-bg-inset p-3 rounded border border-border-subtle"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-sm">{field.name}</p>
                        {field.uses !== undefined && (
                          <Badge className="text-[10px] bg-arcane-400/20 text-arcane-400">
                            {field.uses} usos
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.description}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.source}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Buffs
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const buffName = prompt("Nome do buff:");
                if (buffName) {
                  const buffDesc = prompt("Descrição:");
                  if (buffDesc) {
                    const buffSource = prompt("Origem:");
                    if (buffSource) {
                      const buffDuration = prompt("Duração:");
                      if (buffDuration) {
                        const buffEffect = prompt(
                          "Efeito (ac, strength, etc.):",
                        );
                        if (buffEffect) {
                          const buffAmount = prompt("Valor:");
                          if (buffAmount) {
                            appendBuff({
                              name: buffName,
                              description: buffDesc,
                              source: buffSource,
                              duration: buffDuration,
                              affects: {
                                effect: buffEffect,
                                amount: Number.parseInt(buffAmount),
                              },
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Buff
            </Button>
            <div className="space-y-2 mt-3">
              {buffFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-bg-inset p-3 rounded border border-border-subtle"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-primary">
                        {field.name}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.description}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.source} • {field.duration}
                      </p>
                      <p className="text-xs text-primary mt-1">
                        +{field.affects.amount} {field.affects.effect}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBuff(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
            <Label className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 block flex items-center gap-2">
              <Skull className="w-4 h-4 text-destructive" />
              Debuffs
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const debuffName = prompt("Nome do debuff:");
                if (debuffName) {
                  const debuffDesc = prompt("Descrição:");
                  if (debuffDesc) {
                    const debuffSource = prompt("Origem:");
                    if (debuffSource) {
                      const debuffDuration = prompt("Duração:");
                      if (debuffDuration) {
                        const debuffEffect = prompt(
                          "Efeito (ac, strength, etc.):",
                        );
                        if (debuffEffect) {
                          const debuffAmount = prompt("Valor:");
                          if (debuffAmount) {
                            appendDebuff({
                              name: debuffName,
                              description: debuffDesc,
                              source: debuffSource,
                              duration: debuffDuration,
                              affects: {
                                effect: debuffEffect,
                                amount: Number.parseInt(debuffAmount),
                              },
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Debuff
            </Button>
            <div className="space-y-2 mt-3">
              {debuffFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-bg-inset p-3 rounded border border-border-subtle"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-destructive">
                        {field.name}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.description}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {field.source} • {field.duration}
                      </p>
                      <p className="text-xs text-destructive mt-1">
                        {field.affects.amount} {field.affects.effect}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebuff(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hideActions && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
            <Button type="button" variant="outline" onClick={onCancelAction}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-arcane-500 hover:bg-arcane-400 text-white glow-arcane"
            >
              <Plus className="w-4 h-4 mr-2" />
              {player ? "Salvar Jogador" : "Criar Personagem"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
