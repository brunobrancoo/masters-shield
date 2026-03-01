import { PlayableCharacter } from "@/lib/schemas";
import { calculateModifier } from "@/lib/skills";

const RACES = [
  { index: "human", name: "Humano" },
  { index: "elf", name: "Elfo" },
  { index: "dwarf", name: "Anão" },
  { index: "halfling", name: "Halfling" },
  { index: "gnome", name: "Gnomo" },
  { index: "half-elf", name: "Meio-Elfo" },
  { index: "half-orc", name: "Meio-Orc" },
  { index: "tiefling", name: "Tiefling" },
  { index: "dragonborn", name: "Draconato" },
];

const CLASSES = [
  { index: "fighter", name: "Guerreiro", hitDie: 10 },
  { index: "wizard", name: "Mago", hitDie: 6 },
  { index: "cleric", name: "Clérigo", hitDie: 8 },
  { index: "rogue", name: "Ladino", hitDie: 8 },
  { index: "paladin", name: "Paladino", hitDie: 10 },
  { index: "ranger", name: "Ranger", hitDie: 10 },
  { index: "barbarian", name: "Bárbaro", hitDie: 12 },
  { index: "bard", name: "Bardo", hitDie: 8 },
  { index: "druid", name: "Druida", hitDie: 8 },
  { index: "monk", name: "Monge", hitDie: 8 },
  { index: "sorcerer", name: "Feiticeiro", hitDie: 6 },
  { index: "warlock", name: "Bruxo", hitDie: 8 },
];

const NAMES = [
  "Aldric",
  "Thorin",
  "Eldon",
  "Gareth",
  "Bran",
  "Cedric",
  "Darian",
  "Finn",
  "Galen",
  "Kael",
  "Lorien",
  "Magnus",
  "Nolan",
  "Orion",
  "Quinlan",
  "Rowan",
  "Aria",
  "Brenna",
  "Cassia",
  "Della",
  "Elara",
  "Freya",
  "Gwen",
  "Hilda",
  "Isla",
  "Jora",
  "Kira",
  "Lyra",
  "Mira",
  "Nessa",
  "Olwen",
  "Petra",
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export interface RandomNPCData {
  name: string;
  raceIndex: string;
  raceName: string;
  classIndex: string;
  className: string;
  level: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
}

function calculateHP(
  level: number,
  conModifier: number,
  hitDie: number,
): number {
  let hp = hitDie + conModifier;

  for (let i = 2; i <= level; i++) {
    hp += Math.floor(hitDie / 2) + 1 + conModifier;
  }

  return Math.max(hp, level);
}

export function generateRandomNPCData(level?: number): RandomNPCData {
  const name = getRandomItem(NAMES);
  const race = getRandomItem(RACES);
  const selectedClass = getRandomItem(CLASSES);
  const selectedLevel = level || Math.floor(Math.random() * 5) + 1;

  const attributes = {
    str: Math.floor(Math.random() * 15) + 8,
    dex: Math.floor(Math.random() * 15) + 8,
    con: Math.floor(Math.random() * 15) + 8,
    int: Math.floor(Math.random() * 15) + 8,
    wis: Math.floor(Math.random() * 15) + 8,
    cha: Math.floor(Math.random() * 15) + 8,
  };

  return {
    name,
    raceIndex: race.index,
    raceName: race.name,
    classIndex: selectedClass.index,
    className: selectedClass.name,
    level: selectedLevel,
    attributes,
  };
}

export function getNPCFormDefaults(randomData: RandomNPCData): Partial<PlayableCharacter> {
  const hitDie = CLASSES.find(c => c.index === randomData.classIndex)?.hitDie || 8;
  const conModifier = calculateModifier(randomData.attributes.con);
  const hp = calculateHP(randomData.level, conModifier, hitDie);
  const maxHp = hp;
  const dexModifier = calculateModifier(randomData.attributes.dex);
  const ac = 10 + dexModifier;
  const wisModifier = calculateModifier(randomData.attributes.wis);
  const passivePerception = 10 + wisModifier;
  const profBonus = Math.ceil(1 + randomData.level / 4);

  return {
    name: randomData.name,
    raceIndex: randomData.raceIndex,
    raceName: randomData.raceName,
    classIndex: randomData.classIndex as any,
    className: randomData.className,
    level: randomData.level,
    hitDie: hitDie,
    attributes: randomData.attributes,
    hp: hp,
    maxHp: maxHp,
    ac: ac,
    speed: 30,
    initiativeBonus: 0,
    profBonus: profBonus,
    selectedProficiencies: [],
    chosenRaceFeatures: [],
    skills: [],
    classProficiencies: [],
    passivePerception: passivePerception,
    spellSlots: {
      1: { current: 0, max: 0 },
      2: { current: 0, max: 0 },
      3: { current: 0, max: 0 },
      4: { current: 0, max: 0 },
      5: { current: 0, max: 0 },
      6: { current: 0, max: 0 },
      7: { current: 0, max: 0 },
      8: { current: 0, max: 0 },
      9: { current: 0, max: 0 },
    },
    spellCD: 8 + profBonus,
    spellAttack: profBonus,
    spellsKnown: [],
    preparedSpells: [],
    spellList: [],
    inventory: [],
    buffs: [],
    debuffs: [],
    notes: "NPC gerado automaticamente. Complete as informações restantes conforme necessário.",
  };
}
