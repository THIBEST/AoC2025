import { readFileSync } from "fs";

/**
 * Gets the data lines from the input file.
 *
 * @returns An array of the data lines.
 */
const getDataLines = (): string[] => {
  return readFileSync("input.txt", "utf-8").split("\n");
};

export { getDataLines };
