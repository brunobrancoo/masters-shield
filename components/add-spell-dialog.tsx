"use client";

import { useEffect, useState } from "react";
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
import { useSpells, mapApiSpellToInterface } from "@/lib/api/hooks";
import { Spell, Homebrew } from "@/lib/interfaces/interfaces";
import { spellSchema, SpellFormData } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { createHomebrew, onHomebrewsChange } from "@/lib/firebase-storage";
import { sanitizeForFirebase } from "@/lib/interfaces/interfaces";

interface AddSpellDialogProps {
  onAdd: (spell: Spell) => void;
  campaignId: string;
}

export default function AddSpellDialog({ onAdd, campaignId }: AddSpellDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: spellsData, isLoading } = useSpells(debouncedSearchQuery);
  const [selectedSpellIndex, setSelectedSpellIndex] = useState<number | null>(null);
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
  } = useForm<SpellFormData>({
    resolver: zodResolver(spellSchema),
    defaultValues: {
      name: "",
      level: 0,
      school: "",
      castingTime: "",
      duration: "",
      range: "",
      components: "",
      concentration: false,
      ritual: false,
    },
  });

  useEffect(() => {
    if (!campaignId) return;

    const unsubscribe = onHomebrewsChange(campaignId, (data) => {
      setHomebrews(data);
    });

    return () => unsubscribe();
  }, [campaignId]);

  const handleSelectApiSpell = (spell: any, index: number) => {
    setSelectedSpellIndex(index);

    setValue("name", spell.name || "", { shouldDirty: true });
    setValue("level", spell.level || 0, { shouldDirty: true });
    setValue("school", spell.school?.name || "", { shouldDirty: true });
    setValue("castingTime", spell.casting_time || "", { shouldDirty: true });
    setValue("duration", spell.duration || "", { shouldDirty: true });
    setValue("range", spell.range || "", { shouldDirty: true });
    setValue("components", spell.components?.join(", ") || "", { shouldDirty: true });
    setValue("concentration", spell.concentration || false, { shouldDirty: true });
    setValue("ritual", spell.ritual || false, { shouldDirty: true });

    setTimeout(() => {
      trigger();
    }, 0);
  };

  const onSubmit = async (data: SpellFormData) => {
    const newSpell: Spell = {
      index: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      level: data.level,
      school: data.school,
      castingTime: data.castingTime,
      duration: data.duration,
      range: data.range,
      components: data.components,
      concentration: data.concentration,
      ritual: data.ritual,
      description: [],
      damage: undefined,
      dc: undefined,
      areaOfEffect: undefined,
      higherLevel: [],
      attackType: undefined,
      material: undefined,
    };

    const sanitizedSpell = sanitizeForFirebase(newSpell);
    await onAdd(sanitizedSpell);

    const selectedHomebrew = filteredHomebrews.find(
      (hb) => hb.name === data.name
    );

    if (!selectedHomebrew && campaignId) {
      try {
        await createHomebrew(campaignId, {
          name: data.name,
          itemType: "spell",
          spell: sanitizedSpell,
        });
      } catch (error) {
        console.error("Failed to save to homebrew:", error);
      }
    }

    reset();
    setOpen(false);
    setSearchQuery("");
    setHomebrewSearchQuery("");
    setSelectedSpellIndex(null);
  };

  const filteredHomebrews = homebrews.filter((hb) => {
    if (!debouncedHomebrewSearchQuery) {
      return hb.itemType === "spell";
    }

    return (
      hb.itemType === "spell" &&
      hb.name.toLowerCase().includes(debouncedHomebrewSearchQuery.toLowerCase())
    );
  });

  const handleSelectHomebrewSpell = (homebrew: Homebrew) => {
    setSelectedSpellIndex(null);

    if (homebrew.spell) {
      setValue("name", homebrew.spell.name, { shouldDirty: true });
      setValue("level", homebrew.spell.level, { shouldDirty: true });
      setValue("school", homebrew.spell.school, { shouldDirty: true });
      setValue("castingTime", homebrew.spell.castingTime, { shouldDirty: true });
      setValue("duration", homebrew.spell.duration, { shouldDirty: true });
      setValue("range", homebrew.spell.range, { shouldDirty: true });
      setValue("components", homebrew.spell.components, { shouldDirty: true });
      setValue("concentration", homebrew.spell.concentration, { shouldDirty: true });
      setValue("ritual", homebrew.spell.ritual, { shouldDirty: true });
    }

    setTimeout(() => trigger(), 0);
  };

  const getSchoolColor = (schoolName: string | undefined) => {
    if (!schoolName) return "text-text-secondary border-border-default bg-bg-surface";
    const schoolLower = schoolName.toLowerCase();
    switch (schoolLower) {
      case "abjuration":
        return "text-divine-400 border-divine-400/30 bg-divine-400/10";
      case "conjuration":
        return "text-nature-400 border-nature-400/30 bg-nature-400/10";
      case "divination":
        return "text-arcane-400 border-arcane-400/30 bg-arcane-400/10";
      case "enchantment":
        return "text-martial-400 border-martial-400/30 bg-martial-400/10";
      case "evocation":
        return "text-damage border-damage/30 bg-damage/10";
      case "illusion":
        return "text-arcane-400 border-arcane-400/30 bg-arcane-400/10";
      case "necromancy":
        return "text-text-tertiary border-text-tertiary/30 bg-text-tertiary/10";
      case "transmutation":
        return "text-nature-400 border-nature-400/30 bg-nature-400/10";
      default:
        return "text-text-secondary border-border-default bg-bg-surface";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchQuery("");
          setHomebrewSearchQuery("");
          setSelectedSpellIndex(null);
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
            Adicionar Magia
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
                    placeholder="Digite para buscar magias automaticamente..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSpellIndex(null);
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
                      ) : spellsData?.spells && spellsData.spells.length > 0 ? (
                        <div className="divide-y divide-border-subtle">
                          {spellsData.spells.map((spell: any, idx: number) => (
                            <button
                              key={spell?.index || idx}
                              type="button"
                              onClick={() => handleSelectApiSpell(spell, idx)}
                              className={`w-full text-left px-5 py-4 transition-all flex justify-between items-center group ${selectedSpellIndex === idx
                                  ? "bg-arcane-400/10 border-l-4 border-l-arcane-400"
                                  : "hover:bg-bg-surface border-l-4 border-l-transparent"
                                }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-semibold text-text-primary group-hover:text-arcane-300 transition-colors">
                                    {spell?.name}
                                  </span>
                                  <Badge
                                    className={`text-[10px] uppercase tracking-wider ${getSchoolColor(spell?.school?.name)}`}
                                  >
                                    {spell?.school?.name || "Unknown"}
                                  </Badge>
                                  <Badge className="text-[10px] bg-arcane-500/20 text-arcane-500">
                                    Nível {spell?.level || 0}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-text-tertiary">
                                  <span>{spell?.casting_time}</span>
                                  <span>•</span>
                                  <span>{spell?.duration}</span>
                                  <span>•</span>
                                  <span>{spell?.range}</span>
                                </div>
                              </div>
                              {selectedSpellIndex === idx && (
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
                            Nenhuma magia encontrada para "{debouncedSearchQuery}"
                          </p>
                          <p className="text-xs text-text-tertiary mt-1">
                            Tente termos como "fireball", "heal", "magic missile"...
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
                        Digite para buscar magias na API D&D 5e automaticamente
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
                    placeholder="Digite para buscar magias homebrew..."
                    value={homebrewSearchQuery}
                    onChange={(e) => {
                      setHomebrewSearchQuery(e.target.value);
                      setSelectedSpellIndex(null);
                    }}
                    className="bg-bg-inset border-border-default focus:border-nature-400 h-11 flex-1"
                  />
                </div>

                <div className="mt-4 border border-border-default rounded-md bg-bg-inset max-h-72 overflow-y-auto">
                  {filteredHomebrews.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-text-secondary">
                        {homebrewSearchQuery
                          ? `Nenhuma magia homebrew encontrada para "${homebrewSearchQuery}"`
                          : "Nenhuma magia homebrew adicionada ainda"}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1">
                        Magias adicionadas manualmente aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border-subtle">
                      {filteredHomebrews.map((homebrew) => (
                        <button
                          key={homebrew.id}
                          type="button"
                          onClick={() => handleSelectHomebrewSpell(homebrew)}
                          className="w-full text-left px-4 py-3 hover:bg-bg-surface transition-all flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{homebrew.name}</span>
                              <Badge className="text-[10px] bg-nature-400/20 text-nature-400">
                                Custom
                              </Badge>
                            </div>
                            {homebrew.spell && (
                              <p className="text-xs text-text-tertiary mt-1">
                                {homebrew.spell.school} • Nível {homebrew.spell.level}
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
              <span className="w-1 h-4 bg-arcane-400 rounded-full"></span>
              Ou preencha manualmente
            </Label>

            <div className="bg-bg-surface rounded-lg border border-border-default p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-name"
                    className="text-text-secondary font-medium"
                  >
                    Nome <span className="text-damage">*</span>
                  </Label>
                  <Input
                    id="spell-name"
                    {...register("name")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: Bola de Fogo"
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
                    htmlFor="spell-level"
                    className="text-text-secondary font-medium"
                  >
                    Nível <span className="text-damage">*</span>
                  </Label>
                  <Input
                    id="spell-level"
                    type="number"
                    {...register("level", { valueAsNumber: true })}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="0-9"
                    min={0}
                    max={9}
                  />
                  {errors.level && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.level.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-school"
                    className="text-text-secondary font-medium"
                  >
                    Escola de Magia
                  </Label>
                  <Input
                    id="spell-school"
                    {...register("school")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: Evocation, Illusion"
                  />
                  {errors.school && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.school.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-casting-time"
                    className="text-text-secondary font-medium"
                  >
                    Tempo de Conjuração
                  </Label>
                  <Input
                    id="spell-casting-time"
                    {...register("castingTime")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: 1 ação, 1 minuto"
                  />
                  {errors.castingTime && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.castingTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-duration"
                    className="text-text-secondary font-medium"
                  >
                    Duração
                  </Label>
                  <Input
                    id="spell-duration"
                    {...register("duration")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: Instantâneo, 1 hora"
                  />
                  {errors.duration && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.duration.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="spell-range"
                    className="text-text-secondary font-medium"
                  >
                    Alcance
                  </Label>
                  <Input
                    id="spell-range"
                    {...register("range")}
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                    placeholder="Ex: Self, Touch, 60 ft"
                  />
                  {errors.range && (
                    <p className="text-damage text-xs flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                      {errors.range.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="spell-components"
                  className="text-text-secondary font-medium"
                >
                  Componentes
                </Label>
                <Input
                  id="spell-components"
                  {...register("components")}
                  className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  placeholder="V, S, M"
                />
                {errors.components && (
                  <p className="text-damage text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-damage"></span>
                    {errors.components.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border border-border-subtle">
                  <input
                    type="checkbox"
                    id="spell-concentration"
                    {...register("concentration")}
                    className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                  />
                  <Label
                    htmlFor="spell-concentration"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Concentração</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 bg-bg-inset rounded-lg border border-border-subtle">
                  <input
                    type="checkbox"
                    id="spell-ritual"
                    {...register("ritual")}
                    className="w-5 h-5 rounded border-border-default text-arcane-400 focus:ring-arcane-400/20"
                  />
                  <Label
                    htmlFor="spell-ritual"
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Ritual</span>
                  </Label>
                </div>
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
                setSelectedSpellIndex(null);
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
              Adicionar Magia
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
