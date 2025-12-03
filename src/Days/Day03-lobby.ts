import { getDataLines, getMaxValAndIndexInArray } from "../utils";

const lines = getDataLines();

/**
 * Computes the voltage from a battery.
 *
 * @param {number[]} arr The battery as an array of numbers.
 * @param {number} howMany The number of digits to consider.
 * @returns {string} The voltage of the battery.
 */
const getVoltage = (arr: number[], howMany: number): string => {
  if (!howMany) {
    return "";
  }
  if (howMany === 1) {
    return getMaxValAndIndexInArray(arr).max.toString();
  }
  howMany--;
  const { max, maxIndex } = getMaxValAndIndexInArray(arr.slice(0, -howMany));
  return max.toString() + getVoltage(arr.slice(maxIndex + 1), howMany);
};

/**
 * Computes the sum of the voltages of all batteries.
 * We want a voltage of 2 digits.
 *
 * @returns {number} The sum of the voltages of all batteries.
 */
const lobbyPart1 = (): number =>
  lines.reduce((acc, line) => {
    let arr = line.split("").map(Number);
    return acc + parseInt(getVoltage(arr, 2), 10);
  }, 0);

/**
 * Computes the sum of the voltages of all batteries.
 * We want a voltage of 12 digits.
 *
 * @returns {number} The sum of the voltages of all batteries.
 */
const lobbyPart2 = (): number =>
  lines.reduce((acc, line) => {
    let arr = line.split("").map(Number);
    return acc + parseInt(getVoltage(arr, 12), 10);
  }, 0);

console.log("Part 1:", lobbyPart1());
console.log("Part 2:", lobbyPart2());
