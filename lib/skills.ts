// D&D 5e Skills mapped to their ability scores
export const SKILLS = {
  acrobatics: { name: "Acrobatics", attribute: "dex" },
  animalHandling: { name: "Animal Handling", attribute: "wis" },
  arcana: { name: "Arcana", attribute: "int" },
  athletics: { name: "Athletics", attribute: "str" },
  deception: { name: "Deception", attribute: "cha" },
  history: { name: "History", attribute: "int" },
  insight: { name: "Insight", attribute: "wis" },
  intimidation: { name: "Intimidation", attribute: "cha" },
  investigation: { name: "Investigation", attribute: "int" },
  nature: { name: "Nature", attribute: "int" },
  perception: { name: "Perception", attribute: "wis" },
  performance: { name: "Performance", attribute: "cha" },
  persuasion: { name: "Persuasion", attribute: "cha" },
  religion: { name: "Religion", attribute: "int" },
  sleightOfHand: { name: "Sleight of Hand", attribute: "dex" },
  stealth: { name: "Stealh", attribute: "dex" },
  survival: { name: "Survival", attribute: "wis" },
} as const;

export type SkillKey = keyof typeof SKILLS;

// Group skills by attribute
export const SKILLS_BY_ATTRIBUTE = {
  for: ["athletics"] as SkillKey[],
  des: ["acrobatics", "sleightOfHand", "stealth"] as SkillKey[],
  con: [] as SkillKey[],
  int: [
    "arcana",
    "history",
    "investigation",
    "nature",
    "religion",
  ] as SkillKey[],
  sab: ["animalHandling", "insight", "perception", "survival"] as SkillKey[],
  car: ["deception", "intimidation", "performance", "persuasion"] as SkillKey[],
};

// Class skill proficiencies (indices from API)
export const CLASS_SKILL_PROFICIENCIES: Record<string, string[]> = {
  barbarian: [
    "animalHandling",
    "athletics",
    "intimidation",
    "nature",
    "perception",
    "survival",
  ],
  bard: Object.keys(SKILLS), // Bard can choose any 3
  cleric: ["history", "insight", "persuasion", "religion"],
  druid: [
    "arcana",
    "animalHandling",
    "insight",
    "nature",
    "perception",
    "religion",
    "survival",
  ],
  fighter: [
    "acrobatics",
    "animalHandling",
    "athletics",
    "history",
    "insight",
    "intimidation",
    "perception",
    "survival",
  ],
  monk: [
    "acrobatics",
    "athletics",
    "history",
    "insight",
    "religion",
    "stealth",
  ],
  paladin: ["athletics", "insight", "intimidation", "persuasion", "religion"],
  ranger: [
    "animalHandling",
    "athletics",
    "insight",
    "investigation",
    "nature",
    "perception",
    "stealth",
    "survival",
  ],
  rogue: [
    "acrobatics",
    "athletics",
    "deception",
    "insight",
    "intimidation",
    "investigation",
    "perception",
    "performance",
    "persuasion",
    "sleightOfHand",
    "stealth",
  ],
  sorcerer: [
    "arcana",
    "deception",
    "insight",
    "intimidation",
    "persuasion",
    "religion",
  ],
  warlock: [
    "arcana",
    "deception",
    "history",
    "intimidation",
    "investigation",
    "nature",
    "religion",
  ],
  wizard: ["arcana", "history", "insight", "investigation", "religion"],
};

// Background skill proficiencies
export const BACKGROUND_SKILL_PROFICIENCIES: Record<string, string[]> = {
  acolyte: ["insight", "religion"],
  charlatan: ["deception", "sleightOfHand"],
  criminal: ["deception", "stealth"],
  entertainer: ["acrobatics", "performance"],
  folkHero: ["animalHandling", "survival"],
  guildArtisan: ["insight", "persuasion"],
  hermit: ["nature", "religion"],
  noble: ["history", "persuasion"],
  outlander: ["athletics", "survival"],
  sage: ["arcana", "history"],
  sailor: ["athletics", "perception"],
  soldier: ["athletics", "intimidation"],
  urchin: ["sleightOfHand", "stealth"],
};

// Attribute names in Portuguese
export const ATTRIBUTE_NAMES: Record<string, string> = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};

// Calculate modifier from attribute value
export const calculateModifier = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

// Format modifier with + sign
export const formatModifier = (mod: number): string => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// Get proficiency bonus by level
export const getProficiencyBonus = (level: number): number => {
  return Math.floor((level - 1) / 4) + 2;
};

// Spellcasting ability by class
export const SPELLCASTING_ABILITY: Record<
  string,
  keyof typeof ATTRIBUTE_NAMES
> = {
  bard: "car",
  cleric: "sab",
  druid: "sab",
  paladin: "sab",
  ranger: "sab",
  sorcerer: "car",
  warlock: "car",
  wizard: "int",
};

// Calculate spell save DC
export const calculateSpellDC = (
  level: number,
  spellcastingAbility: keyof typeof ATTRIBUTE_NAMES,
  attributes: {
    for: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
  },
): number => {
  const proficiency = getProficiencyBonus(level);
  const abilityMod = calculateModifier(
    attributes[spellcastingAbility as keyof typeof attributes],
  );
  return 8 + proficiency + abilityMod;
};

// Calculate spell attack bonus
export const calculateSpellAttack = (
  level: number,
  spellcastingAbility: keyof typeof ATTRIBUTE_NAMES,
  attributes: {
    for: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
  },
): number => {
  const proficiency = getProficiencyBonus(level);
  const abilityMod = calculateModifier(
    attributes[spellcastingAbility as keyof typeof attributes],
  );
  return proficiency + abilityMod;
};

// Get spell slots by class and level (simplified table) / TODO: dump and use api's one.
export const getSpellSlots = (
  classIndex: string,
  level: number,
): Record<number, number> => {
  const fullCasters = ["bard", "cleric", "druid", "sorcerer", "wizard"];
  const halfCasters = ["paladin", "ranger"];
  const warlocks = ["warlock"];

  if (fullCasters.includes(classIndex)) {
    return getFullCasterSlots(level);
  } else if (halfCasters.includes(classIndex)) {
    return getHalfCasterSlots(level);
  } else if (warlocks.includes(classIndex)) {
    return getWarlockSlots(level);
  }

  return {};
};

const getFullCasterSlots = (level: number): Record<number, number> => {
  const slots: Record<number, number[]> = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  };

  const levelSlots = slots[level] || slots[1];
  return {
    1: levelSlots[0],
    2: levelSlots[1],
    3: levelSlots[2],
    4: levelSlots[3],
    5: levelSlots[4],
    6: levelSlots[5],
    7: levelSlots[6],
    8: levelSlots[7],
    9: levelSlots[8],
  };
};

const getHalfCasterSlots = (level: number): Record<number, number> => {
  const slots: Record<number, number[]> = {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  };

  const levelSlots = slots[level] || slots[2];
  return {
    1: levelSlots[0],
    2: levelSlots[1],
    3: levelSlots[2],
    4: levelSlots[3],
    5: levelSlots[4],
    6: levelSlots[5],
    7: levelSlots[6],
    8: levelSlots[7],
    9: levelSlots[8],
  };
};

const getWarlockSlots = (level: number): Record<number, number> => {
  const slots: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 2,
    10: 2,
    11: 3,
    12: 3,
    13: 3,
    14: 3,
    15: 3,
    16: 3,
    17: 4,
    18: 4,
    19: 4,
    20: 4,
  };

  const slotLevel = level >= 9 ? 5 : Math.ceil(level / 2);
  const slotCount = slots[level] || 1;

  const result: Record<number, number> = {};
  for (let i = 1; i <= slotLevel; i++) {
    result[i] = i === slotLevel ? slotCount : 0;
  }
  return result;
};
