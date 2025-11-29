export interface Attributes {
  for: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export const attributeKeys: (keyof Attributes)[] = [
  "for",
  "des",
  "con",
  "int",
  "sab",
  "car",
];
