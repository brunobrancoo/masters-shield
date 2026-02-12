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

export interface Player {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  notes: string;
  inventory: Item[];
  ac: number;
  speed: number;
  initiativeBonus: number;
  passivePerception: number;
  proficiencyBonus: number;
  spellSlots: SpellSlots;
  maxSpellSlots: SpellSlots;
  sorceryPoints: number;
  maxSorceryPoints: number;
  skills: Skill[];
  features: Feature[];
  buffs: Buff[];
  debuffs: Buff[];
  spellCD: number;
  spellAttack: number;
  attackBaseBonus: number;
  spells: Spell[];
}

export interface SpellSlots {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
}

export interface Skill {
  name: string;
  description: string;
  savingThrowAttribute: keyof Attributes;
}

export interface Feature {
  name: string;
  description: string;
  uses?: number;
  source: string;
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
  players: Player[];
  npcs: NPC[];
}

export interface Item {
  name: string;
  price: number;
  type: string;
  distance: "melee" | "ranged" | string;
  damage: {
    dice: number;
    number: number;
    type: string;
  };
  magic: boolean;
  attackbonus: number;
  defensebonus: number;
  notes: string;
  equipped: boolean;
}

export interface InitiativeEntry {
  id: string;
  name: string;
  initiative: number;
  dexMod: number;
  hp: number;
  maxHp: number;
  type: "monster" | "player" | "npc" | "custom";
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
