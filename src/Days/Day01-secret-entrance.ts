import { getDataLines, modulo } from "../utils";

const lines = getDataLines();

/**
 * Computes the number of times the dial of the safe reached exactly 0.
 *
 * @returns The number of times the dial of the safe reached exactly 0.
 */
const secretEntrancePart1 = () => {
  let currentPosition = 50;
  return lines.reduce((acc, line) => {
    const direction = line.charAt(0);
    const steps = parseInt(line.slice(1));
    currentPosition = modulo(
      currentPosition + (direction === "L" ? -steps : steps),
      100
    );

    return acc + (currentPosition === 0 ? 1 : 0);
  }, 0);
};

/**
 * Computes the number of times the dial of the safe passed by 0.
 *
 * @returns The number of times the dial of the safe passed by 0.
 */
const secretEntrancePart2 = (): number => {
  let currentPosition = 50;

  return lines.reduce((acc, line) => {
    const direction = line.charAt(0);
    const steps = parseInt(line.slice(1));
    const move = direction === "L" ? -1 : 1;

    const newPosition = currentPosition + move * steps;

    if (move > 0) {
      acc += Math.floor(newPosition / 100) - Math.floor(currentPosition / 100);
    } else {
      // -1 to manage the case where we currently are at 0.
      acc +=
        Math.floor((currentPosition - 1) / 100) -
        Math.floor((newPosition - 1) / 100);
    }

    currentPosition = modulo(newPosition, 100);

    return acc;
  }, 0);
};

console.log("Part 1:", secretEntrancePart1());
console.log("Part 2:", secretEntrancePart2());
