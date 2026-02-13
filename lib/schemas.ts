import { z } from "zod";

export const attributesSchema = z.object({
  for: z.number().min(1).max(30),
  des: z.number().min(1).max(30),
  con: z.number().min(1).max(30),
  int: z.number().min(1).max(30),
  sab: z.number().min(1).max(30),
  car: z.number().min(1).max(30),
});

export const monsterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  level: z.number().min(1).max(30),
  hp: z.number().min(1),
  attributes: attributesSchema,
  skills: z.array(z.string()),
  notes: z.string(),
});

export const npcSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  race: z.string().min(1, "Raça é obrigatória"),
  class: z.string().min(1, "Classe é obrigatória"),
  level: z.number().min(1).max(30),
  hp: z.number().min(1),
  attributes: attributesSchema,
  skills: z.array(z.string()),
  personality: z.string(),
  notes: z.string(),
});

export const spellSlotsSchema = z.object({
  1: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  2: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  3: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  4: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  5: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  6: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  7: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  8: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
  9: z.object({
    current: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
  }),
});

export const pointPoolSchema = z.object({
  current: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
});

export const sorcererResourcesSchema = z.object({
  sorceryPoints: pointPoolSchema.optional(),
});

export const monkResourcesSchema = z.object({
  kiPoints: pointPoolSchema.optional(),
});

export const barbarianResourcesSchema = z.object({
  rages: pointPoolSchema.optional(),
  rageDamageBonus: z.number().optional(),
});

export const bardResourcesSchema = z.object({
  inspiration: pointPoolSchema.optional(),
});

export const paladinResourcesSchema = z.object({
  channelDivinityCharges: pointPoolSchema.optional(),
});

export const warlockResourcesSchema = z.object({
  invocationsKnown: z.coerce.number().optional(),
});

export const sorcererFeatResourcesSchema = z.object({
  sorceryPoints: pointPoolSchema.optional(),
});

export const monkFeatResourcesSchema = z.object({
  kiPoints: pointPoolSchema.optional(),
});

export const barbarianFeatResourcesSchema = z.object({
  rages: pointPoolSchema.optional(),
});

export const featResourcesSchema = z.object({
  sorceryPoints: sorcererFeatResourcesSchema.optional(),
  spellSlots: spellSlotsSchema.optional(),
  kiPoints: monkFeatResourcesSchema.optional(),
  rages: barbarianFeatResourcesSchema.optional(),
});

export const classEquipmentSelectionSchema = z.object({
  equipmentIndex: z.string(),
  quantity: z.number().min(1),
});

export const equipmentSelectionSchema = z.object({
  equipmentIndex: z.string(),
  quantity: z.number().min(1),
});

export const itemSchema = z.object({
  index: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  cost: z.object({
    quantity: z.number().min(0),
    unit: z.string(),
  }),
  desc: z.array(z.string()).optional(),
  weight: z.number().optional(),
  equipment_category: z
    .object({
      index: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  gear_category: z
    .object({
      index: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  weapon_category: z.string().optional(),
  weapon_range: z.string().optional(),
  category_range: z.string().optional(),
  damage: z
    .object({
      damage_type: z
        .object({
          index: z.string(),
          name: z.string(),
        })
        .optional(),
      damage_dice: z.string(),
    })
    .optional(),
  range: z
    .object({
      normal: z.number(),
      long: z.number().optional(),
    })
    .optional(),
  properties: z.array(z.any()).optional(),
  armor_category: z.string().optional(),
  armor_class: z
    .object({
      base: z.number(),
      dex_bonus: z.boolean(),
      max_bonus: z.number().optional(),
    })
    .optional(),
  str_minimum: z.number().optional(),
  stealth_disadvantage: z.boolean().optional(),
  type: z.string().default("item"),
  magic: z.boolean().default(false),
  attackbonus: z.number().default(0),
  defensebonus: z.number().default(0),
  notes: z.string().default(""),
  equipped: z.boolean().default(false),
  source: z.enum(["class", "background", "race", "custom"]).optional(),
});

export const itemFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().min(0, "Preço deve ser positivo").default(0),
  type: z.string().default("weapon"),
  distance: z.string().default("melee"),
  damage: z
    .object({
      dice: z.number().min(1, "Número de dados deve ser positivo").default(1),
      number: z.number().min(1, "Valor do dado deve ser positivo").default(4),
      type: z.string().default(""),
    })
    .optional(),
  magic: z.boolean().default(false),
  attackbonus: z.number().default(0),
  defensebonus: z.number().default(0),
  notes: z.string().default(""),
  equipped: z.boolean().default(false),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  savingThrowAttribute: z.enum(["for", "des", "con", "int", "sab", "car"]),
});

export const featureSchema = z.object({
  index: z.string().optional(),
  name: z.string().min(1),
  description: z.union([z.string(), z.array(z.string())]),
  uses: z.number().optional(),
  source: z.string(),
  level: z.number().optional(),
  prerequisites: z.array(z.any()).optional(),
});

export const buffSchema = z.object({
  name: z.string().min(1),
  duration: z.string().optional(),
  description: z.string(),
  source: z.string(),
  affects: z.object({
    effect: z.string(),
    amount: z.number(),
  }),
});

/**
 * Base schema for all playable character types
 * Contains common fields shared across all D&D 5e classes
 */
export const basePlayableCharacterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),

  raceIndex: z.string().min(1, "Raça obrigatória"),
  raceName: z.string().min(1),

  classIndex: z.string().min(1, "Classe obrigatória"),
  className: z.string().min(1),
  level: z.coerce.number().min(1).max(20),

  subclassIndex: z.string().optional(),
  subclassName: z.string().optional(),

  backgroundIndex: z.string().optional(),
  backgroundName: z.string().optional(),

  raceTraits: z.array(z.string()).default([]),
  backgroundFeature: z.string().optional(),
  classFeatures: z.array(z.string()).default([]),
  customFeatures: z.array(featureSchema).default([]),
  featFeatures: z.array(featureSchema).default([]),

  selectedProficiencies: z.array(z.string()).default([]),
  raceProficiencies: z.array(z.string()).default([]),
  backgroundProficiencies: z.array(z.string()).default([]),
  classProficiencies: z.array(z.string()).default([]),

  classEquipment: z.array(classEquipmentSelectionSchema).default([]),
  backgroundEquipment: z.array(equipmentSelectionSchema).default([]),

  hp: z.coerce.number().min(1),
  maxHp: z.coerce.number().min(1),
  attributes: attributesSchema,
  inventory: z.array(itemSchema).default([]),
  notes: z.string().default(""),
  ac: z.coerce.number().min(1),
  speed: z.coerce.number().min(0),
  initiativeBonus: z.coerce.number().default(0),
  passivePerception: z.coerce.number().default(10),
  proficiencyBonus: z.coerce.number().min(2).max(6),
  abilityScoreImprovementsUsed: z.coerce.number().min(0).default(0),

  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]),
  spellAttack: z.coerce.number().default(0),
  spellCD: z.coerce.number().default(0),

  // Legacy fields for backward compatibility
  spells: z.array(z.any()).default([]),
  maxSpellSlots: spellSlotsSchema.optional(),
  profBonus: z.coerce.number().default(0),

  // Buffs and debuffs are common to all characters
  buffs: z.array(buffSchema).default([]),
  debuffs: z.array(buffSchema).default([]),
});

/**
 * Sorcerer-specific schema with sorcery points
 */
export const sorcererCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("sorcerer"),
  sorceryPoints: sorcererResourcesSchema.optional(),
});

/**
 * Paladin-specific schema with channel divinity charges
 */
export const paladinCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("paladin"),
  channelDivinityCharges: paladinResourcesSchema.optional(),
});

/**
 * Monk-specific schema with ki points
 */
export const monkCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("monk"),
  kiPoints: monkResourcesSchema.optional(),
});

/**
 * Barbarian-specific schema with rages
 */
export const barbarianCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("barbarian"),
  rages: barbarianResourcesSchema.optional(),
});

/**
 * Bard-specific schema with inspiration
 */
export const bardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("bard"),
  inspiration: bardResourcesSchema.optional(),
});

/**
 * Druid-specific schema with wild shape
 */
export const druidCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("druid"),
  wildShapeForm: z.string().optional(),
});

/**
 * Warlock-specific schema with invocations
 */
export const warlockCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("warlock"),
  invocationsKnown: warlockResourcesSchema.optional(),
});

/**
 * Rogue character schema - no class-specific resources
 */
export const rogueCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("rogue"),
});

/**
 * Fighter character schema - no class-specific resources
 */
export const fighterCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("fighter"),
});

/**
 * Ranger character schema - no class-specific resources
 */
export const rangerCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("ranger"),
});

/**
 * Cleric character schema - no class-specific resources
 */
export const clericCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("cleric"),
});

/**
 * Wizard character schema - no class-specific resources
 */
export const wizardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("wizard"),
});

/**
 * Union schema of all playable character types
 * Discriminated by classIndex field
 */
export const playableCharacterSchema = z.discriminatedUnion("classIndex", [
  sorcererCharacterSchema,
  paladinCharacterSchema,
  monkCharacterSchema,
  barbarianCharacterSchema,
  bardCharacterSchema,
  druidCharacterSchema,
  warlockCharacterSchema,
  rogueCharacterSchema,
  fighterCharacterSchema,
  rangerCharacterSchema,
  clericCharacterSchema,
  wizardCharacterSchema,
]);

/**
 * Legacy schema for backward compatibility
 * @deprecated Use playableCharacterSchema (discriminated union) instead
 */
export const legacyPlayableCharacterSchema = basePlayableCharacterSchema.extend(
  {
    classIndex: z.string(),
    sorceryPoints: sorcererResourcesSchema.optional(),
    kiPoints: monkResourcesSchema.optional(),
    rages: barbarianResourcesSchema.optional(),
    inspiration: bardResourcesSchema.optional(),
    channelDivinityCharges: paladinResourcesSchema.optional(),
    invocationsKnown: warlockResourcesSchema.optional(),
    featResources: featResourcesSchema.optional(),
    wildShapeForm: z.string().optional(),
  },
);

export const spellSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  level: z.coerce
    .number()
    .min(0, "Nível deve ser positivo")
    .max(9, "Nível máximo é 9"),
  school: z.string().default(""),
  castingTime: z.string().default(""),
  duration: z.string().default(""),
  range: z.string().default(""),
  components: z.string().default(""),
  concentration: z.boolean().default(false),
  ritual: z.boolean().default(false),
});

export type MonsterFormData = z.infer<typeof monsterSchema>;
export type NPCFormData = z.infer<typeof npcSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;
export type ItemFormFormData = z.infer<typeof itemFormSchema>;
export type BuffFormData = z.infer<typeof buffSchema>;
export type FeatureFormData = z.infer<typeof featureSchema>;
export type PlayerFormData = z.infer<typeof playableCharacterSchema>;
export type SpellFormData = z.infer<typeof spellSchema>;
