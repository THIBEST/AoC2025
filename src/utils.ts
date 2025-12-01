import { readFileSync } from "fs";

/**
 * Gets the data lines from the input file.
 *
 * @returns An array of the data lines.
 */
const getDataLines = (): string[] => {
  return readFileSync("input.txt", "utf-8").split("\n");
};

/**
 * Computes the modulo of a number.
 *
 * @param n The number to compute the modulo of.
 * @param m The modulo.
 * @returns The modulo of the number.
 */
const modulo = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

export { getDataLines, modulo };
