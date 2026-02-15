import { InitiativeEntry } from "@/lib/schemas";

export interface InitiativeRoll {
  id: string;
  roll: number;
  dex: number;
}

export interface CombatData {
  round: number;
  onCombat: boolean;
  currentTurn: number;
  initiativeEntries: InitiativeEntry[];
  initiativeRolls: InitiativeRoll[];
}

const COMBAT_STORAGE_KEY = "masters-shield-combat";

export function loadCombatData(): CombatData {
  if (typeof window === "undefined") {
    return {
      round: 1,
      onCombat: false,
      currentTurn: 0,
      initiativeEntries: [],
      initiativeRolls: [],
    };
  }

  try {
    const data = localStorage.getItem(COMBAT_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar dados de combate:", error);
  }

  return {
    round: 1,
    onCombat: false,
    currentTurn: 0,
    initiativeEntries: [],
    initiativeRolls: [],
  };
}

export function saveCombatData(data: CombatData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(COMBAT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar dados de combate:", error);
  }
}

export function clearCombatData(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(COMBAT_STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar dados de combate:", error);
  }
}
