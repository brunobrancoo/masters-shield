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
  attributes: Attributes;
  skills: string[];
  notes: string;
  items: Item[];
}

export interface Player {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  attributes: Attributes;
  inventory: string[];
  notes: string;
  items: Item[];
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
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
  type: "weapon" | "shield" | "armor";
  distance: number | "melee";
  damage: {
    dice: number;
    number: number;
    type: string;
  };
  magic: boolean;
  attackbonus: number;
  defensebonus: number;
  notes: string;
}
