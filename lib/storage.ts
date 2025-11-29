export interface Attributes {
  for: number
  des: number
  con: number
  int: number
  sab: number
  car: number
}

export interface Monster {
  id: string
  name: string
  type: string
  level: number
  hp: number
  attributes: Attributes
  skills: string[]
  notes: string
}

export interface Player {
  id: string
  name: string
  race: string
  class: string
  level: number
  hp: number
  attributes: Attributes
  inventory: string[]
  notes: string
}

export interface NPC {
  id: string
  name: string
  race: string
  class: string
  level: number
  hp: number
  attributes: Attributes
  skills: string[]
  personality: string
  notes: string
}

export interface GameData {
  monsters: Monster[]
  players: Player[]
  npcs: NPC[]
}

const STORAGE_KEY = "escudo-mestre-digital"

export function loadGameData(): GameData {
  if (typeof window === "undefined") {
    return { monsters: [], players: [], npcs: [] }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error)
  }

  return { monsters: [], players: [], npcs: [] }
}

export function saveGameData(data: GameData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Erro ao salvar dados:", error)
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
