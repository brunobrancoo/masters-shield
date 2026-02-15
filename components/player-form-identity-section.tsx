"use client";

import { useEffect, useState, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  useRaces,
  useClasses,
  useBackgrounds,
  useRace,
  useClass,
  useBackground,
} from "@/lib/api/hooks";
import type { Control } from "react-hook-form";
import { getProficiencyBonus } from "@/lib/skills";
import {
  convertLevelSpellcasting,
  getLevelClassData,
} from "@/lib/character-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { SpellSlots } from "@/lib/schemas";

interface PlayerFormIdentitySectionProps {
  control: Control<any>;
  setValue: any;
  unregister: any;
}

type RaceItem = {
  __typename?: "Race";
  index: string;
  name: string;
  speed: number;
};

type ClassItem = {
  index: string;
  name: string;
  hit_die: number;
};

export default function PlayerFormIdentitySection({
  control,
  setValue,
  unregister,
}: PlayerFormIdentitySectionProps) {
  const form = useFormContext();
  const { data: racesData, isLoading: loadingRace } = useRaces();
  const { data: classesData, isLoading: loadingClass } = useClasses();
  const { data: backgroundsData, isLoading: loadingBackground } =
    useBackgrounds();

  const watchedRaceIndex = form.watch("raceIndex");
  const watchedClassIndex = form.watch("classIndex");
  const watchedBackgroundIndex = form.watch("backgroundIndex");
  const watchedSubclassIndex = form.watch("subclassIndex");
  const watchedLevel = form.watch("level") || 1;

  const { data: raceQueryData } = useRace(watchedRaceIndex);
  const { data: classQueryData, isLoading: loadingClassQueryData } =
    useClass(watchedClassIndex) || null;
  const { data: backgroundQueryData } = useBackground(watchedBackgroundIndex);

  const raceData = raceQueryData?.race;
  const selectedClass = classQueryData?.class;
  const selectedBackground = backgroundQueryData?.background;

  // const raceOptions =
  //   racesData?.races?.map((r: any) => ({
  //     value: r.name,
  //     label: r.name,
  //     index: r.index,
  //   })) || [];
  // const classOptions =
  //   classesData?.classes?.map((c: any) => ({
  //     value: c.name,
  //     label: c.name,
  //     index: c.index,
  //   })) || [];
  // const backgroundOptions =
  //   backgroundsData?.backgrounds?.map((b: any) => ({
  //     value: b.name,
  //     label: b.name,
  //     index: b.index,
  //   })) || [];

  const subclassOptions =
    selectedClass?.subclasses?.map((s: any) => ({
      value: s.name,
      label: s.name,
      index: s.index,
    })) || [];

  // console.log("watched form: ", form.watch("level"), form.watch("profBonus"));

  const getCasterClasses = () => [
    "bard",
    "cleric",
    "druid",
    "sorcerer",
    "warlock",
    "wizard",
    "paladin",
    "ranger",
  ];
  const getClassResourceTypes = () =>
    ({
      sorcerer: "sorceryPoints",
      monk: "kiPoints",
      barbarian: "rages",
      bard: "inspiration",
      cleric: "channelDivinityCharges",
    }) as Record<string, string>;

  useEffect(() => {
    if (raceData) {
      setValue("raceIndex", raceData.index || "");
      setValue("speed", raceData.speed || 30);
      setValue(
        "languages",
        raceData.languages?.map((lang) => lang.name),
      );
    }
  }, [raceData, setValue]);

  //API DOESN'T HAVE BACKGROUND YET
  // useEffect(() => {
  //   if (selectedBackground) {
  //     setValue("backgroundIndex", selectedBackground.index || "");
  //     setValue(
  //       "backgroundProficiencies",
  //       selectedBackground.starting_proficiencies?.map((p: any) => p.index) ||
  //         [],
  //     );
  //     if (selectedBackground.feature) {
  //       setValue("backgroundFeature", selectedBackground.feature.name || "");
  //     }
  //   }
  // }, [selectedBackground, setValue]);

  // EFFECT: Handle Class & Level Changes
  useEffect(() => {
    if (!selectedClass || loadingClassQueryData) return;

    // 1. Set Basic Class Data
    setValue("classIndex", selectedClass.index || "");
    setValue(
      "classProficiencies",
      selectedClass.proficiencies?.map((p: any) => p.index) || [],
    );
    setValue("hitDie", selectedClass.hit_die);

    // 2. Find data for the CURRENT level
    const levelData = selectedClass.class_levels?.find(
      (l: any) => l.level === watchedLevel,
    );

    if (levelData) {
      // 3. Handle Spell Slots (Using your utility!)
      if (watchedClassIndex === "monk") {
        const monkSpellSlots: SpellSlots = {
          1: { current: 0, max: 0 },
          2: { current: 0, max: 0 },
          3: { current: 0, max: 0 },
          4: { current: 0, max: 0 },
          5: { current: 0, max: 0 },
          6: { current: 0, max: 0 },
          7: { current: 0, max: 0 },
          8: { current: 0, max: 0 },
          9: { current: 0, max: 0 },
        };
        setValue("spellSlots", monkSpellSlots);
      }
      if (levelData.spellcasting) {
        const slots = convertLevelSpellcasting(levelData.spellcasting);
        setValue("spellSlots", slots);
      }

      // 4. Handle ALL Class Data (Resources + Features)
      // This utility now returns: { sorceryPoints, rages, sneakAttack, inspirationDie, ... }
      const classData = getLevelClassData(selectedClass.index, levelData);

      Object.entries(classData).forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      // // Fallback for levels not found
      // setValue("spellSlots", undefined);
    }
  }, [selectedClass, watchedLevel, setValue, classQueryData]);

  // const isCaster =
  //   selectedClass && getCasterClasses().includes(selectedClass.index);
  // const hasClassResources =
  //   selectedClass && getClassResourceTypes()[selectedClass.index];
  //
  // const getCumulativeFeatures = () => {
  //   if (!selectedClass?.class_levels) return [];
  //   const features: any[] = [];
  //   for (let lvl = 1; lvl <= watchedLevel; lvl++) {
  //     const levelData = selectedClass.class_levels.find(
  //       (l: any) => l.level === lvl,
  //     );
  //     if (levelData?.features) {
  //       features.push(...levelData.features);
  //     }
  //   }
  //   return features;
  // };

  const watchedAttributes = form.watch("attributes");
  const conModifier = Math.floor((watchedAttributes?.con || 10) / 5) - 4;

  const calculateMaxHP = () => {
    if (!selectedClass) return 10;
    const hitDie = selectedClass.hit_die || 8;
    const maxHP =
      hitDie + (watchedLevel - 1) * (hitDie / 2) + conModifier * watchedLevel;
    return Math.max(1, maxHP);
  };

  const handleRollMaxHP = () => {
    if (!selectedClass) return;
    const hitDie = selectedClass.hit_die || 8;
    let total = hitDie;
    for (let i = 0; i < watchedLevel - 1; i++) {
      total += Math.floor(Math.random() * hitDie) + 1;
    }
    const maxHP = total + conModifier * watchedLevel;
    setValue("maxHp", Math.max(1, maxHP));
    setValue("hp", Math.max(1, maxHP));
  };

  return (
    <Accordion
      type="single"
      collapsible
      className=" rounded-lg border border-border-default p-6 shadow-lg"
    >
      <AccordionItem value="identity-section">
        <AccordionTrigger>
          <h3 className="font-heading text-sm uppercase tracking-wider text-text-secondary flex items-center gap-2">
            <svg
              className="w-4 h-4 text-arcane-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 00-8 0zM12 14a7 7 0 00-7 7h9a7 7 0 00-7-7"
              />
            </svg>
            Identidade
          </h3>
        </AccordionTrigger>
        <AccordionContent className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <FieldLabel
                    htmlFor="form-name"
                    className="text-text-secondary font-medium"
                  >
                    Nome <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="form-name"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Nome do personagem"
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </div>
              )}
            />

            <div className="space-y-2">
              <FieldLabel>Escolha uma raça</FieldLabel>
              <Controller
                name="raceName"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Combobox<RaceItem>
                      items={racesData?.races || []}
                      itemToStringValue={(race) => race.name}
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val !== null) {
                          const race = racesData?.races.find(
                            (race: RaceItem) =>
                              //@ts-ignore
                              race.index === val.toLowerCase(),
                          );
                          if (race) {
                            setValue("raceIndex", race.index);
                            setValue("speed", race.speed);
                          }
                        }
                      }}
                    >
                      <ComboboxInput placeholder="Select a race" />
                      <ComboboxContent>
                        <ComboboxEmpty>No races found.</ComboboxEmpty>
                        <ComboboxList className={"z-1000 pointer-events-auto"}>
                          {(race) => (
                            <ComboboxItem
                              // 4. Fixed key: RaceItem has 'index', not 'value'
                              key={race.index}
                              value={race.name}
                            >
                              {race.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  );
                }}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Escolha uma Classe</FieldLabel>
              <Controller
                name="className"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <Combobox<ClassItem>
                      items={classesData?.classes || []}
                      itemToStringValue={(dndClass) => dndClass.name}
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val !== null) {
                          const dndClass = classesData?.classes.find(
                            (dndClass: ClassItem) =>
                              //@ts-ignore
                              dndClass.index === val.toLowerCase(),
                          );
                          if (dndClass) {
                            setValue("classIndex", dndClass.index);
                          }
                        }
                      }}
                    >
                      <ComboboxInput placeholder="Fighter" />
                      <ComboboxContent>
                        <ComboboxEmpty>No races found.</ComboboxEmpty>
                        <ComboboxList className={"z-1000 pointer-events-auto"}>
                          {(dndClass) => (
                            <ComboboxItem
                              // 4. Fixed key: RaceItem has 'index', not 'value'
                              key={dndClass.index}
                              value={dndClass.name}
                            >
                              {dndClass.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  );
                }}
              />
            </div>

            <Controller
              name="level"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="space-y-2">
                  <FieldLabel className="text-text-secondary font-medium">
                    Nível
                  </FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      setValue(
                        "profBonus",
                        getProficiencyBonus(+e.target.value),
                      );
                    }}
                    placeholder="1"
                    className="bg-bg-inset border-border-default focus:border-arcane-400 h-11"
                  />
                  {error && <FieldError>{error.message}</FieldError>}
                </div>
              )}
            />

            {watchedLevel >= 3 && subclassOptions.length > 0 && (
              <div className="space-y-2">
                <FieldLabel
                  htmlFor="form-subclass"
                  className="text-text-secondary font-medium"
                >
                  Subclasse
                </FieldLabel>
                <Combobox
                  value={form.watch("subclassIndex") || ""}
                  onValueChange={(value) => {
                    const subclass = selectedClass?.subclasses?.find(
                      (s: any) => s.index === value,
                    );
                    if (subclass) {
                      form.setValue("subclassName", subclass.name);
                      form.setValue("subclassIndex", subclass.index);
                    }
                  }}
                >
                  <ComboboxInput placeholder="Ex: Draconic Bloodline" />
                  <ComboboxContent>
                    <ComboboxEmpty>Nenhuma subclasse encontrada</ComboboxEmpty>
                    <ComboboxList>
                      {(selectedClass?.subclasses ?? []).map((s: any) => (
                        <ComboboxItem key={s.index} value={s.index}>
                          {s.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {form.formState.errors.subclassName && (
                  <FieldError errors={[form.formState.errors.subclassName]} />
                )}
              </div>
            )}

            <div className="space-y-2">
              <FieldLabel
                htmlFor="form-background"
                className="text-text-secondary font-medium"
              >
                Histórico
              </FieldLabel>
              <Combobox
                value={form.watch("backgroundIndex") || ""}
                onValueChange={(value) => {
                  const background = backgroundsData?.backgrounds?.find(
                    (b: any) => b.index === value,
                  );
                  if (background) {
                    form.setValue("backgroundName", background.name);
                    form.setValue("backgroundIndex", background.index);
                  }
                }}
              >
                <ComboboxInput placeholder="Ex: Camponês, Nobre" />
                <ComboboxContent>
                  <ComboboxEmpty>Nenhum histórico encontrado</ComboboxEmpty>
                  <ComboboxList>
                    {(backgroundsData?.backgrounds ?? []).map((b: any) => (
                      <ComboboxItem key={b.index} value={b.index}>
                        {b.name}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {form.formState.errors.backgroundName && (
                <FieldError errors={[form.formState.errors.backgroundName]} />
              )}
            </div>
          </div>

          {raceData && (
            <div className="mt-4 p-4 bg-bg-inset rounded border border-border-default">
              <h4 className="font-semibold text-sm text-arcane-400 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2L2 7l10 5 10-5 2-7z"
                  />
                </svg>
                {raceData.name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Velocidade:</span>{" "}
                  {raceData.speed} ft
                </div>
                <div>
                  <span className="text-text-secondary">Tamanho:</span>{" "}
                  {raceData.size}
                </div>
                <div className="col-span-2">
                  <span className="text-text-secondary">
                    Bônus de Atributo:
                  </span>{" "}
                  {raceData.ability_bonuses
                    ?.map((ab: any) => `${ab.ability_score?.name} +${ab.bonus}`)
                    .join(", ")}
                </div>
                {raceData?.traits && raceData?.traits.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-text-secondary">Traços:</span>{" "}
                    {raceData.traits?.map((t: any) => t.name).join(", ")}
                  </div>
                )}
                {raceData?.languages && raceData?.languages.length > 0 && (
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 12h4m-2 0v6m0-6l2 2m-2 0v6"
                  />
                </svg>
                {selectedClass.name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Dado de Vida:</span> d
                  {selectedClass.hit_die}
                </div>
                <div className="col-span-2">
                  <span className="text-text-secondary">
                    Testes de Resistência:
                  </span>{" "}
                  {selectedClass.saving_throws
                    ?.map((st: any) => st.name)
                    .join(", ")}
                </div>
                {selectedClass.proficiencies &&
                  selectedClass.proficiencies.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-text-secondary">
                        Proficiências:
                      </span>{" "}
                      {selectedClass.proficiencies
                        .map((p: any) => p.name)
                        .join(", ")}
                    </div>
                  )}
                {
                  // selectedClass.subclasses &&
                  // selectedClass.subclasses.length > 0 && (
                  //   <div className="col-span-2">
                  //     <span className="text-text-secondary">Subclasses:</span>{" "}
                  //     {selectedClass.subclasses
                  //       .map((sc: any) => sc.name)
                  //       .join(", ")}
                  //   </div>
                  // )
                }
              </div>
            </div>
          )}

          {selectedBackground && (
            <div className="mt-4 p-4 bg-bg-inset rounded border border-border-default">
              <h4 className="font-semibold text-sm text-nature-400 mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7 5H4a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5 4 14H4l4-4z"
                  />
                </svg>
                {selectedBackground.name}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedBackground.feature && (
                  <div className="col-span-2">
                    <span className="text-text-secondary">Recurso:</span>{" "}
                    {selectedBackground.feature.name}
                  </div>
                )}
                {selectedBackground.starting_equipment?.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-text-secondary">
                      Equipamento Inicial:
                    </span>{" "}
                    {selectedBackground.starting_equipment
                      ?.map((e: any) => `${e.quantity}x ${e.equipment?.name}`)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
