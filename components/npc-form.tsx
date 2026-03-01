"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayableCharacter } from "@/lib/schemas";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useClass } from "@/lib/api/hooks";
import { playableCharacterSchema } from "@/lib/schemas";
import { Plus } from "lucide-react";
import { convertApiEquipmentToItem } from "@/lib/character-utils";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle } from "lucide-react";

interface NPCFormProps {
  playableCharacter?: PlayableCharacter;
  onSaveAction: (playableCharacter: PlayableCharacter) => void;
  onCancelAction: () => void;
}

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

export default function NPCForm({
  playableCharacter,
  onSaveAction,
  onCancelAction,
}: NPCFormProps) {
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
          id: undefined,
          name: "",
          raceIndex: "",
          raceName: "",
          classIndex: "fighter",
          className: "",
          hitDie: 10,
          level: 1,
          languages: [],
          attributes: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
          },
          hp: 10,
          maxHp: 10,
          ac: 10,
          speed: 30,
          initiativeBonus: 0,
          profBonus: 2,
          selectedProficiencies: [],
          chosenRaceFeatures: [],
          skills: [],
          classProficiencies: [],
          passivePerception: 10,
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
          spellCD: 8,
          spellAttack: 0,
          spellsKnown: [],
          preparedSpells: [],
          spellList: [],
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

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.error("VALIDATION ERROR:", form.formState.errors);
    }
  }, [form.formState.errors]);

  useEffect(() => {
    if (isEditing) return;
    const newClassIndex = watchedClassIndex;

    if (
      previousClassIndex &&
      newClassIndex &&
      previousClassIndex !== newClassIndex
    ) {
      const oldFields = CLASS_RESOURCES[previousClassIndex];
      const newFields = CLASS_RESOURCES[newClassIndex];

      const oldFieldsToDrop = oldFields.filter(
        (oldField) => !newFields.includes(oldField),
      );
      if (oldFieldsToDrop) {
        oldFieldsToDrop.forEach((fieldName) => {
          form.unregister(fieldName as any, { keepDefaultValue: false });
        });
      }
    }

    setPreviousClassIndex(newClassIndex!);
  }, [watchedClassIndex, form, previousClassIndex]);

  const errors = form.formState.errors;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form id="npc-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FormProvider {...form}>
        <div className="space-y-6">
          {hasErrors && (
            <Card className="border-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  Erro de Validação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Por favor, corrija os seguintes erros:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="text-red-600">
                      <strong>{field}:</strong>{" "}
                      {typeof error === "object" && "message" in error
                        ? error.message
                        : "Campo inválido"}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

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

          <PlayerFormNotesSection control={form.control} />

          <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
            <Button type="button" variant="outline" onClick={onCancelAction}>
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-arcane-500 hover:bg-arcane-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {playableCharacter ? "Salvar NPC" : "Criar NPC"}
            </Button>
          </div>
        </div>
      </FormProvider>
    </form>
  );
}
