import { GameData, PlayableCharacter } from "@/lib/schemas";
import { calculateProficiencyBonus, defaultSpellSlots } from "./utils-dnd";

const STORAGE_KEY = "masters-shield";

export function loadGameData(): GameData {
  if (typeof window === "undefined") {
    return { monsters: [], playableCharacters: [], npcs: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);

      // Migrate players with missing fields
      const playableCharacters = parsed.players.map((player: any) => ({
        ...player,
        // Default values for new fields
        ac: player.ac ?? 10,
        speed: player.speed ?? 30,
        initiativeBonus: player.initiativeBonus ?? 0,
        passivePerception: player.passivePerception ?? 10,
        proficiencyBonus:
          player.proficiencyBonus ?? calculateProficiencyBonus(player.level),
        spellSlots: player.spellSlots ?? defaultSpellSlots(),
        maxSpellSlots: player.maxSpellSlots ?? defaultSpellSlots(),
        sorceryPointsLegacy: player.sorceryPoints ?? 0,
        maxSorceryPoints: player.maxSorceryPoints ?? 0,
        profBonus: player.profBonus ?? 0,
        skills: player.skills ?? [],
        classFeatures: player.classFeatures ?? [],
        customFeatures: player.customFeatures ?? [],
        featFeatures: player.featFeatures ?? [],
        buffs: player.buffs ?? [],
        debuffs: player.debuffs ?? [],
      }));

      return { ...parsed, playableCharacters };
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  return { monsters: [], playableCharacters: [], npcs: [] };
}

export function saveGameData(data: GameData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
