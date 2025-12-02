import { getDataLines } from "../utils";

const line = getDataLines()[0];
const intervals = line.split(",");

/**
 * Computes the sum of all numbers in the intervals that have a repeating
 * pattern. A number has a repeating pattern if it can be split into two equal
 * parts, and both parts are identical.
 * An interval can be 95-115. In this interval, 99 is the only repeating
 * pattern.
 *
 * @returns {number} The sum of all numbers in the intervals that have a
 * repeating pattern.
 */
const giftShopPart1 = (): number => {
  console.time("giftShopPart1");
  return intervals.reduce((acc, interval) => {
    const [start, end] = interval.split("-").map((s) => parseInt(s));
    let current = start;

    while (current <= end) {
      // If we on a number with an odd number of digits, we skip to the next
      // even-length number.
      if (current.toString().length % 2 !== 0) {
        /*
        We go to the next number with an even number of digits.
        The +1 is to prevent the edge case where we are on the last number
        with an odd number of digits.
        For example, if we are on 100:
        Math.log10(100) = 2, Math.ceil(2) = 2, 10 ** 2 = 100.
        We would not go to the next even-length number.
        But, if we use 101 (100 + 1):
        Math.log10(101) = 2.00432, Math.ceil(2.00432) = 3, 10 ** 3 = 1000.
        We go to the next even-length number.
        */
        current = 10 ** Math.ceil(Math.log10(current + 1));
        continue;
      }

      const currentStr = current.toString();
      const halfLength = currentStr.length / 2;
      if (currentStr.slice(0, halfLength) === currentStr.slice(halfLength)) {
        acc += current;
      }
      current++;
    }
    return acc;
  }, 0);
};

/**
 * Checks if a string has a repeating pattern.
 *
 * @param {string} str The string to check.
 * @returns {boolean} `true` if the string has a repeating pattern, `false` otherwise.
 */
const isRepeatedPattern = (str: string): boolean => {
  if (str.length === 0) return false;

  // Try all possible pattern lengths. We only need to check up to half the string length.
  for (
    let patternLength = 1;
    patternLength <= str.length / 2;
    patternLength++
  ) {
    // Check if the string length is divisible by the pattern length.
    if (str.length % patternLength !== 0) {
      continue;
    }

    const pattern = str.substring(0, patternLength);
    let isMatch = true;

    // Check if the pattern repeats throughout the string.
    for (let i = patternLength; i < str.length; i += patternLength) {
      if (str.substring(i, i + patternLength) !== pattern) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return true;
    }
  }

  return false;
};

/**
 * Computes the sum of all numbers in the intervals that have a repeating
 * pattern. A number has a repeating pattern if it can be split onto a
 * "subnumber" that is repeated until the end of the number.
 * An interval can be 95-115. In this interval, 99 and 111 are the only
 * repeating patterns.
 *
 * @returns {number} The sum of all numbers in the intervals that have a
 * repeating pattern.
 */
const giftShopPart2 = (): number => {
  return intervals.reduce((acc, interval) => {
    const [start, end] = interval.split("-").map((s) => parseInt(s));
    let current = start;
    while (current <= end) {
      const currentNumberString = current.toString();
      if (isRepeatedPattern(currentNumberString)) {
        acc += current;
      }
      current++;
    }
    return acc;
  }, 0);
};

console.log("Part 1:", giftShopPart1());
console.log("Part 2:", giftShopPart2());
