"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayableCharacter } from "@/lib/interfaces/interfaces";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useClass } from "@/lib/api/hooks";
import { playableCharacterSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { convertApiEquipmentToItem } from "@/lib/interfaces/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProficiencyBonus, calculateModifier } from "@/lib/skills";

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

  const form = useForm<any>({
    resolver: zodResolver(playableCharacterSchema),
    defaultValues: playableCharacter
      ? {
          ...playableCharacter,
          inventory: playableCharacter.inventory || [],
          spellList: playableCharacter.spellList || [],
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
          spellList: [],
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "inventory",
  });

  const watchedClassIndex = form.watch("classIndex");
  const watchedLevel = form.watch("level") || 1;
  const watchedAttributes = form.watch("attributes");

  const proficiencyBonus = getProficiencyBonus(watchedLevel);

  useEffect(() => {
    form.setValue("proficiencyBonus", proficiencyBonus);
  }, [watchedLevel, proficiencyBonus, form]);

  const { data: classData } = useClass(watchedClassIndex || "");

  const hitDie = classData?.class?.hit_die || 8;

  useEffect(() => {
    const dexModifier = calculateModifier(watchedAttributes?.des || 10);
    form.setValue("ac", 10 + dexModifier);
  }, [watchedAttributes?.des, form]);

  useEffect(() => {
    if (playableCharacter) return;

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

        form.setValue("inventory", convertedItems);
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

    let maxHP = 0;

    if (watchedLevel === 1) {
      maxHP = hitDie + conModifier;
    } else {
      maxHP = hitDie;

      for (let i = 2; i <= watchedLevel; i++) {
        maxHP += Math.floor(Math.random() * hitDie) + 1;
      }

      maxHP += watchedLevel * conModifier;
    }

    form.setValue("maxHp", Math.max(1, maxHP));
    form.setValue("hp", Math.max(1, maxHP));
  };

  const onSubmit = (data: any) => {
    onSaveAction(data);
  };

  return (
    <form id="player-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6">
          <PlayerFormIdentitySection
            control={form.control}
            setValue={form.setValue}
          />

          <PlayerFormHealthSection
            control={form.control}
            onRollMaxHP={handleRollMaxHP}
            showRollButton={!!watchedClassIndex}
          />

          <PlayerFormCombatStatsSection
            control={form.control}
            attributes={watchedAttributes}
          />

          <PlayerFormAttributesSection
            control={form.control}
            setValue={form.setValue}
            remainingAbilityScoreImprovements={0}
          />

          <PlayerFormSkillsSection
            control={form.control}
            setValue={form.setValue}
            classIndex={form.watch("classIndex")}
            backgroundIndex={form.watch("backgroundIndex")}
            attributes={form.watch("attributes")}
            proficiencyBonus={form.watch("proficiencyBonus") || 2}
          />

          <RaceFeaturesSection raceIndex={form.watch("raceIndex")} />

          <ClassFeaturesSection
            classIndex={form.watch("classIndex")}
            level={form.watch("level") || 1}
            subclassIndex={form.watch("subclassIndex")}
          />

          <PlayerFormSpellcastingSection
            control={form.control}
            setValue={form.setValue}
            classIndex={form.watch("classIndex")}
            level={form.watch("level") || 1}
            attributes={form.watch("attributes")}
            proficiencyBonus={form.watch("proficiencyBonus") || 2}
          />

          <ClassResourceFormSection
            classIndex={form.watch("classIndex")}
            classData={classData}
            level={form.watch("level") || 1}
            control={form.control}
            setValue={form.setValue}
          />

          <PlayerFormInventorySection
            fields={fields}
            onAddItem={append}
            onRemoveItem={remove}
            itemSearchQuery={itemSearchQuery}
            setItemSearchQuery={setItemSearchQuery}
            selectedEquipmentIndex={selectedEquipmentIndex}
            setSelectedEquipmentIndex={setSelectedEquipmentIndex}
            isNewCharacter={!playableCharacter}
          />

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
