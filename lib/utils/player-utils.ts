export function calculateModifier(value: number) {
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod.toString();
}

export const getHPColor = (hp: number, maxHp: number) => {
  if (maxHp === 0) return "";
  const percentage = (hp / maxHp) * 100;
  if (percentage <= 20) return "text-red-600";
  if (percentage <= 50) return "text-yellow-500";
  return "text-green-600";
};

export const getHPBackgroundColor = (hp: number, maxHp: number) => {
  if (maxHp === 0) return "";
  const percentage = (hp / maxHp) * 100;
  if (percentage <= 20) return "bg-red-600/10 border-red-600/30";
  if (percentage <= 50) return "bg-yellow-500/10 border-yellow-500/30";
  return "bg-green-600/10 border-green-600/30";
};
