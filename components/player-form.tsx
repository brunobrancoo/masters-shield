"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayableCharacter } from "@/lib/schemas"; // <--- CHANGED: Import from schemas
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useClass } from "@/lib/api/hooks";
import { playableCharacterSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { convertApiEquipmentToItem } from "@/lib/character-utils"; // <--- CHANGED: Import from utils
import { zodResolver } from "@hookform/resolvers/zod";
import { getProficiencyBonus, calculateModifier } from "@/lib/skills";

import PlayerFormIdentitySection from "./player-form-identity-section";
import PlayerFormHealthSection from "./player-form-health-section";
import PlayerFormCombatStatsSection from "./player-form-combat-stats-section";
import PlayerFormSpellcastingSection from "./player-form-spellcasting-section";
import ClassResourceFormSection from "./class-resource-form-section";
import PlayerFormAttributesSection from "./player-form-attributes-section";
import PlayerFormNotesSection from "./player-form-notes-section";
import PlayerFormSkillsSection from "./player-form-dnd-skills-section";
import RaceFeaturesSection from "./race-features-section";
import ClassFeaturesSection from "./class-features-section";

interface PlayerFormProps {
  playableCharacter?: PlayableCharacter;
  onSaveAction: (playableCharacter: PlayableCharacter) => void;
  onCancelAction?: () => void;
  hideActions?: boolean;
}

// Maps classes to their specific resource fields
const CLASS_RESOURCES: Record<string, string[]> = {
  sorcerer: [
    "sorceryPoints",
    "spellSlots",
    "spellsKnown",
    "spellCD",
    "spellAttack",
  ],
  wizard: [
    "spellSlots",
    "spellBook",
    "preparedSpells",
    "spellCD",
    "spellAttack",
  ],
  cleric: ["spellSlots", "preparedSpells", "spellCD", "spellAttack"],
  druid: [
    "spellSlots",
    "availableSpells",
    "preparedSpells",
    "wildShapeForm",
    "spellCD",
    "spellAttack",
  ],
  bard: ["spellSlots", "spellsKnown", "inspiration", "spellCD", "spellAttack"],
  paladin: [
    "spellSlots",
    "spellsKnown",
    "channelDivinityCharges",
    "spellCD",
    "spellAttack",
  ],
  ranger: ["spellSlots", "spellsKnown", "spellCD", "spellAttack"],
  warlock: [
    "spellSlots",
    "spellsKnown",
    "invocationsKnown",
    "spellCD",
    "spellAttack",
  ],
  barbarian: ["rages"],
  monk: ["spellSlots", "spellsKnown", "kiPoints", "spellCD", "spellAttack"],
  rogue: ["sneakAttack"],
  fighter: ["actionSurges"],
};

export default function PlayerForm({
  playableCharacter,
  onSaveAction,
  onCancelAction,
  hideActions = false,
}: PlayerFormProps) {
  const [previousClassIndex, setPreviousClassIndex] = useState<string | null>(
    null,
  );
  const isEditing = !!playableCharacter;

  const form = useForm<Partial<PlayableCharacter>>({
    resolver: zodResolver(playableCharacterSchema),
    defaultValues: playableCharacter
      ? {
          ...playableCharacter,
          inventory: playableCharacter.inventory || [],
        }
      : {
          // Base Defaults
          id: undefined,
          name: "",
          raceIndex: "",
          // Defaulting to 'fighter' to satisfy the Discriminated Union requirement on mount
          // This will be overwritten when the user selects a class
          classIndex: "fighter",
          className: "",
          hitDie: 10,
          level: 1,
          languages: [],
          // subclassIndex: "",
          // subclassName: "",
          // backgroundIndex: "",
          // backgroundName: "",

          // Attributes
          attributes: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
          },

          // Stats
          hp: 10,
          maxHp: 10,
          ac: 10,
          speed: 30,
          initiativeBonus: 0,
          profBonus: 2, // Matches new schema field name

          // Choices
          selectedProficiencies: [],
          chosenRaceFeatures: [],

          // Dynamic State
          inventory: [],
          buffs: [],
          debuffs: [],
          notes: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  const watchedClassIndex = form.watch("classIndex");
  const watchedLevel = form.watch("level") || 1;
  const watchedAttributes = form.watch("attributes");

  const proficiencyBonus = getProficiencyBonus(watchedLevel);

  const { data: classData } = useClass(watchedClassIndex || "");

  const hitDie = classData?.class?.hit_die || 8;

  useEffect(() => {
    if (isEditing) return;
    const dexModifier = calculateModifier(watchedAttributes?.dex || 10);
    form.setValue("ac", 10 + dexModifier);
  }, [watchedAttributes?.dex, form]);

  useEffect(() => {
    if (isEditing) return;

    if (watchedClassIndex && watchedClassIndex !== previousClassIndex) {
      const startingEquipment = classData?.class?.starting_equipment;

      if (startingEquipment?.length) {
        const convertedItems: any[] = [];

        startingEquipment.forEach((classEquipment: any) => {
          if (classEquipment.equipment) {
            const baseItem = convertApiEquipmentToItem(
              classEquipment.equipment,
              "class",
            );

            for (let i = 0; i < classEquipment.quantity; i++) {
              convertedItems.push({ ...baseItem });
            }
          }
        });

        form.setValue("inventory", []);
      }

      setPreviousClassIndex(watchedClassIndex);
    }
  }, [
    watchedClassIndex,
    classData,
    playableCharacter,
    previousClassIndex,
    form,
  ]);

  const handleRollMaxHP = () => {
    const conModifier = calculateModifier(watchedAttributes?.con || 10);
    console.log("CON MODIFIER: ", conModifier);

    let maxHP = 0;

    if (watchedLevel === 1) {
      maxHP = hitDie + conModifier;
    } else {
      maxHP = hitDie;

      for (let i = 2; i <= watchedLevel; i++) {
        maxHP += Math.floor(Math.random() * hitDie) + 1;
        console.log("loop: ", maxHP, i, watchedLevel);
      }

      maxHP += watchedLevel * conModifier;
    }

    form.setValue("maxHp", Math.max(1, maxHP));
    form.setValue("hp", Math.max(1, maxHP));
  };

  const onSubmit = (data: any) => {
    console.log("state: ", form.formState);
    onSaveAction(data);
  };

  console.log("full form: ", form.watch());

  // CLEANUP EFFECT: Clears old class fields when switching classes
  useEffect(() => {
    if (isEditing) return;
    const newClassIndex = watchedClassIndex;

    // Only run if we have a valid old class and it's different from the new one
    if (
      previousClassIndex &&
      newClassIndex &&
      previousClassIndex !== newClassIndex
    ) {
      // 1. Get the fields that belonged to the OLD class
      const oldFields = CLASS_RESOURCES[previousClassIndex];
      const newFields = CLASS_RESOURCES[newClassIndex];

      // 2. UNREGISTER those fields (Removes them entirely from the form state)
      const oldFieldsToDrop = oldFields.filter(
        (oldField) => !newFields.includes(oldField),
      );
      if (oldFieldsToDrop) {
        oldFieldsToDrop.forEach((fieldName) => {
          form.unregister(fieldName as any, { keepDefaultValue: false });
        });
      }

      // Clear spells for non-casters explicitly
      // if (!CLASS_RESOURCES[newClassIndex]?.includes("spellSlots")) {
      //   form.unregister("spellSlots");
      //   form.unregister("spellAttack");
      //   form.unregister("spellCD");
      // }
    }

    // Update the tracker
    setPreviousClassIndex(newClassIndex!);
  }, [watchedClassIndex, form, previousClassIndex]);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.error("VALIDATION ERROR:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <form id="player-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6">
          <PlayerFormIdentitySection
            control={form.control}
            setValue={form.setValue}
            unregister={form.unregister}
            isEditing={isEditing}
          />
          <PlayerFormAttributesSection
            control={form.control}
            setValue={form.setValue}
          />

          {form && (
            <PlayerFormHealthSection
              form={form}
              showRollButton={!!watchedClassIndex}
            />
          )}

          <PlayerFormCombatStatsSection
            control={form.control}
            attributes={watchedAttributes}
            isEditing={isEditing}
          />

          <PlayerFormSkillsSection
            setValue={form.setValue}
            classIndex={form.watch("classIndex")!}
            attributes={form.watch("attributes")!}
            proficiencyBonus={form.watch("profBonus") || 2}
          />

          <RaceFeaturesSection raceIndex={form.watch("raceIndex")!} />

          <ClassFeaturesSection
            classIndex={form.watch("classIndex")!}
            level={form.watch("level") || 1}
            subclassIndex={form.watch("subclassIndex")}
          />

          <PlayerFormSpellcastingSection
            control={form.control}
            setValue={form.setValue}
            classIndex={form.watch("classIndex")!}
            level={form.watch("level") || 1}
            attributes={form.watch("attributes")!}
            proficiencyBonus={form.watch("profBonus") || 2}
            isEditing={isEditing}
          />

          <ClassResourceFormSection
            classIndex={form.watch("classIndex")!}
            classData={classData}
            level={form.watch("level") || 1}
            control={form.control}
            setValue={form.setValue}
            isEditing={isEditing}
          />

          {
            // <PlayerFormInventorySection
            //   fields={fields}
            //   onAddItem={append}
            //   onRemoveItem={remove}
            //   itemSearchQuery={itemSearchQuery}
            //   setItemSearchQuery={setItemSearchQuery}
            //   selectedEquipmentIndex={selectedEquipmentIndex}
            //   setSelectedEquipmentIndex={setSelectedEquipmentIndex}
            //   isNewCharacter={!playableCharacter}
            // />
          }

          <PlayerFormNotesSection control={form.control} />

          {!hideActions && (
            <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
              <Button type="button" variant="outline" onClick={onCancelAction}>
                Cancelar
              </Button>

              <Button
                type="submit"
                className="bg-arcane-500 hover:bg-arcane-400 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {playableCharacter ? "Salvar Jogador" : "Criar Personagem"}
              </Button>
            </div>
          )}
        </div>
      </FormProvider>
    </form>
  );
}
