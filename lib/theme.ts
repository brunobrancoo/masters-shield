export type Archetype =
  | "arcane"
  | "divine"
  | "martial"
  | "dex"
  | "nature"
  | "bard";

export const ARCHETYPE_MAP: Record<string, Archetype> = {
  Sorcerer: "arcane",
  Wizard: "arcane",
  Warlock: "arcane",
  Artificer: "arcane",
  Cleric: "divine",
  Paladin: "divine",
  Fighter: "martial",
  Barbarian: "martial",
  Monk: "martial",
  Rogue: "dex",
  Ranger: "dex",
  Druid: "nature",
  Bard: "bard",
};

export function getArchetype(className: string): Archetype {
  return ARCHETYPE_MAP[className] || "martial";
}

export const DAMAGE_TYPES = [
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
] as const;

export type DamageType = (typeof DAMAGE_TYPES)[number];

export const CONDITIONS = [
  "blinded",
  "charmed",
  "deafened",
  "exhaustion",
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
] as const;

export type Condition = (typeof CONDITIONS)[number];

export const RARITIES = [
  "common",
  "uncommon",
  "rare",
  "very-rare",
  "legendary",
  "artifact",
] as const;

export type Rarity = (typeof RARITIES)[number];

export function getHPColor(percentage: number): string {
  if (percentage <= 0) return "var(--condition-unconscious)";
  if (percentage < 26) return "var(--damage)";
  if (percentage < 51) return "hsl(40 80% 50%)";
  if (percentage < 76) return "var(--divine-400)";
  return "var(--healing)";
}

export function getHPClass(percentage: number): string {
  if (percentage <= 0) return "";
  if (percentage < 26) return "pulse-danger";
  return "";
}
