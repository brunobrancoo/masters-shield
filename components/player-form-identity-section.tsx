"use client";

import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRaces, useClasses, useBackgrounds, useRace, useClass, useBackground } from "@/lib/api/hooks";

interface PlayerFormIdentitySectionProps {
  register: any;
  setValue: any;
  watch: any;
  errors: any;
}

export default function PlayerFormIdentitySection({
  register,
  setValue,
  watch,
  errors,
}: PlayerFormIdentitySectionProps) {
  const { data: racesData } = useRaces();
  const { data: classesData } = useClasses();
  const { data: backgroundsData } = useBackgrounds();

  const watchedRaceName = watch("raceName");
  const watchedRaceIndex = watch("raceIndex");
  const watchedClassName = watch("className");
  const watchedClassIndex = watch("classIndex");
  const watchedBackgroundName = watch("backgroundName");
  const watchedBackgroundIndex = watch("backgroundIndex");
  const watchedLevel = watch("level") || 1;
  const watchedSubclassName = watch("subclassName");
  const watchedSubclassIndex = watch("subclassIndex");

  const { data: raceQueryData } = useRace(watchedRaceIndex);
  const { data: classQueryData } = useClass(watchedClassIndex);
  const { data: backgroundQueryData } = useBackground(watchedBackgroundIndex);

  const raceData = raceQueryData?.race;
  const selectedClass = classQueryData?.class;
  const selectedBackground = backgroundQueryData?.background;

  const [raceSearch, setRaceSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [backgroundSearch, setBackgroundSearch] = useState("");
  const [subclassSearch, setSubclassSearch] = useState("");

  const [raceDropdownOpen, setRaceDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [backgroundDropdownOpen, setBackgroundDropdownOpen] = useState(false);
  const [subclassDropdownOpen, setSubclassDropdownOpen] = useState(false);

  const raceDropdownRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);
  const backgroundDropdownRef = useRef<HTMLDivElement>(null);
  const subclassDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (raceDropdownRef.current && !raceDropdownRef.current.contains(event.target as Node)) {
        setRaceDropdownOpen(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setClassDropdownOpen(false);
      }
      if (backgroundDropdownRef.current && !backgroundDropdownRef.current.contains(event.target as Node)) {
        setBackgroundDropdownOpen(false);
      }
      if (subclassDropdownRef.current && !subclassDropdownRef.current.contains(event.target as Node)) {
        setSubclassDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const raceOptions = racesData?.races?.map((r: any) => ({ value: r.name, label: r.name, index: r.index })) || [];
  const classOptions = classesData?.classes?.map((c: any) => ({ value: c.name, label: c.name, index: c.index })) || [];
  const backgroundOptions = backgroundsData?.backgrounds?.map((b: any) => ({ value: b.name, label: b.name, index: b.index })) || [];
  const subclassOptions = selectedClass?.subclasses?.map((s: any) => ({ value: s.name, label: s.name, index: s.index })) || [];

  const filteredRaces = raceOptions.filter((r: any) => r.label.toLowerCase().includes(raceSearch.toLowerCase()));
  const filteredClasses = classOptions.filter((c: any) => c.label.toLowerCase().includes(classSearch.toLowerCase()));
  const filteredBackgrounds = backgroundOptions.filter((b: any) => b.label.toLowerCase().includes(backgroundSearch.toLowerCase()));
  const filteredSubclasses = subclassOptions.filter((s: any) => s.label.toLowerCase().includes(subclassSearch.toLowerCase()));

  const getCasterClasses = () => ["bard", "cleric", "druid", "sorcerer", "warlock", "wizard", "paladin", "ranger"];
  const getClassResourceTypes = () => ({
    "sorcerer": "sorceryPoints",
    "monk": "kiPoints",
    "barbarian": "rages",
    "bard": "inspiration",
    "cleric": "channelDivinityCharges",
  } as Record<string, string>);

  useEffect(() => {
    if (raceData) {
      setValue("raceIndex", raceData.index || "");
      setValue("speed", raceData.speed || 30);
      setValue("raceProficiencies", raceData.traits?.flatMap((t: any) => t.proficiencies?.map((p: any) => p.index) || []) || []);
      setValue("raceTraits", raceData.traits?.map((t: any) => t.index) || []);

      raceData.ability_bonuses?.forEach((ab: any) => {
        const attrMap: Record<string, string> = { "STR": "for", "DEX": "des", "CON": "con", "INT": "int", "WIS": "sab", "CHA": "car" };
        const attrKey = attrMap[ab.ability_score?.index];
        if (attrKey) {
          setValue(`attributes.${attrKey}`, 10 + ab.bonus);
        }
      });
    }
  }, [raceData, setValue]);

  useEffect(() => {
    if (selectedBackground) {
      setValue("backgroundIndex", selectedBackground.index || "");
      setValue("backgroundProficiencies", selectedBackground.starting_proficiencies?.map((p: any) => p.index) || []);
      if (selectedBackground.feature) {
        setValue("backgroundFeature", selectedBackground.feature.name || "");
      }
    }
  }, [selectedBackground, setValue]);

  useEffect(() => {
    if (selectedClass) {
      setValue("classIndex", selectedClass.index || "");
      setValue("classProficiencies", selectedClass.proficiencies?.map((p: any) => p.index) || []);

      const levelData = selectedClass.class_levels?.find((l: any) => l.level === watchedLevel);
      if (levelData) {
        if (levelData.prof_bonus !== undefined) {
          setValue("proficiencyBonus", levelData.prof_bonus);
        }

        if (levelData.spellcasting) {
          setValue("spellSlots", {
            1: { current: levelData.spellcasting.spell_slots_level_1 || 0, max: levelData.spellcasting.spell_slots_level_1 || 0 },
            2: { current: levelData.spellcasting.spell_slots_level_2 || 0, max: levelData.spellcasting.spell_slots_level_2 || 0 },
            3: { current: levelData.spellcasting.spell_slots_level_3 || 0, max: levelData.spellcasting.spell_slots_level_3 || 0 },
            4: { current: levelData.spellcasting.spell_slots_level_4 || 0, max: levelData.spellcasting.spell_slots_level_4 || 0 },
            5: { current: levelData.spellcasting.spell_slots_level_5 || 0, max: levelData.spellcasting.spell_slots_level_5 || 0 },
            6: { current: levelData.spellcasting.spell_slots_level_6 || 0, max: levelData.spellcasting.spell_slots_level_6 || 0 },
            7: { current: levelData.spellcasting.spell_slots_level_7 || 0, max: levelData.spellcasting.spell_slots_level_7 || 0 },
            8: { current: levelData.spellcasting.spell_slots_level_8 || 0, max: levelData.spellcasting.spell_slots_level_8 || 0 },
            9: { current: levelData.spellcasting.spell_slots_level_9 || 0, max: levelData.spellcasting.spell_slots_level_9 || 0 },
          });
        }

        if (levelData.class_specific) {
          const cs: any = levelData.class_specific;
          const resourceTypes = getClassResourceTypes();
          const classIndex = selectedClass.index;
          const resourceKey = resourceTypes[classIndex];

          if (resourceKey && cs[resourceKey] !== undefined) {
            setValue(resourceKey, { [resourceKey]: cs[resourceKey], [`${resourceKey}_max`]: cs[resourceKey] });
          }
        }
      } else {
        // Clear resources if level data not found
        setValue("spellSlots", undefined);
        const resourceTypes = getClassResourceTypes();
        const classIndex = selectedClass.index;
        const resourceKey = resourceTypes[classIndex];
        if (resourceKey) {
          setValue(resourceKey, { [resourceKey]: undefined });
        }
      }
    }
  }, [selectedClass, watchedLevel, setValue]);

  const isCaster = selectedClass && getCasterClasses().includes(selectedClass.index);
  const hasClassResources = selectedClass && getClassResourceTypes()[selectedClass.index];

  const getCumulativeFeatures = () => {
    if (!selectedClass?.class_levels) return [];
    const features: any[] = [];
    for (let lvl = 1; lvl <= watchedLevel; lvl++) {
      const levelData = selectedClass.class_levels.find((l: any) => l.level === lvl);
      if (levelData?.features) {
        features.push(...levelData.features);
      }
    }
    return features;
  };

  const watchedAttributes = watch("attributes");
  const conModifier = Math.floor((watchedAttributes?.con || 10) / 5) - 4;

  const calculateMaxHP = () => {
    if (!selectedClass) return 10;
    const hitDie = selectedClass.hit_die || 8;
    const maxHP = hitDie + ((watchedLevel - 1) * (hitDie / 2)) + (conModifier * watchedLevel);
    return Math.max(1, maxHP);
  };

  const handleRollMaxHP = () => {
    if (!selectedClass) return;
    const hitDie = selectedClass.hit_die || 8;
    let total = hitDie;
    for (let i = 0; i < watchedLevel - 1; i++) {
      total += Math.floor(Math.random() * hitDie) + 1;
    }
    const maxHP = total + (conModifier * watchedLevel);
    setValue("maxHp", Math.max(1, maxHP));
    setValue("hp", Math.max(1, maxHP));
  };

  useEffect(() => {
    if (selectedClass && watchedAttributes) {
      const newMaxHP = calculateMaxHP();
      setValue("maxHp", newMaxHP);
      if (!watch("hp") || watch("hp") > newMaxHP) {
        setValue("hp", newMaxHP);
      }
    }
  }, [selectedClass, watchedLevel, watchedAttributes?.con, setValue]);

  return (
    <div className="bg-bg-surface rounded-lg border border-border-default p-6 shadow-lg">
      <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-arcane-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 00-8 0zM12 14a7 7 0 00-7 7h9a7 7 0 00-7-7" />
        </svg>
        Identidade
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-secondary font-medium">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Nome do personagem"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
          />
          {errors.name?.message && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="race" className="text-text-secondary font-medium">
            Raça <span className="text-destructive">*</span>
          </Label>
          <Combobox ref={raceDropdownRef}>
            <ComboboxInput
              value={raceSearch || watchedRaceName}
              onChange={(val) => {
                setRaceSearch(val);
                setRaceDropdownOpen(true);
              }}
              onFocus={() => {
                setRaceDropdownOpen(true);
                setRaceSearch("");
              }}
              onBlur={() => setRaceSearch("")}
              placeholder="Ex: Humano, Elfo"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            />
            {raceDropdownOpen ? (
              <ComboboxList>
                <ComboboxContent>
                  {filteredRaces.length > 0 ? (
                    filteredRaces.map((r: any) => (
                      <ComboboxItem
                        key={r.value}
                        value={r.value}
                        selected={watchedRaceName === r.value}
                        onSelect={(val) => {
                          setValue("raceName", val);
                          setValue("raceIndex", r.index);
                          setRaceSearch("");
                          setRaceDropdownOpen(false);
                        }}
                      >
                        {r.label}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>Nenhuma raça encontrada</ComboboxEmpty>
                  )}
                </ComboboxContent>
              </ComboboxList>
            ) : null}
          </Combobox>
          {errors.raceName?.message && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.raceName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="className" className="text-text-secondary font-medium">
            Classe <span className="text-destructive">*</span>
          </Label>
          <Combobox ref={classDropdownRef}>
            <ComboboxInput
              value={classSearch || watchedClassName}
              onChange={(val) => {
                setClassSearch(val);
                setClassDropdownOpen(true);
              }}
              onFocus={() => {
                setClassDropdownOpen(true);
                setClassSearch("");
              }}
              onBlur={() => setClassSearch("")}
              placeholder="Ex: Guerreiro, Mago"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            />
            {classDropdownOpen ? (
              <ComboboxList>
                <ComboboxContent>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((c: any) => (
                      <ComboboxItem
                        key={c.value}
                        value={c.value}
                        selected={watchedClassName === c.value}
                        onSelect={(val) => {
                          // Batch all setValue calls together
                          setValue("className", val);
                          setValue("classIndex", c.index);
                          setClassSearch("");
                          setClassDropdownOpen(false);
                        }}
                      >
                        {c.label}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>Nenhuma classe encontrada</ComboboxEmpty>
                  )}
                </ComboboxContent>
              </ComboboxList>
            ) : null}
          </Combobox>
          {errors.className?.message && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.className.message}
            </p>
          )}
        </div>

        {/* Hidden input for classIndex to ensure proper form registration */}
        <input type="hidden" {...register("classIndex")} />

        <div className="space-y-2">
          <Label htmlFor="level" className="text-text-secondary font-medium">Nível</Label>
          <Input
            id="level"
            type="number"
            min="1"
            max="20"
            {...register("level")}
            placeholder="1"
            className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
          />
          {errors.level?.message && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.level.message}
            </p>
          )}
        </div>

        {watchedLevel >= 3 && subclassOptions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="subclass" className="text-text-secondary font-medium">Subclasse</Label>
            <Combobox ref={subclassDropdownRef}>
              <ComboboxInput
                value={subclassSearch || watchedSubclassName || ""}
                onChange={(val) => {
                  setSubclassSearch(val);
                  setSubclassDropdownOpen(true);
                }}
                onFocus={() => {
                  setSubclassDropdownOpen(true);
                  setSubclassSearch("");
                }}
                onBlur={() => setSubclassSearch("")}
                placeholder="Ex: Draconic Bloodline"
                className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
              />
              {subclassDropdownOpen ? (
                <ComboboxList>
                  <ComboboxContent>
                    {filteredSubclasses.length > 0 ? (
                      filteredSubclasses.map((s: any) => (
                        <ComboboxItem
                          key={s.value}
                          value={s.value}
                          selected={watchedSubclassName === s.value}
                          onSelect={(val) => {
                            setValue("subclassName", val);
                            setValue("subclassIndex", s.index);
                            setSubclassSearch("");
                            setSubclassDropdownOpen(false);
                          }}
                        >
                          {s.label}
                        </ComboboxItem>
                      ))
                    ) : (
                      <ComboboxEmpty>Nenhuma subclasse encontrada</ComboboxEmpty>
                    )}
                  </ComboboxContent>
                </ComboboxList>
              ) : null}
            </Combobox>
            {errors.subclassName?.message && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-destructive" />
                {errors.subclassName.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="background" className="text-text-secondary font-medium">Histórico</Label>
          <Combobox ref={backgroundDropdownRef}>
            <ComboboxInput
              value={backgroundSearch || watchedBackgroundName || ""}
              onChange={(val) => {
                setBackgroundSearch(val);
                setBackgroundDropdownOpen(true);
              }}
              onFocus={() => {
                setBackgroundDropdownOpen(true);
                setBackgroundSearch("");
              }}
              onBlur={() => setBackgroundSearch("")}
              placeholder="Ex: Camponês, Nobre"
              className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
            />
            {backgroundDropdownOpen ? (
              <ComboboxList>
                <ComboboxContent>
                  {filteredBackgrounds.length > 0 ? (
                    filteredBackgrounds.map((b: any) => (
                      <ComboboxItem
                        key={b.value}
                        value={b.value}
                        selected={watchedBackgroundName === b.value}
                        onSelect={(val) => {
                          setValue("backgroundName", val);
                          setValue("backgroundIndex", b.index);
                          setBackgroundSearch("");
                          setBackgroundDropdownOpen(false);
                        }}
                      >
                        {b.label}
                      </ComboboxItem>
                    ))
                  ) : (
                    <ComboboxEmpty>Nenhum histórico encontrado</ComboboxEmpty>
                  )}
                </ComboboxContent>
              </ComboboxList>
            ) : null}
          </Combobox>
          {errors.backgroundName?.message && (
            <p className="text-destructive text-xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-destructive" />
              {errors.backgroundName.message}
            </p>
          )}
        </div>
      </div>

      {raceData && (
        <div className="mt-4 p-4 bg-bg-inset rounded border border-border-default">
          <h4 className="font-semibold text-sm text-arcane-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5 2-7z" />
            </svg>
            {raceData.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Velocidade:</span> {raceData.speed} ft
            </div>
            <div>
              <span className="text-text-secondary">Tamanho:</span> {raceData.size}
            </div>
            <div className="col-span-2">
              <span className="text-text-secondary">Bônus de Atributo:</span>{" "}
              {raceData.ability_bonuses?.map((ab: any) => `${ab.ability_score?.name} +${ab.bonus}`).join(", ")}
            </div>
            {raceData.traits?.length > 0 && (
              <div className="col-span-2">
                <span className="text-text-secondary">Traços:</span>{" "}
                {raceData.traits?.map((t: any) => t.name).join(", ")}
              </div>
            )}
            {raceData.languages?.length > 0 && (
              <div className="col-span-2">
                <span className="text-text-secondary">Idiomas:</span>{" "}
                {raceData.languages?.map((l: any) => l.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="mt-4 p-4 bg-bg-inset rounded border border-border-default">
          <h4 className="font-semibold text-sm text-martial-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h4m-2 0v6m0-6l2 2m-2 0v6" />
            </svg>
            {selectedClass.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Dado de Vida:</span> d{selectedClass.hit_die}
            </div>
            <div className="col-span-2">
              <span className="text-text-secondary">Testes de Resistência:</span>{" "}
              {selectedClass.saving_throws?.map((st: any) => st.name).join(", ")}
            </div>
            {selectedClass.proficiencies && selectedClass.proficiencies.length > 0 && (
              <div className="col-span-2">
                <span className="text-text-secondary">Proficiências:</span>{" "}
                {selectedClass.proficiencies.map((p: any) => p.name).join(", ")}
              </div>
            )}
            {selectedClass.subclasses && selectedClass.subclasses.length > 0 && (
              <div className="col-span-2">
                <span className="text-text-secondary">Subclasses:</span>{" "}
                {selectedClass.subclasses.map((sc: any) => sc.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedBackground && (
        <div className="mt-4 p-4 bg-bg-inset rounded border border-border-default">
          <h4 className="font-semibold text-sm text-nature-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7 5H4a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5 4 14H4l4-4z" />
            </svg>
            {selectedBackground.name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {selectedBackground.feature && (
              <div className="col-span-2">
                <span className="text-text-secondary">Recurso:</span> {selectedBackground.feature.name}
              </div>
            )}
            {selectedBackground.starting_equipment?.length > 0 && (
              <div className="col-span-2">
                <span className="text-text-secondary">Equipamento Inicial:</span>{" "}
                {selectedBackground.starting_equipment?.map((e: any) => `${e.quantity}x ${e.equipment?.name}`).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
