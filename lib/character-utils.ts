import type { Item, SpellSlots, PointPool, Attributes } from "@/lib/schemas";

import type {
  Class,
  Level,
  Feature as ApiFeature,
  Proficiency,
  Race,
  Background,
  Equipment,
} from "@/lib/generated/graphql";

export const attributeKeys: (keyof Attributes)[] = [
  "str",
  "dex",
  "con",
  "int",
  "wis",
  "cha",
];

/**
 * Extracts class-specific resources (Ki, Rages, etc.) from API Level data
 */

export function getLevelClassData(
  classIndex: string,
  levelData: {
    __typename?: "Level";
    level: number;
    prof_bonus?: number | null;
    features?: Array<{
      __typename?: "Feature";
      index: string;
      name: string;
      desc: Array<string>;
    }> | null;
    spellcasting?: {
      __typename?: "LevelSpellcasting";
      cantrips_known?: number | null;
      spells_known?: number | null;
      spell_slots_level_1: number;
      spell_slots_level_2: number;
      spell_slots_level_3: number;
      spell_slots_level_4: number;
      spell_slots_level_5: number;
      spell_slots_level_6?: number | null;
      spell_slots_level_7?: number | null;
      spell_slots_level_8?: number | null;
      spell_slots_level_9?: number | null;
    } | null;
    class_specific?: {
      __typename?: "ClassSpecific";
      action_surges?: number | null;
      arcane_recovery_levels?: number | null;
      aura_range?: number | null;
      bardic_inspiration_die?: number | null;
      brutal_critical_dice?: number | null;
      channel_divinity_charges?: number | null;
      destroy_undead_cr?: number | null;
      extra_attacks?: number | null;
      favored_enemies?: number | null;
      favored_terrain?: number | null;
      indomitable_uses?: number | null;
      invocations_known?: number | null;
      ki_points?: number | null;
      magical_secrets_max_5?: number | null;
      magical_secrets_max_7?: number | null;
      magical_secrets_max_9?: number | null;
      metamagic_known?: number | null;
      mystic_arcanum_level_6?: number | null;
      mystic_arcanum_level_7?: number | null;
      mystic_arcanum_level_8?: number | null;
      mystic_arcanum_level_9?: number | null;
      rage_count?: number | null;
      rage_damage_bonus?: number | null;
      song_of_rest_die?: number | null;
      sorcery_points?: number | null;
      unarmored_movement?: number | null;
      wild_shape_fly?: boolean | null;
      wild_shape_max_cr?: number | null;
      wild_shape_swim?: boolean | null;
      martial_arts?: {
        __typename?: "ClassSpecificMartialArt";
        dice_count: number;
        dice_value: number;
      } | null;
      sneak_attack?: {
        __typename?: "ClassSpecificSneakAttack";
        dice_count: number;
        dice_value: number;
      } | null;
      creating_spell_slots?: Array<{
        __typename?: "ClassSpecificCreatingSpellSlot";
        sorcery_point_cost: number;
        spell_slot_level: number;
      }> | null;
    } | null;
  }, // Changed from strict 'Level' to 'any' to match API response
): Record<string, any> {
  const result: Record<string, any> = {};

  if (!levelData?.class_specific) return result;

  const classSpecific = levelData.class_specific;

  // --- 1. RESOURCES (Point Pools) ---

  // Note: Using '!= null' checks for both null AND undefined
  if (classSpecific.sorcery_points != null) {
    result.sorceryPoints = {
      max: classSpecific.sorcery_points,
      current: classSpecific.sorcery_points,
    };
  }

  if (classSpecific.rage_count != null) {
    result.rages = {
      max: classSpecific.rage_count,
      current: classSpecific.rage_count,
    };
  }

  if (classSpecific.bardic_inspiration_die != null) {
    const uses = (levelData.level || 1) >= 5 ? 2 : 1;
    result.inspiration = { max: uses, current: uses };
  }

  if (classSpecific.channel_divinity_charges != null) {
    result.channelDivinityCharges = {
      max: classSpecific.channel_divinity_charges,
      current: classSpecific.channel_divinity_charges,
    };
  }

  if (classSpecific.ki_points != null) {
    result.kiPoints = {
      max: classSpecific.ki_points,
      current: classSpecific.ki_points,
    };
  }

  // --- 2. FEATURES (Scalars & Complex Objects) ---

  // ROGUE: Sneak Attack
  // API returns: { dice_count: 1, die_value: 6 }
  if (classIndex === "rogue" && classSpecific.sneak_attack != null) {
    result.sneakAttack = {
      count: classSpecific.sneak_attack.dice_count || 1,
      die: classSpecific.sneak_attack.dice_value || 6,
    };
  }

  // BARD: Inspiration Die Type
  if (classIndex === "bard" && classSpecific.bardic_inspiration_die != null) {
    result.inspirationDie = classSpecific.bardic_inspiration_die;
  }

  // MONK: Martial Arts Die (Optional)
  if (classIndex === "monk" && classSpecific.martial_arts != null) {
    result.martialArtsDie = {
      count: classSpecific.martial_arts.dice_count,
      die: classSpecific.martial_arts.dice_value,
    };
  }

  return result;
}

/**
 * Converts API spellcasting data into the app's SpellSlots format
 */
export function convertLevelSpellcasting(spellcasting: {
  __typename?: "LevelSpellcasting";
  cantrips_known?: number | null;
  spells_known?: number | null;
  spell_slots_level_1: number;
  spell_slots_level_2: number;
  spell_slots_level_3: number;
  spell_slots_level_4: number;
  spell_slots_level_5: number;
  spell_slots_level_6?: number | null;
  spell_slots_level_7?: number | null;
  spell_slots_level_8?: number | null;
  spell_slots_level_9?: number | null;
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

/**
 * Aggregates proficiencies from Race, Background, and Class
 */
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

/**
 * Removes undefined values to prevent Firebase errors
 */
export function sanitizeForFirebase(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForFirebase).filter((item) => item !== undefined);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }
    sanitized[key] = sanitizeForFirebase(value);
  }
  return sanitized;
}

/**
 * Converts API Equipment data into the app's Item Schema
 */
export function convertApiEquipmentToItem(
  equipment: Equipment,
  source?: "class" | "background" | "race" | "custom",
): Item {
  const base: Item = {
    index: equipment.index,
    name: equipment.name,
    cost: equipment.cost || { quantity: 0, unit: "gp" },
    desc: equipment.desc || [],
    weight: equipment.weight,
    equipment_category: equipment.equipment_category || null,
    gear_category: equipment.gear_category || null,
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

/**
 * Parses a damage dice string (e.g., "2d6") into count and type
 */
export function parseDamageDice(damageDice: string): {
  dice: number;
  number: number;
} {
  const match = damageDice.match(/^(\d+)d(\d+)$/i);
  if (!match) return { dice: 1, number: 6 };
  return { dice: parseInt(match[1], 10), number: parseInt(match[2], 10) };
}

/**
 * Formats count and type back into a dice string
 */
export function formatDamageDice(dice: number, number: number): string {
  return `${dice}d${number}`;
}
