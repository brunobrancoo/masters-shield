import type {
  Class, Level, Feature as ApiFeature, Proficiency, Race, Background,
  Equipment, AbilityScore, Spellcasting, ClassSpecific
} from '@/lib/generated/graphql';

export interface Attributes {
  for: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export const attributeKeys: (keyof Attributes)[] = [
  "for",
  "des",
  "con",
  "int",
  "sab",
  "car",
];

export interface Monster {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  skills: string[];
  notes: string;
  items: Item[];
}

export interface Spell {
  index: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  duration: string;
  range: string;
  components: string;
  description: string[];
  damage?: {
    damageType?: string;
    damageAtSlotLevel?: string[];
  };
  dc?: {
    dcType?: string;
    dcSuccess?: string;
  };
  areaOfEffect?: {
    size?: number;
    type?: string;
  };
  concentration: boolean;
  ritual: boolean;
  higherLevel?: string[];
  attackType?: string;
  material?: string;
}

export interface PointPool {
  current: number;
  max: number;
}

export interface SpellSlots {
  1: { current: number; max: number };
  2: { current: number; max: number };
  3: { current: number; max: number };
  4: { current: number; max: number };
  5: { current: number; max: number };
  6: { current: number; max: number };
  7: { current: number; max: number };
  8: { current: number; max: number };
  9: { current: number; max: number };
}

export interface SorcererResources {
  sorceryPoints?: PointPool;
}

export interface MonkResources {
  kiPoints?: PointPool;
}

export interface BarbarianResources {
  rages?: PointPool;
  rageDamageBonus?: number;
}

export interface BardResources {
  inspiration?: PointPool;
}

export interface PaladinResources {
  channelDivinityCharges?: PointPool;
}

export interface WarlockResources {
  invocationsKnown?: number;
}

export interface Skill {
  name: string;
  description: string;
  savingThrowAttribute: keyof Attributes;
}

export interface Feature {
  index: string;
  name: string;
  description: string[];
  uses?: number;
  source: string;
  level?: number;
  prerequisites?: any[];
}

export interface Buff {
  name: string;
  duration?: string;
  description: string;
  source: string;
  affects: BuffEffect;
}

export interface BuffEffect {
  effect: string;
  amount: number;
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  skills: string[];
  personality: string;
  notes: string;
  items: Item[];
}

export interface GameData {
  monsters: Monster[];
  playableCharacters: PlayableCharacter[];
  npcs: NPC[];
}

export interface Item {
  index: string;
  name: string;
  cost: { quantity: number; unit: string };
  desc: string[];
  weight?: number;
  equipment_category: { index: string; name: string } | null;
  gear_category?: { index: string; name: string } | null;

  weapon_category?: string;
  weapon_range?: string;
  category_range?: string;
  damage?: {
    damage_type?: { index: string; name: string };
    damage_dice: string;
  };
  range?: { normal: number; long?: number };
  properties?: any[];

  // Legacy fields for backward compatibility
  price?: number;
  distance?: "melee" | "ranged" | string;
  damageLegacy?: {
    dice: number;
    number: number;
    type: string;
  };

  armor_category?: string;
  armor_class?: { base: number; dex_bonus: boolean; max_bonus?: number };
  str_minimum?: number;
  stealth_disadvantage?: boolean;

  type: string;
  magic: boolean;
  attackbonus: number;
  defensebonus: number;
  notes: string;
  equipped: boolean;
  source?: 'class' | 'background' | 'race' | 'custom';
}

export interface InitiativeEntry {
  id: string;
  name: string;
  initiative: number;
  dexMod: number;
  hp: number;
  maxHp: number;
  type: "monster" | "playableCharacter" | "npc" | "custom";
  sourceId?: string;
}

export interface Homebrew {
  id: string;
  name: string;
  itemType: "item" | "spell" | "feat" | "feature";
  item?: Item;
  spell?: Spell;
  feat?: {
    index: string;
    name: string;
    desc: string[];
    prerequisites: string[];
  };
  feature?: {
    index: string;
    name: string;
    desc: string[];
    level: number;
    source: string;
    class?: string;
    subclass?: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Base interface for all playable character types
 * Contains common fields shared across all D&D 5e classes
 */
export interface BasePlayableCharacter {
  id: string;
  name: string;

  raceIndex: string;
  raceName: string;
  raceData?: Race;

  classIndex: string;
  className: string;
  classData?: Class;
  level: number;
  levelData?: Level;

  subclassIndex?: string;
  subclassName?: string;

  backgroundIndex?: string;
  backgroundName?: string;
  backgroundData?: Background;

  raceTraits: string[];
  backgroundFeature?: string;
  classFeatures: string[];
  customFeatures: Feature[];
  featFeatures: Feature[];

  selectedProficiencies: string[];
  raceProficiencies: string[];
  backgroundProficiencies: string[];
  classProficiencies: string[];

  classEquipment: ClassEquipmentSelection[];
  backgroundEquipment: EquipmentSelection[];

  hp: number;
  maxHp: number;
  attributes: Attributes;
  inventory: Item[];
  notes: string;
  ac: number;
  speed: number;
  initiativeBonus: number;
  passivePerception: number;
  proficiencyBonus: number;
  profBonus?: number;
  abilityScoreImprovementsUsed?: number;
  skills?: string[];

  spellSlots?: SpellSlots;
  spellsKnown?: string[];
  spellAttack?: number;
  spellCD?: number;

  // Legacy fields for backward compatibility
  spells?: Spell[];
  maxSpellSlots?: SpellSlots;
  sorceryPointsLegacy?: number;
  maxSorceryPoints?: number;

  // Buffs and debuffs are common to all characters
  buffs: Buff[];
  debuffs: Buff[];
}

/**
 * Sorcerer-specific character with sorcery points
 */
export interface SorcererCharacter extends BasePlayableCharacter {
  classIndex: "sorcerer";
  sorceryPoints?: SorcererResources;
}

/**
 * Paladin-specific character with channel divinity charges
 */
export interface PaladinCharacter extends BasePlayableCharacter {
  classIndex: "paladin";
  channelDivinityCharges?: PaladinResources;
}

/**
 * Monk-specific character with ki points
 */
export interface MonkCharacter extends BasePlayableCharacter {
  classIndex: "monk";
  kiPoints?: MonkResources;
}

/**
 * Barbarian-specific character with rages
 */
export interface BarbarianCharacter extends BasePlayableCharacter {
  classIndex: "barbarian";
  rages?: BarbarianResources;
}

/**
 * Bard-specific character with inspiration
 */
export interface BardCharacter extends BasePlayableCharacter {
  classIndex: "bard";
  inspiration?: BardResources;
}

/**
 * Druid-specific character with wild shape
 */
export interface DruidCharacter extends BasePlayableCharacter {
  classIndex: "druid";
  wildShapeForm?: string;
}

/**
 * Warlock-specific character with invocations
 */
export interface WarlockCharacter extends BasePlayableCharacter {
  classIndex: "warlock";
  invocationsKnown?: WarlockResources;
}

/**
 * Rogue character - no class-specific resources
 */
export interface RogueCharacter extends BasePlayableCharacter {
  classIndex: "rogue";
}

/**
 * Fighter character - no class-specific resources
 */
export interface FighterCharacter extends BasePlayableCharacter {
  classIndex: "fighter";
}

/**
 * Ranger character - no class-specific resources
 */
export interface RangerCharacter extends BasePlayableCharacter {
  classIndex: "ranger";
}

/**
 * Cleric character - no class-specific resources
 */
export interface ClericCharacter extends BasePlayableCharacter {
  classIndex: "cleric";
}

/**
 * Wizard character - no class-specific resources
 */
export interface WizardCharacter extends BasePlayableCharacter {
  classIndex: "wizard";
}

/**
 * Union type of all playable character types
 * Discriminated by classIndex field
 */
export type PlayableCharacter =
  | SorcererCharacter
  | PaladinCharacter
  | MonkCharacter
  | BarbarianCharacter
  | BardCharacter
  | DruidCharacter
  | WarlockCharacter
  | RogueCharacter
  | FighterCharacter
  | RangerCharacter
  | ClericCharacter
  | WizardCharacter;

/**
 * Legacy PlayableCharacter interface for backward compatibility
 * @deprecated Use PlayableCharacter union type instead
 */
export interface LegacyPlayableCharacter extends BasePlayableCharacter {
  classIndex: string;
  sorceryPoints?: SorcererResources;
  kiPoints?: MonkResources;
  rages?: BarbarianResources;
  inspiration?: BardResources;
  channelDivinityCharges?: PaladinResources;
  invocationsKnown?: WarlockResources;
  featResources?: {
    sorceryPoints?: SorcererResources;
    spellSlots?: SpellSlots;
    kiPoints?: MonkResources;
    rages?: BarbarianResources;
  };
  wildShapeForm?: string;
}

export interface ClassEquipmentSelection {
  equipmentIndex: string;
  quantity: number;
}

export interface EquipmentSelection {
  equipmentIndex: string;
  quantity: number;
}

export function getClassResources(classIndex: string, levelData?: Level): {
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
    resources.channelDivinityCharges = { max: classSpecific.channel_divinity_charges };
  }

  if (classSpecific.ki_points !== undefined) {
    resources.kiPoints = { max: classSpecific.ki_points };
  }

  if (classSpecific.invocations_known !== undefined) {
    resources.invocationsKnown = classSpecific.invocations_known;
  }

  return resources;
}

export function convertLevelSpellcasting(spellcasting?: { spell_slots_level_1: number; spell_slots_level_2: number; spell_slots_level_3: number; spell_slots_level_4: number; spell_slots_level_5: number; spell_slots_level_6?: number; spell_slots_level_7?: number; spell_slots_level_8?: number; spell_slots_level_9?: number; }): SpellSlots {
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
    1: { current: spellcasting.spell_slots_level_1, max: spellcasting.spell_slots_level_1 },
    2: { current: spellcasting.spell_slots_level_2, max: spellcasting.spell_slots_level_2 },
    3: { current: spellcasting.spell_slots_level_3, max: spellcasting.spell_slots_level_3 },
    4: { current: spellcasting.spell_slots_level_4, max: spellcasting.spell_slots_level_4 },
    5: { current: spellcasting.spell_slots_level_5, max: spellcasting.spell_slots_level_5 },
    6: { current: spellcasting.spell_slots_level_6 ?? 0, max: spellcasting.spell_slots_level_6 ?? 0 },
    7: { current: spellcasting.spell_slots_level_7 ?? 0, max: spellcasting.spell_slots_level_7 ?? 0 },
    8: { current: spellcasting.spell_slots_level_8 ?? 0, max: spellcasting.spell_slots_level_8 ?? 0 },
    9: { current: spellcasting.spell_slots_level_9 ?? 0, max: spellcasting.spell_slots_level_9 ?? 0 },
  };
}

export function getAllProficiencies(
  raceData?: Race,
  backgroundData?: Background,
  classData?: Class
): { proficiency: Proficiency; sources: string[] }[] {
  const proficiencyMap = new Map<string, { proficiency: Proficiency; sources: string[] }>();

  raceData?.traits?.forEach(trait => {
    trait.proficiencies?.forEach(p => {
      const existing = proficiencyMap.get(p.index);
      if (existing) {
        existing.sources.push('race trait');
      } else {
        proficiencyMap.set(p.index, { proficiency: p, sources: ['race trait'] });
      }
    });
  });

  backgroundData?.starting_proficiencies?.forEach(p => {
    const existing = proficiencyMap.get(p.index);
    if (existing) {
      existing.sources.push('background');
    } else {
      proficiencyMap.set(p.index, { proficiency: p, sources: ['background'] });
    }
  });

  classData?.proficiencies?.forEach(p => {
    const existing = proficiencyMap.get(p.index);
    if (existing) {
      existing.sources.push('class');
    } else {
      proficiencyMap.set(p.index, { proficiency: p, sources: ['class'] });
    }
  });

  return Array.from(proficiencyMap.values());
}

export function sanitizeForFirebase(data: any): any {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForFirebase).filter(item => item !== undefined);
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

export function convertApiEquipmentToItem(equipment: Equipment, source?: 'class' | 'background' | 'race'): Item {
  const base: Item = {
    index: equipment.index,
    name: equipment.name,
    cost: equipment.cost,
    desc: equipment.desc || [],
    equipment_category: equipment.equipment_category,
    type: equipment.equipment_category?.name || 'item',
    magic: false,
    attackbonus: 0,
    defensebonus: 0,
    notes: equipment.desc?.join('\n') || '',
    equipped: false,
    source,
  };

  if (equipment.weight !== undefined && equipment.weight !== null) {
    base.weight = equipment.weight;
  }

  if (equipment.gear_category !== undefined && equipment.gear_category !== null) {
    base.gear_category = equipment.gear_category;
  }

  if ('weapon_category' in equipment) {
    const weapon = equipment as any;
    Object.assign(base, {
      weapon_category: weapon.weapon_category,
      weapon_range: weapon.weapon_range,
      category_range: weapon.category_range,
      damage: weapon.damage ? {
        damage_type: weapon.damage.damage_type,
        damage_dice: weapon.damage.damage_dice,
      } : undefined,
      range: weapon.range,
      properties: weapon.properties,
    });
  }

  if ('armor_category' in equipment) {
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

export function parseDamageDice(damageDice: string): { dice: number; number: number } {
  const match = damageDice.match(/^(\d+)d(\d+)$/i);
  if (!match) return { dice: 1, number: 6 };
  return { dice: parseInt(match[1], 10), number: parseInt(match[2], 10) };
}

export function formatDamageDice(dice: number, number: number): string {
  return `${dice}d${number}`;
}
