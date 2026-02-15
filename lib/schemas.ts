import { z } from "zod";

export const attributesSchema = z.object({
  str: z.number().min(1).max(30),
  dex: z.number().min(1).max(30),
  con: z.number().min(1).max(30),
  int: z.number().min(1).max(30),
  wis: z.number().min(1).max(30),
  cha: z.number().min(1).max(30),
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

export const spellSchema = z.object({
  index: z.string().min(1),
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
  description: z.array(z.string()).default([]),
  attackType: z.string().optional(),
  material: z.string().optional(),
  areaOfEffect: z
    .object({
      size: z.number().optional(),
      type: z.string().optional(),
    })
    .optional(),
  higherLevel: z.array(z.string()).optional(),
  damage: z
    .object({
      damageType: z.string().optional(),
      damageAtSlotLevel: z.array(z.string()).optional(),
    })
    .optional(),
  dc: z
    .object({
      dcType: z.string().optional(),
      dcSuccess: z.string().optional(),
    })
    .optional(),
  healAtSlotLevel: z.array(z.string()).optional(),
});

export const spellListSchema = z
  .array(
    z.object({
      index: z.string(),
      name: z.string(),
      level: z.number(),
      school: z.string(),
      castingTime: z.string(),
      duration: z.string(),
      range: z.string(),
      components: z.string(),
      description: z.array(z.string()),
      concentration: z.boolean(),
      ritual: z.boolean(),
      damage: z
        .object({
          damageType: z.string().optional(),
          damageAtSlotLevel: z.array(z.string()).optional(),
        })
        .optional(),
      dc: z
        .object({
          dcType: z.string().optional(),
          dcSuccess: z.string().optional(),
        })
        .optional(),
      areaOfEffect: z
        .object({
          size: z.number().optional(),
          type: z.string().optional(),
        })
        .optional(),
      higherLevel: z.array(z.string()).optional(),
      attackType: z.string().optional(),
      material: z.string().optional(),
      healAtSlotLevel: z.array(z.string()).optional(),
    }),
  )
  .default([]);

// Define the shape of ONE level (e.g., Level 1 slots)

const spellSlotLevelSchema = z.object({
  current: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
});

export const spellSlotsSchema = z.object({
  1: spellSlotLevelSchema,
  2: spellSlotLevelSchema,
  3: spellSlotLevelSchema,
  4: spellSlotLevelSchema,
  5: spellSlotLevelSchema,
  6: spellSlotLevelSchema,
  7: spellSlotLevelSchema,
  8: spellSlotLevelSchema,
  9: spellSlotLevelSchema,
});

export const pointPoolSchema = z.object({
  current: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
});

export const basePlayableCharacterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),
  hitDie: z.coerce.number().int().positive(),

  raceIndex: z.string().min(1, "Raça obrigatória"),
  classIndex: z.string().min(1, "Classe obrigatória"),
  className: z.string().min(1, "Classe obrigatória"),
  subclassIndex: z.string().optional(),
  backgroundIndex: z.string().optional(),
  languages: z.array(z.string()).default([]),

  profBonus: z.coerce.number().min(2).max(6).default(2),

  level: z.coerce.number().min(1).max(20),
  hp: z.coerce.number().min(1),
  maxHp: z.coerce.number().min(1),
  attributes: attributesSchema,

  selectedProficiencies: z.array(z.string()).default([]),
  chosenRaceFeatures: z.array(z.string()).default([]),

  inventory: z.array(itemSchema).default([]),

  speed: z.coerce.number(),
  ac: z.coerce.number().min(1),
  initiativeBonus: z.coerce.number().default(0),

  notes: z.string().default(""),
  buffs: z.array(buffSchema).default([]),
  debuffs: z.array(buffSchema).default([]),
});

// --- CLASSES ---

export const sorcererCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("sorcerer"),
  sorceryPoints: pointPoolSchema.optional(),
  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]), // Fixed list
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const paladinCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("paladin"),
  channelDivinityCharges: pointPoolSchema.optional(),
  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]), // Fixed list (Oath spells usually)
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

const martialArtsDieSchema = z.object({
  count: z.number(), // 3 (as in 3d6)
  die: z.number(), // 6 (as in 3d6)
});
export const monkCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("monk"),
  kiPoints: pointPoolSchema.optional(),
  spellSlots: spellSlotsSchema.optional(), // Monks technically can't cast spells in 5e RAW (unless specific subclass), but kept for flexibility
  spellsKnown: z.array(z.string()).default([]),
  martialArtsDie: martialArtsDieSchema,
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const barbarianCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("barbarian"),
  rages: pointPoolSchema.optional(),
});

export const bardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("bard"),
  inspiration: pointPoolSchema.optional(),
  inspirationDie: z.coerce.number().optional(),
  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]), // Fixed list
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const druidCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("druid"),
  spellSlots: spellSlotsSchema.optional(),
  preparedSpells: z.array(z.string()).default([]), // Daily prep
});

export const warlockCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("warlock"),
  invocationsKnown: z.array(z.string()).default([]),
  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]), // Fixed list (Mystic Arcanum aside)
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

const sneakAttackDiceSchema = z.object({
  count: z.number(), // 3 (as in 3d6)
  die: z.number(), // 6 (as in 3d6)
});

export const rogueCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("rogue"),
  sneakAttack: sneakAttackDiceSchema,
});

export const fighterCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("fighter"),
  actionSurges: pointPoolSchema.optional(),
  intomitables: pointPoolSchema.optional(),
});

export const rangerCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("ranger"),
  spellSlots: spellSlotsSchema.optional(),
  spellsKnown: z.array(z.string()).default([]), // Fixed list (usually)
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const clericCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("cleric"),
  spellSlots: spellSlotsSchema.optional(),
  channelDivinityCharges: pointPoolSchema.optional(),
  preparedSpells: z.array(z.string()).default([]), // Daily prep
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const wizardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("wizard"),
  spellSlots: spellSlotsSchema.optional(),
  spellBook: z.array(z.string()).default([]), // Everything owned
  preparedSpells: z.array(z.string()).default([]), // Daily prep
  spellAttack: z.coerce.number(),
  spellCD: z.coerce.number(),
});

export const playableCharacterSchema = z.discriminatedUnion("classIndex", [
  barbarianCharacterSchema,
  sorcererCharacterSchema,
  paladinCharacterSchema,
  monkCharacterSchema,
  bardCharacterSchema,
  druidCharacterSchema,
  warlockCharacterSchema,
  rogueCharacterSchema,
  fighterCharacterSchema,
  rangerCharacterSchema,
  clericCharacterSchema,
  wizardCharacterSchema,
]);

// Helper schema for Homebrew Feats
const homebrewFeatSchema = z.object({
  index: z.string(),
  name: z.string(),
  desc: z.array(z.string()),
  prerequisites: z.array(z.string()),
});

// Helper schema for Homebrew Features
const homebrewFeatureSchema = z.object({
  index: z.string(),
  name: z.string(),
  desc: z.array(z.string()),
  level: z.number(),
  source: z.string(),
  class: z.string().optional(),
  subclass: z.string().optional(),
});

export const homebrewSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  itemType: z.enum(["item", "spell", "feat", "feature"]),

  // Reusing existing schemas where possible
  item: itemSchema.optional(),
  spell: spellSchema.optional(),

  // Using specific helper schemas
  feat: homebrewFeatSchema.optional(),
  feature: homebrewFeatureSchema.optional(),

  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Monster = z.infer<typeof monsterSchema>;
export type NPC = z.infer<typeof npcSchema>;
export type Item = z.infer<typeof itemSchema>; // Matches interfaces.ts
export type Buff = z.infer<typeof buffSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type PlayableCharacter = z.infer<typeof playableCharacterSchema>; // Matches interfaces.ts
export type Spell = z.infer<typeof spellSchema>;
export type PointPool = z.infer<typeof pointPoolSchema>;
export type SpellSlots = z.infer<typeof spellSlotsSchema>;
export type Attributes = z.infer<typeof attributesSchema>;
export type Homebrew = z.infer<typeof homebrewSchema>;
