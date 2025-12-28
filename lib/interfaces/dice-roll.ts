export interface DiceRoll {
  dice: number;
  times: number;
}

export type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

export interface RollResult {
  type: DiceType;
  rolls: number[];
  total: number;
}
