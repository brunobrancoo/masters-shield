export function calculateModifier(value: number): string {
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod.toString();
}

export function calculateHPModifierValue(constitution: number): number {
  return Math.floor((constitution - 10) / 2);
}

export function recalculateHP(
  level: number,
  constitution: number,
  className: string,
  currentHP: number,
): number {
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
  };

  const hitDie = hitDiceByClass[className] || 8;
  const conModifier = calculateHPModifierValue(constitution);

  // Primeiro nível: máximo do dado + modificador
  let hp = hitDie + conModifier;

  // Níveis subsequentes: média do dado + modificador
  for (let i = 2; i <= level; i++) {
    hp += Math.floor(hitDie / 2) + 1 + conModifier;
  }

  return Math.max(hp, level);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function defaultSpellSlots() {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
}

