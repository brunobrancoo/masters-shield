import { generateAttributes, calculateHPModifier } from "./dice"
import type { NPC, Attributes } from "./storage"
import { generateId } from "./storage"

const RACES = ["Humano", "Elfo", "Anão", "Halfling", "Gnomo", "Meio-Elfo", "Meio-Orc", "Tiefling", "Draconato"]

const CLASSES = [
  "Guerreiro",
  "Mago",
  "Clérigo",
  "Ladino",
  "Paladino",
  "Ranger",
  "Bárbaro",
  "Bardo",
  "Druida",
  "Monge",
  "Feiticeiro",
  "Bruxo",
]

const PERSONALITIES = [
  "Corajoso e leal",
  "Astuto e cauteloso",
  "Impulsivo e agressivo",
  "Sábio e contemplativo",
  "Carismático e persuasivo",
  "Misterioso e reservado",
  "Alegre e otimista",
  "Cínico e desconfiado",
  "Honrado e justo",
  "Ambicioso e ganancioso",
  "Protetor e compassivo",
  "Rebelde e independente",
  "Covarde mas esperto",
  "Fanático e devoto",
  "Pragmático e calculista",
]

const SKILLS_BY_CLASS: Record<string, string[]> = {
  Guerreiro: ["Ataque Poderoso", "Segunda Investida", "Especialização em Arma"],
  Mago: ["Mísseis Mágicos", "Escudo Arcano", "Detectar Magia"],
  Clérigo: ["Cura Divina", "Proteção Sagrada", "Expulsar Mortos-Vivos"],
  Ladino: ["Ataque Furtivo", "Evasão", "Encontrar Armadilhas"],
  Paladino: ["Imposição de Mãos", "Aura de Proteção", "Golpe Divino"],
  Ranger: ["Rastreador", "Inimigo Favorito", "Estilo de Combate"],
  Bárbaro: ["Fúria", "Defesa sem Armadura", "Ataque Imprudente"],
  Bardo: ["Inspiração Bardica", "Canção de Descanso", "Versatilidade"],
  Druida: ["Forma Selvagem", "Empatia Selvagem", "Conjuração Natural"],
  Monge: ["Ataque Desarmado", "Defesa sem Armadura", "Movimento Ágil"],
  Feiticeiro: ["Origem da Magia", "Metamagia", "Explosão Mágica"],
  Bruxo: ["Explosão Mística", "Patrono Misterioso", "Invocações"],
}

const NAMES = [
  // Masculinos
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
  // Femininos
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
]

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getClassSkills(className: string, level: number): string[] {
  const skills = SKILLS_BY_CLASS[className] || ["Ataque Básico", "Defesa"]
  // Retorna mais habilidades para níveis mais altos
  const skillCount = Math.min(skills.length, Math.floor(level / 3) + 1)
  return skills.slice(0, skillCount)
}

function calculateHP(level: number, constitution: number, className: string): number {
  const hitDiceByClass: Record<string, number> = {
    Bárbaro: 12,
    Guerreiro: 10,
    Paladino: 10,
    Ranger: 10,
    Clérigo: 8,
    Druida: 8,
    Monge: 8,
    Ladino: 8,
    Bardo: 8,
    Feiticeiro: 6,
    Mago: 6,
    Bruxo: 8,
  }

  const hitDie = hitDiceByClass[className] || 8
  const conModifier = calculateHPModifier(constitution)

  // Primeiro nível: máximo do dado + modificador
  let hp = hitDie + conModifier

  // Níveis subsequentes: média do dado + modificador
  for (let i = 2; i <= level; i++) {
    hp += Math.floor(hitDie / 2) + 1 + conModifier
  }

  return Math.max(hp, level) // Mínimo de 1 HP por nível
}

export function generateNPC(level: number, race?: string, className?: string): NPC {
  const selectedRace = race || getRandomItem(RACES)
  const selectedClass = className || getRandomItem(CLASSES)
  const name = getRandomItem(NAMES)
  const personality = getRandomItem(PERSONALITIES)

  // Gera atributos usando 4d6 descartando menor
  const attributeRolls = generateAttributes()
  const attributes: Attributes = {
    for: attributeRolls[0].result,
    des: attributeRolls[1].result,
    con: attributeRolls[2].result,
    int: attributeRolls[3].result,
    sab: attributeRolls[4].result,
    car: attributeRolls[5].result,
  }

  // Calcula HP baseado na classe e constituição
  const hp = calculateHP(level, attributes.con, selectedClass)

  // Obtém habilidades baseadas na classe
  const skills = getClassSkills(selectedClass, level)

  return {
    id: generateId(),
    name,
    race: selectedRace,
    class: selectedClass,
    level,
    hp,
    attributes,
    skills,
    personality,
    notes: `NPC gerado automaticamente. ${personality}.`,
  }
}
