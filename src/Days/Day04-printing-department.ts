import { getDataLines } from "../utils";

const lines = getDataLines();
const linesLength = lines.length - 1;
const lineLength = lines[0].length - 1;

/**
 * Gets the neighbors of a given position.
 *
 * @param {number} x The x coordinate of the position.
 * @param {number} y The y coordinate of the position.
 * @returns {number[][]} An array of the neighbors of the position.
 */
const getNeighbors = (x: number, y: number): number[][] => {
  return [
    [x, y - 1], // left
    [x - 1, y - 1], // top left
    [x - 1, y], // top
    [x - 1, y + 1], // top right
    [x, y + 1], // right
    [x + 1, y + 1], // bottom right
    [x + 1, y], // bottom
    [x + 1, y - 1], // bottom left
  ].filter(
    ([nx, ny]) => nx >= 0 && nx <= linesLength && ny >= 0 && ny <= lineLength
  );
};

/**
 * Checks if a given position is bordered by at least 4 "@" neighbors.
 *
 * @param {number} x The x coordinate of the position.
 * @param {number} y The y coordinate of the position.
 * @returns {boolean} `true` if the position is bordered by at least 4 "@"
 * neighbors, `false` otherwise.
 */
const checkBorders = (x: number, y: number): boolean => {
  return (
    getNeighbors(x, y).reduce(
      (acc, [nx, ny]) => (lines[nx][ny] === "@" ? acc + 1 : acc),
      0
    ) < 4
  );
};

/**
 * Counts the number of paper rolls that can be removed.
 *
 * @param {boolean} [shouldRemove=false] - Whether to remove the paper rolls.
 * @returns {number} The number of paper rolls that can be removed.
 */
const printingDepartmentPart1 = (shouldRemove = false): number => {
  let totalPaperRolls = 0;

  for (let i = 0; i <= linesLength; i++) {
    for (let j = 0; j <= lineLength; j++) {
      const pos = lines[i][j];
      if (pos === "@" && checkBorders(i, j)) {
        totalPaperRolls++;
        if (shouldRemove) {
          lines[i] = `${lines[i].substring(0, j)}.${lines[i].substring(j + 1)}`;
        }
      }
    }
  }

  return totalPaperRolls;
};

/**
 * Counts the number of paper rolls that can be removed.
 * When a paper roll is removable, it is removed and the process is repeated.
 *
 * @returns {number} The number of paper rolls that can be removed.
 */
const printingDepartmentPart2 = (): number => {
  let totalPaperRolls = 0;

  let howManyNew = 0;
  do {
    howManyNew = printingDepartmentPart1(true);
    totalPaperRolls += howManyNew;
  } while (howManyNew > 0);

  return totalPaperRolls;
};

console.log("Part 1:", printingDepartmentPart1());
console.log("Part 2:", printingDepartmentPart2());
