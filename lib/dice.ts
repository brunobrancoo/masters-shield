export function rollDice(times: number): number | number[] {
  const rolls: number[] = []
  for (let i = 0; i < times; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1)
  }
  if (rolls.length === 1) return rolls[0]
  return rolls
}

export interface AttributeRoll {
  rolls: number[]
  result: number
}

export function generateAttributes(): AttributeRoll[] {
  const attributes: AttributeRoll[] = []

  for (let i = 0; i < 6; i++) {
    const rollResult = rollDice(4) as number[]
    const row = [...rollResult]
    row.sort().reverse()
    row.pop() // Remove o menor

    attributes.push({
      rolls: row,
      result: row.reduce((acc, item) => item + acc, 0),
    })
  }

  return attributes
}

export function calculateHPModifier(constitution: number): number {
  return Math.floor((constitution - 10) / 2)
}
