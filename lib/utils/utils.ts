import type { Item } from "@/lib/interfaces/interfaces";

export function rollItemDamage(item: Item): { rolls: number[]; total: number } | null {
  if (!item.damage) return null;

  const rolls: number[] = [];
  let diceCount = 0;
  let dieSize = 6;

  if (item.damageLegacy?.dice && item.damageLegacy?.number) {
    diceCount = item.damageLegacy.dice;
    dieSize = item.damageLegacy.number;
  } else if (item.damage.damage_dice) {
    const match = item.damage.damage_dice.match(/(\d+)d(\d+)/);
    if (match) {
      diceCount = parseInt(match[1], 10);
      dieSize = parseInt(match[2], 10);
    }
  }

  if (diceCount === 0 || dieSize === 0) return null;

  for (let i = 0; i < diceCount; i++) {
    rolls.push(Math.floor(Math.random() * dieSize) + 1);
  }
  const total = rolls.reduce((sum, r) => sum + r, 0);
  return { rolls, total };
}

export function formatDamageRoll(rolls: number[], total: number, damageType?: string): string {
  return `Rolando:\n${rolls.join(" + ")} = ${total}${damageType ? ` ${damageType}` : ""}`;
}

export function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : value.toString();
}

export function calculateHPChange(current: number, delta: number, max: number): number {
  return Math.max(0, Math.min(max, current + delta));
}

export function toggleSlotValue(current: number, target: number): number {
  return current === target ? 0 : target;
}
