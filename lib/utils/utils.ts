import type { Item } from "@/lib/interfaces/interfaces";

export function rollItemDamage(item: Item): { rolls: number[]; total: number } | null {
  if (!item.damage) return null;
  const rolls: number[] = [];
  for (let i = 0; i < item.damage.dice; i++) {
    rolls.push(Math.floor(Math.random() * item.damage.number) + 1);
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
