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

const spellSlotsSchema = z.object({
  1: z.coerce.number().min(0),
  2: z.coerce.number().min(0),
  3: z.coerce.number().min(0),
  4: z.coerce.number().min(0),
  5: z.coerce.number().min(0),
  6: z.coerce.number().min(0),
  7: z.coerce.number().min(0),
  8: z.coerce.number().min(0),
  9: z.coerce.number().min(0),
});

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

export const itemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().min(0, "Preço deve ser positivo").default(0),
  type: z.string().default("weapon"),
  distance: z.string().default("melee"),
  damage: z.object({
    dice: z.number().min(1, "Número de dados deve ser positivo").default(1),
    number: z.number().min(1, "Valor do dado deve ser positivo").default(4),
    type: z.string().default(""),
  }),
  magic: z.boolean().default(false),
  attackbonus: z.number().default(0),
  defensebonus: z.number().default(0),
  notes: z.string().default(""),
  equipped: z.boolean().default(false),
});

export const playerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  race: z.string().min(1, "Raça obrigatória"),
  class: z.string().min(1, "Classe obrigatória"),
  level: z.coerce.number().min(1, "Nível deve ser pelo menos 1"),
  hp: z.coerce.number().min(1, "HP deve ser pelo menos 1"),
  maxHp: z.coerce.number().min(1),
  attributes: attributesSchema,
  notes: z.string().default(""),
  inventory: z.array(itemSchema).default([]),
  ac: z.coerce.number().min(1),
  speed: z.coerce.number().min(0),
  initiativeBonus: z.coerce.number(),
  passivePerception: z.coerce.number(),
  proficiencyBonus: z.coerce.number(),
  spellSlots: spellSlotsSchema,
  maxSpellSlots: spellSlotsSchema,
  sorceryPoints: z.coerce.number().min(0),
  maxSorceryPoints: z.coerce.number().min(0),
  skills: z.array(skillSchema),
  features: z.array(featureSchema),
  buffs: z.array(buffSchema),
  debuffs: z.array(buffSchema),
  spellCD: z.coerce.number().default(0),
  spellAttack: z.coerce.number().default(0),
  attackBaseBonus: z.coerce.number().default(0),
  spells: z.array(z.any()).default([]),
});

export type MonsterFormData = z.infer<typeof monsterSchema>;
export type NPCFormData = z.infer<typeof npcSchema>;
export type PlayerFormData = z.infer<typeof playerSchema>;
export type BuffFormData = z.infer<typeof buffSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;

export const spellSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  level: z.coerce.number().min(0, "Nível deve ser positivo").max(9, "Nível máximo é 9"),
  school: z.string().default(""),
  castingTime: z.string().default(""),
  duration: z.string().default(""),
  range: z.string().default(""),
  components: z.string().default(""),
  concentration: z.boolean().default(false),
  ritual: z.boolean().default(false),
});

export type SpellFormData = z.infer<typeof spellSchema>;

