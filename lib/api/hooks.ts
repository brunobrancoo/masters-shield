import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql/client";
import {
  GetMonstersDocument,
  GetMonsterDocument,
  GetRacesDocument,
  GetRaceDocument,
  GetEquipmentDocument,
  GetBackgroundsDocument,
  GetBackgroundDocument,
  Class,
  Level,
  Race,
  Background,
  Proficiency,
  Equipment,
  ClassDocument,
  ClassesDocument,
  SpellsDocument,
  SpellDocument,
} from "@/lib/generated/graphql";
import { PointPool, SpellSlots } from "@/lib/interfaces/interfaces";
import { filterMeaningfulItems } from "./utils";

export function useMonsters(name?: string) {
  return useQuery({
    queryKey: ["monsters", name],
    queryFn: async () => {
      const response = await graphqlClient.request(GetMonstersDocument, {
        name,
      });
      if (response.monsters) {
        return {
          ...response,
          monsters: filterMeaningfulItems(response.monsters),
        };
      }
      return response;
    },
  });
}

export function useMonster(index: string) {
  return useQuery({
    queryKey: ["monster", index],
    queryFn: async () => {
      return graphqlClient.request(GetMonsterDocument, { index });
    },
    enabled: !!index,
  });
}

export function useSpells() {
  return useQuery({
    queryKey: ["spells"],
    queryFn: async () => {
      const response = await graphqlClient.request(SpellsDocument);
      if (response.spells) {
        return {
          ...response,
          spells: filterMeaningfulItems(response.spells),
        };
      }
      return response;
    },
  });
}

export function useSpell(index: string) {
  return useQuery({
    queryKey: ["spell", index],
    queryFn: async () => {
      return graphqlClient.request(SpellDocument, { index });
    },
    enabled: !!index,
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await graphqlClient.request(ClassesDocument);
      if (response.classes) {
        return {
          ...response,
          classes: filterMeaningfulItems(response.classes),
        };
      }
      return response;
    },
  });
}

export function useClass(index: string) {
  return useQuery({
    queryKey: ["class", index],
    queryFn: async () => {
      return graphqlClient.request(ClassDocument, { index });
    },
    enabled: !!index,
  });
}

export function useRaces() {
  return useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const response = await graphqlClient.request(GetRacesDocument);
      if (response.races) {
        return {
          ...response,
          races: filterMeaningfulItems(response.races),
        };
      }
      console.log("races Data: ", response.races);
      return response;
    },
  });
}

export function useRace(index: string) {
  return useQuery({
    queryKey: ["race", index],
    queryFn: async () => {
      return graphqlClient.request(GetRaceDocument, { index });
    },
    enabled: !!index,
  }) as { data: any };
}

export function useBackground(index: string) {
  return useQuery({
    queryKey: ["background", index],
    queryFn: async () => {
      return graphqlClient.request(GetBackgroundDocument, { index });
    },
    enabled: !!index,
  });
}

export function useEquipment(name?: string) {
  return useQuery({
    queryKey: ["equipment", name],
    queryFn: async () => {
      const response = await graphqlClient.request(GetEquipmentDocument, {
        name,
      });
      if (response.equipments) {
        return {
          ...response,
          equipments: filterMeaningfulItems(response.equipments),
        };
      }
      return response;
    },
  });
}

export function useBackgrounds() {
  return useQuery({
    queryKey: ["backgrounds"],
    queryFn: async () => {
      const response = await graphqlClient.request(GetBackgroundsDocument);
      if (response.backgrounds) {
        return {
          ...response,
          backgrounds: filterMeaningfulItems(response.backgrounds),
        };
      }
      return response;
    },
  });
}

export function getClassResources(
  classIndex: string,
  levelData?: Level,
): {
  sorceryPoints?: PointPool;
  kiPoints?: PointPool;
  rages?: PointPool;
  rageDamageBonus?: number;
  inspiration?: PointPool;
  channelDivinityCharges?: PointPool;
  invocationsKnown?: number;
} {
  const resources: any = {};

  if (!levelData?.class_specific) return resources;

  const classSpecific = levelData.class_specific;

  if (classSpecific.sorcery_points !== undefined) {
    resources.sorceryPoints = { max: classSpecific.sorcery_points };
  }

  if (classSpecific.rage_count !== undefined) {
    resources.rages = { max: classSpecific.rage_count };
    if (classSpecific.rage_damage_bonus !== undefined) {
      resources.rageDamageBonus = classSpecific.rage_damage_bonus;
    }
  }

  if (classSpecific.bardic_inspiration_die !== undefined) {
    resources.inspiration = { max: 1 };
  }

  if (classSpecific.channel_divinity_charges !== undefined) {
    resources.channelDivinityCharges = {
      max: classSpecific.channel_divinity_charges,
    };
  }

  if (classSpecific.ki_points !== undefined) {
    resources.kiPoints = { max: classSpecific.ki_points };
  }

  if (classSpecific.invocations_known !== undefined) {
    resources.invocationsKnown = classSpecific.invocations_known;
  }

  return resources;
}

export function convertLevelSpellcasting(spellcasting?: {
  spell_slots_level_1: number;
  spell_slots_level_2: number;
  spell_slots_level_3: number;
  spell_slots_level_4: number;
  spell_slots_level_5: number;
  spell_slots_level_6?: number;
  spell_slots_level_7?: number;
  spell_slots_level_8?: number;
  spell_slots_level_9?: number;
}): SpellSlots {
  if (!spellcasting) {
    return {
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
  }

  return {
    1: {
      current: spellcasting.spell_slots_level_1,
      max: spellcasting.spell_slots_level_1,
    },
    2: {
      current: spellcasting.spell_slots_level_2,
      max: spellcasting.spell_slots_level_2,
    },
    3: {
      current: spellcasting.spell_slots_level_3,
      max: spellcasting.spell_slots_level_3,
    },
    4: {
      current: spellcasting.spell_slots_level_4,
      max: spellcasting.spell_slots_level_4,
    },
    5: {
      current: spellcasting.spell_slots_level_5,
      max: spellcasting.spell_slots_level_5,
    },
    6: {
      current: spellcasting.spell_slots_level_6 ?? 0,
      max: spellcasting.spell_slots_level_6 ?? 0,
    },
    7: {
      current: spellcasting.spell_slots_level_7 ?? 0,
      max: spellcasting.spell_slots_level_7 ?? 0,
    },
    8: {
      current: spellcasting.spell_slots_level_8 ?? 0,
      max: spellcasting.spell_slots_level_8 ?? 0,
    },
    9: {
      current: spellcasting.spell_slots_level_9 ?? 0,
      max: spellcasting.spell_slots_level_9 ?? 0,
    },
  };
}

export function getAllProficiencies(
  raceData?: Race,
  backgroundData?: Background,
  classData?: Class,
): { proficiency: Proficiency; sources: string[] }[] {
  const proficiencyMap = new Map<
    string,
    { proficiency: Proficiency; sources: string[] }
  >();

  raceData?.traits?.forEach((trait) => {
    trait.proficiencies?.forEach((p) => {
      const existing = proficiencyMap.get(p.index);
      if (existing) {
        existing.sources.push("race trait");
      } else {
        proficiencyMap.set(p.index, {
          proficiency: p,
          sources: ["race trait"],
        });
      }
    });
  });

  backgroundData?.starting_proficiencies?.forEach((p) => {
    const existing = proficiencyMap.get(p.index);
    if (existing) {
      existing.sources.push("background");
    } else {
      proficiencyMap.set(p.index, { proficiency: p, sources: ["background"] });
    }
  });

  classData?.proficiencies?.forEach((p) => {
    const existing = proficiencyMap.get(p.index);
    if (existing) {
      existing.sources.push("class");
    } else {
      proficiencyMap.set(p.index, { proficiency: p, sources: ["class"] });
    }
  });

  return Array.from(proficiencyMap.values());
}

export function convertApiEquipmentToItem(
  equipment: Equipment,
  source?: "class" | "background" | "race",
) {
  const base: any = {
    index: equipment.index,
    name: equipment.name,
    cost: equipment.cost,
    desc: equipment.desc || [],
    weight: equipment.weight ?? undefined,
    equipment_category: equipment.equipment_category,
    gear_category: equipment.gear_category ?? undefined,
    type: equipment.equipment_category?.name || "item",
    magic: false,
    attackbonus: 0,
    defensebonus: 0,
    notes: equipment.desc?.join("\n") || "",
    equipped: false,
    source,
  };

  if ("weapon_category" in equipment) {
    const weapon = equipment as any;
    Object.assign(base, {
      weapon_category: weapon.weapon_category,
      weapon_range: weapon.weapon_range,
      category_range: weapon.category_range,
      damage: weapon.damage
        ? {
            damage_type: weapon.damage.damage_type,
            damage_dice: weapon.damage.damage_dice,
          }
        : undefined,
      range: weapon.range,
      properties: weapon.properties,
    });
  }

  if ("armor_category" in equipment) {
    const armor = equipment as any;
    Object.assign(base, {
      armor_category: armor.armor_category,
      armor_class: armor.armor_class,
      str_minimum: armor.str_minimum,
      stealth_disadvantage: armor.stealth_disadvantage,
      properties: armor.properties,
    });
  }

  return base;
}

function mapApiSpellToInterface(spell: any): Spell {
  return {
    index: spell.index || "",
    name: spell.name || "",
    level: spell.level || 0,
    school: spell.school?.name || "",
    castingTime: spell.casting_time || "",
    duration: spell.duration || "",
    range: spell.range || "",
    components: spell.components?.join(", ") || "",
    description: spell.desc || [],
    concentration: spell.concentration || false,
    ritual: spell.ritual || false,
    attackType: spell.attack_type || undefined,
    damage: spell.damage
      ? {
          damageType: spell.damage.damage_type?.name || undefined,
          damageAtSlotLevel:
            spell.damage.damage_at_slot_level?.map(
              (v: any) => `${v.level}: ${v.value}`,
            ) || [],
        }
      : undefined,
    dc: spell.dc
      ? {
          dcType: spell.dc.dc_type?.index || undefined,
          dcSuccess: spell.dc.dc_success || undefined,
        }
      : undefined,
    areaOfEffect: spell.area_of_effect
      ? {
          size: spell.area_of_effect.size || undefined,
          type: spell.area_of_effect.type || undefined,
        }
      : undefined,
    higherLevel: spell.higher_level || [],
    material: spell.material || undefined,
    healAtSlotLevel:
      spell.heal_at_slot_level?.map((v: any) => `${v.level}: ${v.value}`) || [],
  };
}

export { mapApiSpellToInterface };
export {
  isEmptyObject,
  filterEmptyObjects,
  isMeaningfulItem,
  filterMeaningfulItems,
  sanitizeApiResponse,
} from "./utils";
