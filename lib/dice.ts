import { DiceRoll } from "./interfaces/dice-roll";

function rollDice({ dice, times }: DiceRoll): number | number[] {
  const rolls: number[] = [];
  for (let i = 0; i < times; i++) {
    rolls.push(Math.floor(Math.random() * dice) + 1);
  }
  if (rolls.length === 1) return rolls[0];
  return rolls;
}

export interface AttributeRoll {
  rolls: number[];
  result: number;
}

export function generateAttributes(): AttributeRoll[] {
  const attributes: AttributeRoll[] = [];

  for (let i = 0; i <= 6; i++) {
    const diceRoll: DiceRoll = { dice: 6, times: 4 };
    const rollResult = rollDice(diceRoll) as number[];
    const row = [...rollResult];
    row.sort().reverse();
    row.pop(); // Remove o menor

    attributes.push({
      rolls: row,
      result: row.reduce((acc, item) => item + acc, 0),
    });
  }
  attributes.sort((a, b) => a.result - b.result);
  attributes.shift();

  return attributes;
}

export function calculateHPModifier(constitution: number): number {
  return Math.floor((constitution - 10) / 2);
}

// export function rollDices(dices: number[], times: number[]) {
//   let rolls : number | number[] = []
//   for (let i = 0; i < dices.length; i++) {
//     rolls.push(rollDice({ dice: dices[i], times: times[i] }))
//   }
// }
