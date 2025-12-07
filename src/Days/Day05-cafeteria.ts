import { getDataLines } from "../utils";

/**
 * Compacts fresh ID ranges by merging overlapping or adjacent ranges.
 *
 * @param {[number, number][]} freshRanges Array of `[start, end]` ranges.
 * @returns {[number, number][]} Array of compacted `[start, end]` ranges.
 */
const compactFreshRanges = (
  freshRanges: [number, number][]
): [number, number][] => {
  freshRanges.sort((a, b) => a[0] - b[0]);
  const compactedFreshRanges: [number, number][] = [freshRanges[0]];

  for (let i = 1; i < freshRanges.length; i++) {
    const [currentStart, currentEnd] = freshRanges[i];
    const [lastStart, lastEnd] =
      compactedFreshRanges[compactedFreshRanges.length - 1];

    if (currentStart <= lastEnd + 1) {
      // Overlapping or adjacent ranges, merge them
      compactedFreshRanges[compactedFreshRanges.length - 1] = [
        lastStart,
        Math.max(lastEnd, currentEnd),
      ];
    } else {
      // Non-overlapping range, add it
      compactedFreshRanges.push([currentStart, currentEnd]);
    }
  }

  return compactedFreshRanges;
};

/**
 * Processes input lines to extract fresh ID ranges and available IDs.
 *
 * @param {string[]} lines Array of input lines.
 * @returns {[number, number][], number[]} Tuple containing compacted fresh
 * `[start, end]` ID ranges and available IDs.
 */
const processLines = (lines: string[]): [[number, number][], number[]] => {
  const freshIdRanges: [number, number][] = [];
  const availableIds: number[] = [];
  for (const line of lines) {
    if (line.includes("-")) {
      const [start, end] = line.split("-");
      freshIdRanges.push([parseInt(start), parseInt(end)]);
    } else {
      if (line.length > 0) {
        availableIds.push(parseInt(line));
      }
    }
  }
  return [compactFreshRanges(freshIdRanges), availableIds];
};

const [freshIdRanges, availableIds] = processLines(getDataLines());

/**
 * Counts how many available IDs are in the fresh ranges.
 *
 * @returns {number} The count of available IDs that are fresh.
 */
const cafeteriaPart1 = (): number => {
  return availableIds.reduce((acc, availableId) => {
    return freshIdRanges.some(
      ([start, end]) => availableId >= start && availableId <= end
    )
      ? acc + 1
      : acc;
  }, 0);
};

/**
 * Calculates the total number of fresh IDs across all ranges.
 *
 * @returns {number} The total count of fresh IDs.
 */
const cafeteriaPart2 = (): number => {
  return freshIdRanges.reduce(
    (acc, [start, end]) => acc + (end - start + 1),
    0
  );
};

console.log("Part 1:", cafeteriaPart1());
console.log("Part 2:", cafeteriaPart2());
