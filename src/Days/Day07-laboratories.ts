import { getDataLines } from "../utils";

const originalLines: string[][] = getDataLines().map((line) => line.split(""));
const lineLength = originalLines[0].length;

/**
 * Counts the number of times a tachyon beam is split.
 * A tachyon beam is split when it encounters a splitter ("^").
 *
 * @returns {number} The number of tachyon beam splits.
 */
const laboratoriesPart1 = (): number => {
  const lines = originalLines.map((row) => [...row]);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < lineLength; j++) {
      const char = line[j];
      const upperChar = lines[i - 1][j];
      switch (char) {
        case ".":
          switch (upperChar) {
            case "S":
              lines[i][j] = "|";
              break;
            case "|":
              lines[i][j] = "|";
              break;
            case "^":
              // Nothing to do in this case.
              break;
            default:
              break;
          }
          break;
        case "^":
          if (upperChar === "|") {
            if (j > 0) {
              lines[i][j - 1] = "|";
            }
            if (j < lineLength - 1) {
              lines[i][j + 1] = "|";
            }
          } else {
            // Nothing to do otherwise.
          }
          break;
        case "|":
          // Nothing to do in this case.
          break;
        case "S":
          // Nothing to do in this case.
          break;
        default:
          break;
      }
    }
  }

  let forks = 0;
  for (let i = 1; i < lines.length; i++) {
    for (let j = 0; j < lineLength; j++) {
      const char = lines[i][j];
      if (char === "^" && lines[i - 1][j] === "|") {
        forks++;
      }
    }
  }
  return forks;
};

/**
 * Counts the number of different timelines a single tachyon beam particle ends
 * on (because of quantum logic).
 *
 * @returns {number} The number of different timelines.
 */
const laboratoriesPart2 = (): number => {
  const lines = originalLines.map((row) => [...row]);
  const startingCol = lines[0].findIndex((c) => c === "S");

  const res = Array.from({ length: lines.length }, () =>
    Array.from({ length: lineLength }, () => 0)
  );
  res[0][startingCol] = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < lineLength; j++) {
      const char = line[j];
      switch (char) {
        case ".":
          res[i][j] += res[i - 1][j];
          break;
        case "^":
          const upper = res[i - 1][j];
          if (j > 0) {
            res[i][j - 1] += upper;
          }
          if (j < lineLength - 1) {
            res[i][j + 1] += upper;
          }
          break;
        default:
          break;
      }
    }
  }
  return res[res.length - 1].reduce((acc, val) => acc + val);
};

console.log(laboratoriesPart1());
console.log(laboratoriesPart2());
