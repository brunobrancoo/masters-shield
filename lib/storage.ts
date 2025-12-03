import { GameData } from "./interfaces/interfaces";

const STORAGE_KEY = "masters-shield";

export function loadGameData(): GameData {
  if (typeof window === "undefined") {
    return { monsters: [], players: [], npcs: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  return { monsters: [], players: [], npcs: [] };
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
