import { readFileSync } from "fs";

/**
 * Gets the data lines from the input file.
 *
 * @returns {string[]} An array of the data lines.
 */
const getDataLines = (): string[] => {
  return readFileSync("input.txt", "utf-8").split("\n");
};

/**
 * Computes the modulo of a number.
 *
 * @param {number} n The number to compute the modulo of.
 * @param {number} m The modulo.
 * @returns {number} The modulo of the number.
 */
const modulo = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

/**
 * Returns the maximum value in an array and its index.
 *
 * @param {number[]} arr - The array to search.
 * @returns {{max: number, maxIndex: number}} An object containing the maximum value and its index.
 */
const getMaxValAndIndexInArray = (
  arr: number[]
): { max: number; maxIndex: number } => {
  const max = Math.max(...arr);
  const maxIndex = arr.indexOf(max);
  return { max, maxIndex };
};

export { getDataLines, modulo, getMaxValAndIndexInArray };
