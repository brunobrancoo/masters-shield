import type { Monster } from "@/lib/schemas";
import type { GetMonsterQuery } from "@/lib/generated/graphql";

export function mapGraphQLMonsterToMonster(
  apiMonster: GetMonsterQuery["monster"] | undefined | null,
): Monster {
  if (!apiMonster) {
    throw new Error("No monster data provided");
  }

  const monster: Monster = {
    id: undefined,
    index: apiMonster.index || "",
    name: apiMonster.name || "Unknown",
    type: mapMonsterType(apiMonster.type),
    subtype: apiMonster.subtype ?? undefined,
    size: mapMonsterSize(apiMonster.size),
    alignment: apiMonster.alignment || undefined,
    image: apiMonster.image || undefined,
    languages: apiMonster.languages || undefined,
    forms: undefined,

    challenge_rating: apiMonster.challenge_rating || 0,
    xp: apiMonster.xp || 0,

    attributes: {
      str: apiMonster.strength || 10,
      dex: apiMonster.dexterity || 10,
      con: apiMonster.constitution || 10,
      int: apiMonster.intelligence || 10,
      wis: apiMonster.wisdom || 10,
      cha: apiMonster.charisma || 10,
    },

    hp: apiMonster.hit_points || 0,
    maxHp: apiMonster.hit_points || 0,
    tempHp: 0,
    hit_dice: apiMonster.hit_dice || "",
    hit_points_roll: apiMonster.hit_points_roll || "",

    armor_class: mapArmorClass(apiMonster.armor_class),

    speed: {
      walk: apiMonster.speed?.walk ?? undefined,
      fly: apiMonster.speed?.fly ?? undefined,
      swim: apiMonster.speed?.swim ?? undefined,
      burrow: apiMonster.speed?.burrow ?? undefined,
      climb: apiMonster.speed?.climb ?? undefined,
      hover: apiMonster.speed?.hover ?? undefined,
    },

    senses: {
      blindsight: apiMonster.senses?.blindsight ?? undefined,
      darkvision: apiMonster.senses?.darkvision ?? undefined,
      passive_perception: apiMonster.senses?.passive_perception || 10,
      tremorsense: apiMonster.senses?.tremorsense ?? undefined,
      truesight: apiMonster.senses?.truesight ?? undefined,
    },

    proficiencies:
      apiMonster.proficiencies?.map((p: any) => ({
        proficiency: { name: p?.proficiency?.name || "" },
        value: p?.value || 0,
      })) || [],

    damage_immunities: apiMonster.damage_immunities || [],
    damage_resistances: apiMonster.damage_resistances || [],
    damage_vulnerabilities: apiMonster.damage_vulnerabilities || [],
    condition_immunities:
      apiMonster.condition_immunities?.map((c: any) => ({
        index: c?.index || "",
        name: c?.name || "",
      })) || [],

    actions: mapActions(apiMonster.actions),
    reactions: mapReactions(apiMonster.reactions),
    special_abilities: mapSpecialAbilities(apiMonster.special_abilities),
    legendary_actions: mapLegendaryActions(apiMonster.legendary_actions),
    legendary_actions_pool: undefined,
    legendary_resistances: undefined,
    spellSlots: undefined,

    abilityUses: [],
    status: "alive",
    conditions: [],
    concentration: undefined,
    modifiers: [],

    isHomebrew: false,
  };

  return monster;
}

function mapMonsterSize(size: string): string {
  const sizeMap: Record<string, string> = {
    tiny: "Tiny",
    small: "Small",
    medium: "Medium",
    large: "Large",
    huge: "Huge",
    gargantuan: "Gargantuan",
  };
  return sizeMap[size.toLowerCase()] || "Medium";
}

function mapMonsterType(type: string): string {
  const typeMap: Record<string, string> = {
    aberration: "Aberration",
    beast: "Beast",
    celestial: "Celestial",
    construct: "Construct",
    dragon: "Dragon",
    elemental: "Elemental",
    fey: "Fey",
    fiend: "Fiend",
    giant: "Giant",
    humanoid: "Humanoid",
    monstrosity: "Monstrosity",
    ooze: "Ooze",
    plant: "Plant",
    undead: "Undead",
  };
  return typeMap[type.toLowerCase()] || type;
}

function mapArmorClass(apiAC: any) {
  if (!apiAC) return [];

  return apiAC.map((ac: any) => {
    if (!ac) return { type: "natural", value: 10 };

    const type = ac.type as
      | "armor"
      | "condition"
      | "dex"
      | "natural"
      | "spell";
      
    if (type === "armor") {
      return {
        type: "armor" as const,
        value: ac.value || 10,
        armor: [],
      };
    }
    if (type === "condition") {
      return {
        type: "condition" as const,
        value: ac.value || 10,
        condition: { name: "condition" },
      };
    }
    if (type === "spell") {
      return {
        type: "spell" as const,
        value: ac.value || 10,
        spell: { name: "spell", level: 0 },
      };
    }
    
    return {
      type,
      value: ac.value || 10,
    };
  });
}

function mapActions(apiActions: any) {
  if (!apiActions) return [];

  return apiActions.map((action: any) => {
    if (!action) return { name: "", desc: "" };

    const damage = action.damage?.map((d: any) => {
      if (!d || d.__typename === "DamageChoice") return null;
      return {
        damage_dice: d.damage_dice || "",
        damage_type: {
          index: d.damage_type?.index || "",
          name: d.damage_type?.name || "",
        },
      };
    }).filter(Boolean) || [];

    return {
      name: action.name || "",
      desc: action.desc || "",
      attack_bonus: action.attack_bonus ?? undefined,
      multiattack_type: action.multiattack_type ?? undefined,
      damage,
      action_options: action.action_options
        ? {
            type: action.action_options.type || "",
            desc: action.action_options.desc || "",
          }
        : undefined,
      options: action.options
        ? { desc: action.options.desc || "" }
        : undefined,
    };
  });
}

function mapReactions(apiReactions: any) {
  if (!apiReactions) return [];

  return apiReactions.map((reaction: any) => {
    if (!reaction) return { name: "", desc: "" };

    return {
      name: reaction.name || "",
      desc: reaction.desc || "",
      dc: reaction.dc
        ? {
            dc_value: reaction.dc.dc_value || 0,
            success_type: reaction.dc.success_type || "",
            dc_type: reaction.dc.dc_type
              ? { name: reaction.dc.dc_type.name || "" }
              : undefined,
          }
        : undefined,
    };
  });
}

function mapSpecialAbilities(apiAbilities: any) {
  if (!apiAbilities) return [];

  return apiAbilities.map((ability: any) => {
    if (!ability) return { name: "", desc: "" };

    const damage = ability.damage?.map((d: any) => {
      if (!d) return null;
      return {
        damage_dice: d.damage_dice || "",
        damage_type: {
          index: d.damage_type?.index || "",
          name: d.damage_type?.name || "",
        },
      };
    }).filter(Boolean) || [];

    return {
      name: ability.name || "",
      desc: ability.desc || "",
      attack_bonus: ability.attack_bonus ?? undefined,
      damage,
      dc: ability.dc
        ? {
            dc_value: ability.dc.dc_value || 0,
            success_type: ability.dc.success_type || "",
            dc_type: ability.dc.dc_type
              ? { name: ability.dc.dc_type.name || "" }
              : undefined,
          }
        : undefined,
      spellcasting: undefined,
      usage: ability.usage
        ? {
            type: ability.usage.type || "",
            times: ability.usage.times ?? undefined,
            rest_types: ability.usage.rest_types ?? undefined,
          }
        : undefined,
    };
  });
}

function mapLegendaryActions(apiLegendaryActions: any) {
  if (!apiLegendaryActions) return [];

  return apiLegendaryActions.map((action: any) => {
    if (!action) return { name: "", desc: "" };

    const damage = action.damage?.map((d: any) => {
      if (!d) return null;
      return {
        damage_dice: d.damage_dice || "",
        damage_type: {
          index: d.damage_type?.index || "",
          name: d.damage_type?.name || "",
        },
      };
    }).filter(Boolean) || [];

    return {
      name: action.name || "",
      desc: action.desc || "",
      attack_bonus: action.attack_bonus ?? undefined,
      damage,
      dc: action.dc
        ? {
            dc_value: action.dc.dc_value || 0,
            success_type: action.dc.success_type || "",
            dc_type: action.dc.dc_type
              ? { name: action.dc.dc_type.name || "" }
              : undefined,
          }
        : undefined,
    };
  });
}
