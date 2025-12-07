import { readFileSync } from "fs";

export type Operator = "+" | "-" | "*" | "/" | "%";

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

/**
 * Performs the specified operation on the given values.
 *
 * @param {number[]} values - The numbers to operate on.
 * @param {Operator} operator - The operation to perform (+, *...).
 * @returns {number} The result of the operation.
 */
const doOperation = (values: number[], operator: Operator): number => {
  switch (operator) {
    case "+":
      return values.reduce((a, b) => a + b);
    case "-":
      return values.reduce((a, b) => a - b);
    case "*":
      return values.reduce((a, b) => a * b);
    case "/":
      return values.reduce((a, b) => a / b);
    case "%":
      return values.reduce((a, b) => a % b);
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};

export { doOperation, getDataLines, getMaxValAndIndexInArray, modulo };
