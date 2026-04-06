import { z } from "zod";

// --- Stateful: Ability Uses ---
// Covers both X/day and Recharge X-Y abilities

const abilityUseStateSchema = z.object({
  name: z.string(), // matches special_ability name
  current: z.number().min(0),
  max: z.number().min(0),
});

// --- Stateful: Conditions & Status ---

const dnd5eConditionSchema = z.enum([
  "blinded",
  "charmed",
  "deafened",
  "frightened",
  "grappled",
  "incapacitated",
  "invisible",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
]);

// --- Modifier ---

const modifierSchema = z.object({
  label: z.string().min(1),
  value: z.number(),
  source: z
    .object({
      who: z.string().optional(),
      what: z.string().optional(),
    })
    .optional(),
});

// --- Shared primitives ---

const damageTypeSchema = z.object({
  index: z.string(),
  name: z.string(),
});

const damageSchema = z.object({
  damage_dice: z.string(),
  damage_type: damageTypeSchema,
});

const dcSchema = z.object({
  dc_value: z.number(),
  success_type: z.string(),
  dc_type: z.object({ name: z.string() }).optional(),
});

const spellRefSchema = z.object({
  name: z.string(),
  level: z.number(),
});

// --- Armor Class ---

const acBaseSchema = z.object({
  type: z.string(),
  value: z.number(),
  desc: z.string().optional(),
});

const armorClassSchema = z.discriminatedUnion("type", [
  acBaseSchema.extend({ type: z.literal("dex") }),
  acBaseSchema.extend({ type: z.literal("natural") }),
  acBaseSchema.extend({
    type: z.literal("armor"),
    armor: z.array(
      z.object({
        index: z.string(),
        name: z.string(),
        properties: z.array(z.object({ name: z.string() })),
      }),
    ),
  }),
  acBaseSchema.extend({
    type: z.literal("spell"),
    spell: spellRefSchema,
  }),
  acBaseSchema.extend({
    type: z.literal("condition"),
    condition: z.object({ name: z.string() }),
  }),
]);

// --- Speed & Senses ---

const speedSchema = z.object({
  walk: z.string().optional(),
  burrow: z.string().optional(),
  climb: z.string().optional(),
  fly: z.string().optional(),
  hover: z.boolean().optional(),
  swim: z.string().optional(),
});

const sensesSchema = z.object({
  blindsight: z.string().optional(),
  darkvision: z.string().optional(),
  passive_perception: z.number(),
  tremorsense: z.string().optional(),
  truesight: z.string().optional(),
});

// --- Actions ---

const actionSchema = z.object({
  name: z.string(),
  desc: z.string(),
  attack_bonus: z.number().optional(),
  multiattack_type: z.string().optional(),
  damage: z.array(damageSchema).optional(),
  action_options: z.object({ type: z.string(), desc: z.string() }).optional(),
  options: z.object({ desc: z.string() }).optional(),
});

const legendaryActionSchema = z.object({
  name: z.string(),
  desc: z.string(),
  attack_bonus: z.number().optional(),
  damage: z.array(damageSchema).optional(),
  dc: dcSchema.optional(),
});

const reactionSchema = z.object({
  name: z.string(),
  desc: z.string(),
  dc: dcSchema.optional(),
});

// --- Special Abilities ---

const usageSchema = z.object({
  type: z.string(),
  times: z.number().optional(),
  rest_types: z.array(z.string()).optional(),
});

const spellcastingSchema = z.object({
  slots: z.array(z.object({ count: z.number(), slot_level: z.number() })),
  spells: z.array(z.object({ spell: spellRefSchema })),
});

const specialAbilitySchema = z.object({
  name: z.string(),
  desc: z.string(),
  attack_bonus: z.number().optional(),
  damage: z.array(damageSchema).optional(),
  dc: dcSchema.optional(),
  spellcasting: spellcastingSchema.optional(),
  usage: usageSchema.optional(),
});

export const attributesSchema = z.object({
  str: z.number().min(1).max(30),
  dex: z.number().min(1).max(30),
  con: z.number().min(1).max(30),
  int: z.number().min(1).max(30),
  wis: z.number().min(1).max(30),
  cha: z.number().min(1).max(30),
});

//LEGACY!! REMOVE
export interface GameData {
  monsters: Monster[];
  playableCharacters: PlayableCharacter[];
  npcs: NPC[];
}

export const initiativeEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  initiative: z.coerce.number(),
  dexMod: z.coerce.number(),
  hp: z.coerce.number(),
  maxHp: z.coerce.number(),
  type: z.enum(["monster", "playableCharacter", "npc", "custom"]),
  sourceId: z.string().optional(),
  tempHp: z.coerce.number().optional(),
  ac: z.coerce.number().optional(),
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

export const inventoryitemSchema = z.object({
  index: z.string().min(1, { message: "ID is required" }),
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["normal", "magical", "homebrew"]),
  notes: z.string().default(""),
  equipped: z.boolean().default(false),
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

  //Spell things
  spellSlots: spellSlotsSchema.optional(),
  spellAttack: z.coerce.number().optional(),
  spellCD: z.coerce.number().optional(),
  spellsKnown: z.array(z.string()).default([]),
  preparedSpells: z.array(z.string()).default([]),
  spellList: spellListSchema.optional(),

  raceIndex: z.string().min(1, "Raça obrigatória"),
  raceName: z.string().min(1, "Raça obrigatória"),
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

  inventory: z.array(inventoryitemSchema).default([]),
  gold: z.coerce.number().min(0).default(0),

  skills: z.array(z.string()),
  speed: z.coerce.number(),
  ac: z.coerce.number().min(1),
  initiativeBonus: z.coerce.number().default(0),

  classProficiencies: z.array(z.string()),
  passivePerception: z.coerce.number(),

  notes: z.string().default(""),
  buffs: z.array(buffSchema).default([]),
  debuffs: z.array(buffSchema).default([]),
});

// --- CLASSES ---

export const sorcererCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("sorcerer"),
  sorceryPoints: pointPoolSchema.optional(),
});

export const paladinCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("paladin"),
});

const martialArtsDieSchema = z.object({
  count: z.number(), // 3 (as in 3d6)
  die: z.number(), // 6 (as in 3d6)
});
export const monkCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("monk"),
  kiPoints: pointPoolSchema.optional(),
  martialArtsDie: martialArtsDieSchema,
});

export const barbarianCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("barbarian"),
  rages: pointPoolSchema.optional(),
});

export const bardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("bard"),
  inspiration: pointPoolSchema.optional(),
  inspirationDie: z.coerce.number().optional(),
});

export const druidCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("druid"),
});

export const warlockCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("warlock"),
  invocationsKnown: z.array(z.string()).default([]),
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
  indomitables: pointPoolSchema.optional(),
});

export const rangerCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("ranger"),
});

export const clericCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("cleric"),
  channelDivinityCharges: pointPoolSchema.optional(),
});

export const wizardCharacterSchema = basePlayableCharacterSchema.extend({
  classIndex: z.literal("wizard"),
  spellBook: z.array(z.string()).default([]), // Everything owned
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

export const npcSchema = playableCharacterSchema;

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

const monsterStatusSchema = z.enum(["alive", "unconscious", "dead"]);

const concentrationSchema = z.object({
  active: z.boolean(),
  spell: spellRefSchema.optional(),
});

// --- Monster Schema ---

export const monsterSchema = z.object({
  // Identity
  id: z.string().optional(),
  index: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  subtype: z.string().optional(),
  alignment: z.string().optional(),
  size: z.string().min(1),
  image: z.string().optional(),
  languages: z.string().optional(),
  forms: z.array(z.object({ name: z.string() })).optional(),

  // Challenge
  challenge_rating: z.number(),
  xp: z.number(),

  // Attributes
  attributes: attributesSchema,

  // HP (stateful)
  hp: z.number().min(0),
  maxHp: z.number().min(1),
  tempHp: z.number().min(0).default(0),
  hit_dice: z.string(),
  hit_points_roll: z.string(),

  // Armor Class
  armor_class: z.array(armorClassSchema),

  // Movement & perception
  speed: speedSchema,
  senses: sensesSchema,

  // Proficiencies
  proficiencies: z
    .array(
      z.object({
        proficiency: z.object({ name: z.string() }),
        value: z.number(),
      }),
    )
    .default([]),

  // Immunities / Resistances / Vulnerabilities
  damage_immunities: z.array(z.string()).default([]),
  damage_resistances: z.array(z.string()).default([]),
  damage_vulnerabilities: z.array(z.string()).default([]),
  condition_immunities: z
    .array(z.object({ index: z.string(), name: z.string() }))
    .default([]),

  // Actions
  actions: z.array(actionSchema).default([]),
  reactions: z.array(reactionSchema).default([]),
  special_abilities: z.array(specialAbilitySchema).default([]),

  // Legendary (stateful pool)
  legendary_actions: z.array(legendaryActionSchema).default([]),
  legendary_actions_pool: z
    .object({ current: z.number().min(0), max: z.number().min(0) })
    .optional(),
  legendary_resistances: z
    .object({ current: z.number().min(0), max: z.number().min(0) })
    .optional(),

  // Spell slots (stateful)
  spellSlots: spellSlotsSchema.optional(),

  // Ability uses (stateful)
  abilityUses: z.array(abilityUseStateSchema).default([]),

  // Combat state
  status: monsterStatusSchema.default("alive"),
  conditions: z.array(dnd5eConditionSchema).default([]),
  concentration: concentrationSchema.optional(),

  // Modifiers (buffs, debuffs, temp effects)
  modifiers: z.array(modifierSchema).default([]),

  // Meta
  isHomebrew: z.boolean().default(false),
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
export type InitiativeEntry = z.infer<typeof initiativeEntrySchema>;
export type InventoryItem = z.infer<typeof inventoryitemSchema>;

export interface InitiativeEntryWithTemp extends InitiativeEntry {
  tempHp?: number;
  legendaryActionPool?: { current: number; max: number };
  legendaryResistancePool?: { current: number; max: number };
  abilityUses?: Array<{ name: string; current: number; max: number }>;
}
