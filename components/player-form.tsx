"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayableCharacter } from "@/lib/interfaces/interfaces";
import { useForm, useFieldArray } from "react-hook-form";
import { useClass } from "@/lib/api/hooks";
import { playableCharacterSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { convertApiEquipmentToItem } from "@/lib/interfaces/interfaces";

import PlayerFormIdentitySection from "./player-form-identity-section";
import PlayerFormHealthSection from "./player-form-health-section";
import PlayerFormCombatStatsSection from "./player-form-combat-stats-section";
import PlayerFormSpellcastingSection from "./player-form-spellcasting-section";
import ClassResourceFormSection from "./class-resource-form-section";
import PlayerFormAttributesSection from "./player-form-attributes-section";
import PlayerFormInventorySection from "./player-form-inventory-section";
import PlayerFormNotesSection from "./player-form-notes-section";
import PlayerFormSkillsSection from "./player-form-dnd-skills-section";
import RaceFeaturesSection from "./race-features-section";
import ClassFeaturesSection from "./class-features-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProficiencyBonus, calculateModifier } from "@/lib/skills";

interface PlayerFormProps {
  playableCharacter?: PlayableCharacter;
  onSaveAction: (playableCharacter: PlayableCharacter) => void;
  onCancelAction?: () => void;
  hideActions?: boolean;
}

export default function PlayerForm({
  playableCharacter,
  onSaveAction,
  onCancelAction,
  hideActions = false,
}: PlayerFormProps) {
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [selectedEquipmentIndex, setSelectedEquipmentIndex] = useState<
    number | null
  >(null);
  const [previousClassIndex, setPreviousClassIndex] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(playableCharacterSchema),
    defaultValues: playableCharacter
      ? {
          ...playableCharacter,
          inventory: playableCharacter.inventory || [],
        }
      : {
          name: "",
          raceIndex: "",
          raceName: "",
          classIndex: "",
          className: "",
          level: 1,
          subclassIndex: "",
          subclassName: "",
          backgroundIndex: "",
          backgroundName: "",
          raceTraits: [],
          backgroundFeature: "",
          classFeatures: [],
          customFeatures: [],
          featFeatures: [],
          selectedProficiencies: [],
          raceProficiencies: [],
          backgroundProficiencies: [],
          classProficiencies: [],
          classEquipment: [],
          backgroundEquipment: [],
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
          skills: [],
          spellSlots: {
            1: { current: 0, max: 0 },
            2: { current: 0, max: 0 },
            3: { current: 0, max: 0 },
            4: { current: 0, max: 0 },
            5: { current: 0, max: 0 },
            6: { current: 0, max: 0 },
            7: { current: 0, max: 0 },
            8: { current: 0, max: 0 },
            9: { current: 0, max: 0 },
          },
          spellsKnown: [],
          spellAttack: 0,
          spellCD: 0,
          sorceryPoints: undefined,
          kiPoints: undefined,
          rages: undefined,
          inspiration: undefined,
          channelDivinityCharges: undefined,
          invocationsKnown: undefined,
          featResources: undefined,
          buffs: [],
          debuffs: [],
          profBonus: 0,
          abilityScoreImprovementsUsed: 0,
          wildShapeForm: "",
        },
  });

  const {
    fields: customFeatureFields,
    append: appendCustomFeature,
    remove: removeCustomFeature,
  } = useFieldArray({
    control,
    name: "customFeatures",
  });

  const {
    fields: featFeatureFields,
    append: appendFeatFeature,
    remove: removeFeatFeature,
  } = useFieldArray({
    control,
    name: "featFeatures",
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  const watchedClassIndex = watch("classIndex");
  const watchedLevel = watch("level") || 1;
  const watchedAttributes = watch("attributes");
  const watchedBackgroundIndex = watch("backgroundIndex");

  const proficiencyBonus = getProficiencyBonus(watchedLevel);

  useEffect(() => {
    setValue("proficiencyBonus", proficiencyBonus);
  }, [watchedLevel, proficiencyBonus, setValue]);

  const { data: classData } = useClass(watchedClassIndex || "");

  console.log("classData:", JSON.stringify(classData, null, 2));
  console.log("starting_equipment_options:", (classData?.class as any)?.starting_equipment_options);

  const hitDie = classData?.class?.hit_die || 8;

  const levelData = classData?.class?.class_levels?.find(
    (l: any) => l.level === watchedLevel,
  );
  const classProfBonus = levelData?.prof_bonus || proficiencyBonus;

  useEffect(() => {
    if (levelData?.prof_bonus !== undefined) {
      setValue("proficiencyBonus", levelData.prof_bonus);
    }
  }, [levelData, setValue]);

  // Auto-calculate AC based on DEX modifier
  useEffect(() => {
    const dexModifier = calculateModifier(watchedAttributes?.des || 10);
    setValue("ac", 10 + dexModifier);
  }, [watchedAttributes?.des, setValue]);

  // Populate inventory with class starting equipment when class changes
  // Only for new characters (no playableCharacter prop)
  useEffect(() => {
    // Only populate for new characters (not loading existing ones)
    if (playableCharacter) {
      return;
    }

    // Only populate if class has actually changed
    if (watchedClassIndex && watchedClassIndex !== previousClassIndex) {
      const startingEquipment = classData?.class?.starting_equipment;

      if (startingEquipment && startingEquipment.length > 0) {
        // Convert starting equipment to Item format
        const convertedItems: any[] = [];

        startingEquipment.forEach((classEquipment: any) => {
          if (classEquipment.equipment) {
            const baseItem = convertApiEquipmentToItem(
              classEquipment.equipment,
              "class",
            );

            // Create multiple items based on quantity
            for (let i = 0; i < classEquipment.quantity; i++) {
              convertedItems.push({ ...baseItem });
            }
          }
        });

        // Set the inventory with starting equipment
        setValue("inventory", convertedItems);
      }

      // Update previous class index
      setPreviousClassIndex(watchedClassIndex);
    }
  }, [
    watchedClassIndex,
    classData,
    playableCharacter,
    previousClassIndex,
    setValue,
  ]);

  const totalAbilityScoreImprovementsEarned =
    classData?.class?.class_levels?.reduce((sum: number, level: any) => {
      return sum + (level.ability_score_bonuses || 0);
    }, 0) || 0;
  const abilityScoreImprovementsUsed =
    watch("abilityScoreImprovementsUsed") || 0;
  const remainingAbilityScoreImprovements = Math.max(
    0,
    totalAbilityScoreImprovementsEarned - abilityScoreImprovementsUsed,
  );

  const handleRollMaxHP = () => {
    const conModifier = calculateModifier(watchedAttributes?.con || 10);

    let maxHP = 0;

    if (watchedLevel === 1) {
      // Level 1: Full hit die
      maxHP = hitDie + conModifier;
    } else {
      // Level 2+: Roll hit die for each level, add CON mod × level
      maxHP = hitDie; // Full hit die for level 1

      for (let i = 2; i <= watchedLevel; i++) {
        maxHP += Math.floor(Math.random() * hitDie) + 1; // Roll hit die
      }

      maxHP += watchedLevel * conModifier; // Add CON modifier for each level
    }

    setValue("maxHp", Math.max(1, maxHP));
    setValue("hp", Math.max(1, maxHP));
  };

  const handleAddItem = (item: any) => {
    append(item);
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const handleToggleEquip = (index: number) => {
    const currentItem = fields[index] as any;
    setValue(`inventory.${index}.equipped`, !currentItem.equipped);
  };

  const handleUpdateItem = (index: number, updatedItem: any) => {
    setValue(`inventory.${index}`, updatedItem);
  };

  useEffect(() => {
    if (playableCharacter) {
      reset(playableCharacter as any);
    }
  }, [playableCharacter, reset]);

  const onSubmit = (data: any) => {
    const filteredData: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        const filteredNested: any = {};
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (nestedValue !== undefined) {
            filteredNested[nestedKey] = nestedValue;
          }
        }
        if (Object.keys(filteredNested).length > 0) {
          filteredData[key] = filteredNested;
        }
      } else {
        filteredData[key] = value;
      }
    }

    const characterData: PlayableCharacter = {
      ...playableCharacter,
      ...filteredData,
      notes: filteredData.notes || "",
      maxHp: filteredData.maxHp,
    } as PlayableCharacter;

    if (playableCharacter?.id) {
      characterData.id = playableCharacter.id;
    }

    onSaveAction(characterData);
  };

  return (
    <form id="player-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <PlayerFormIdentitySection
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
        />

        <PlayerFormHealthSection
          register={register}
          errors={errors}
          onRollMaxHP={handleRollMaxHP}
          showRollButton={!!watchedClassIndex}
        />

        <PlayerFormCombatStatsSection
          register={register}
          watch={watch}
          attributes={watchedAttributes}
        />

        <PlayerFormAttributesSection
          register={register}
          errors={errors}
          setValue={setValue}
          remainingAbilityScoreImprovements={remainingAbilityScoreImprovements}
        />

        <PlayerFormSkillsSection
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          classIndex={watch("classIndex")}
          backgroundIndex={watch("backgroundIndex")}
          attributes={watch("attributes")}
          proficiencyBonus={watch("proficiencyBonus") || 2}
        />

        <RaceFeaturesSection
          raceIndex={watch("raceIndex")}
          register={register}
          watch={watch}
          errors={errors}
        />

        <ClassFeaturesSection
          classIndex={watch("classIndex")}
          level={watch("level") || 1}
          subclassIndex={watch("subclassIndex")}
          register={register}
          watch={watch}
          errors={errors}
        />

        <PlayerFormSpellcastingSection
          register={register}
          watch={watch}
          setValue={setValue}
          classIndex={watch("classIndex")}
          level={watch("level") || 1}
          attributes={watch("attributes")}
          proficiencyBonus={watch("proficiencyBonus") || 2}
        />

        <ClassResourceFormSection
          classIndex={watch("classIndex")}
          classData={classData}
          level={watch("level") || 1}
          watch={watch}
          setValue={setValue}
          register={register}
        />

        <PlayerFormInventorySection
          fields={fields}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onToggleEquip={handleToggleEquip}
          onUpdateItem={handleUpdateItem}
          itemSearchQuery={itemSearchQuery}
          setItemSearchQuery={setItemSearchQuery}
          selectedEquipmentIndex={selectedEquipmentIndex}
          setSelectedEquipmentIndex={setSelectedEquipmentIndex}
          startingEquipmentOptions={
            (classData?.class as any)?.starting_equipment_options?.[0]?.from?.options ||
            []
          }
          selectedStartingEquipmentCount={
            (classData?.class as any)?.starting_equipment_options?.[0]?.choose ||
            0
          }
          isNewCharacter={!playableCharacter}
        />

        <PlayerFormNotesSection register={register} />

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
              {playableCharacter ? "Salvar Jogador" : "Criar Personagem"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
