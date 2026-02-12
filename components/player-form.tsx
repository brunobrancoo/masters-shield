"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Player } from "@/lib/interfaces/interfaces";
import { useForm, useFieldArray } from "react-hook-form";
import { playerSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import PlayerFormBasicInfoSection from "./player-form-basic-info-section";
import PlayerFormHealthSection from "./player-form-health-section";
import PlayerFormCombatStatsSection from "./player-form-combat-stats-section";
import PlayerFormSpellcastingSection from "./player-form-spellcasting-section";
import PlayerFormAttributesSection from "./player-form-attributes-section";
import PlayerFormInventorySection from "./player-form-inventory-section";
import PlayerFormNotesSection from "./player-form-notes-section";
import PlayerFormSkillsSection from "./player-form-skills-section";

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

export default function PlayerForm({
  player,
  onSaveAction,
  onCancelAction,
  hideActions = false,
}: PlayerFormProps) {
  const [itemSearchQuery, setItemSearchQuery] = useState("");
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory",
  });

  useEffect(() => {
    if (player) {
      reset(player);
    }
  }, [player, reset]);

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

  return (
    <form id="player-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <PlayerFormBasicInfoSection register={register} errors={errors} />

        <PlayerFormHealthSection register={register} errors={errors} />

        <PlayerFormCombatStatsSection register={register} />

        <PlayerFormSpellcastingSection register={register} />

        <PlayerFormAttributesSection
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <PlayerFormInventorySection
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
          itemSearchQuery={itemSearchQuery}
          setItemSearchQuery={setItemSearchQuery}
          setSelectedEquipmentIndex={setSelectedEquipmentIndex}
          selectedEquipmentIndex={selectedEquipmentIndex}
          fields={fields}
        />

        <PlayerFormNotesSection register={register} />

        <PlayerFormSkillsSection
          control={control}
          skillFields={skillFields}
          featureFields={featureFields}
          buffFields={buffFields}
          debuffFields={debuffFields}
          appendSkill={appendSkill}
          removeSkill={removeSkill}
          appendFeature={appendFeature}
          removeFeature={removeFeature}
          appendBuff={appendBuff}
          removeBuff={removeBuff}
          appendDebuff={appendDebuff}
          removeDebuff={removeDebuff}
        />

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
