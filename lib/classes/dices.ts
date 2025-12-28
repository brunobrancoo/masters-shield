import { DiceType, RollResult } from "../interfaces/dice-roll";

export interface AttributeRoll {
  rolls: number[];
  result: number;
}

export class DiceRoller {
  diceType: number;
  constructor(diceType: number) {
    this.diceType = diceType;
  }

  roll(times: number): RollResult {
    const diceType = `d${this.diceType}` as DiceType;
    const rolls: number[] = [];
    for (let i = 0; i < times; i++) {
      rolls.push(Math.ceil(Math.random() * this.diceType));
    }
    return {
      type: diceType,
      rolls: rolls,
      total: rolls.reduce((acc, roll) => roll + acc, 0),
    };
  }

  generateAttributes(): AttributeRoll[] {
    const attributes: AttributeRoll[] = [];

    for (let i = 0; i <= 6; i++) {
      const rollResult = this.roll(4);
      const row = [...rollResult.rolls];
      row.sort().reverse();
      row.pop(); // Remove o menor

      attributes.push({
        rolls: row,
        result: rollResult.total,
      });
    }
    attributes.sort((a, b) => a.result - b.result);
    attributes.shift();

    return attributes;
  }
}
