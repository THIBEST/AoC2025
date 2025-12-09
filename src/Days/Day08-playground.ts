import { getDataLines } from "../utils";

class Position {
  public x: number;
  public y: number;
  public z: number;

  constructor(line: string) {
    [this.x, this.y, this.z] = line.split(",").map((num) => parseInt(num, 10));
  }
}

interface PointDistance {
  points: [Position, Position];
  distance: number;
}

const positions: Position[] = getDataLines().map((line) => new Position(line));

/**
 * Computes the distance between two positions.
 * This is done in three dimensions.
 *
 * @see {@link PointDistance}
 * @param {Position} pos1 First position.
 * @param {Position} pos2 Second position.
 * @returns {PointDistance} An object containing the two positions and their
 * distance.
 */
const calcPointDistance = (pos1: Position, pos2: Position): PointDistance => {
  return {
    points: [pos1, pos2],
    distance: Math.sqrt(
      (pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2 + (pos2.z - pos1.z) ** 2
    ),
  };
};

/**
 * Computes the distances between all points.
 *
 * @see {@link PointDistance}
 * @returns {PointDistance[]} An array of objects containing the two positions
 * and their distance.
 */
const calcAllPointDistances = (): PointDistance[] => {
  const res: PointDistance[] = [];
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    for (let j = i + 1; j < positions.length; j++) {
      res.push(calcPointDistance(start, positions[j]));
    }
  }
  return res.toSorted((a, b) => a.distance - b.distance);
};

const allPointDistances: PointDistance[] = calcAllPointDistances();

/**
 * Search the index of the circuits containing a specific junction box.
 * We give its position and search it in the circuits.
 *
 * @param {Position[][]} circuits All the circuits. A circuit contains junction
 * boxes.
 * @param {Position} pos The position of the searched junction box.
 * @returns {number} The index of the circuit containing the junction box, or
 * -1 if not found.
 */
const findIndexInCircuit = (circuits: Position[][], pos: Position): number => {
  return circuits.findIndex((circuit) =>
    circuit.some((p) => p.x === pos.x && p.y === pos.y && p.z === pos.z)
  );
};

/**
 *
 * @param {PointDistance[]} distances All the distances between points.
 * @returns {{circuits: Position[][]; lastJunction: [Position, Position];}} An
 * object containing every circuits created (`circuits`), and the coordinates
 * of the two last junction boxes that were connected (`lastJunction`).
 */
const createCircuits = (
  distances: PointDistance[]
): {
  circuits: Position[][];
  lastJunction: [Position, Position];
} => {
  const circuits: Position[][] = [];
  let lastJunction: [Position, Position] = distances[0].points;

  for (let distance of distances) {
    const [pos1, pos2] = distance.points;
    const index1 = findIndexInCircuit(circuits, pos1);
    const index2 = findIndexInCircuit(circuits, pos2);

    // New circuit.
    if (index1 === -1 && index2 === -1) {
      circuits.push([pos1, pos2]);
      continue;
    }

    // Both points are in the same circuit, we do nothing.
    if (index1 === index2) {
      continue;
    }

    lastJunction = [pos1, pos2];

    // The first point is already in a circuit, we add the second one to it.
    if (index2 === -1) {
      circuits[index1].push(pos2);
      continue;
    }

    // The second point is already in a circuit, we add the first one to it.
    if (index1 === -1) {
      circuits[index2].push(pos1);
      continue;
    }

    // Each point is in a different circuit, we combine them into a single one.
    circuits[index1].push(...circuits[index2]);
    circuits.splice(index2, 1);
  }

  return { circuits, lastJunction };
};

/**
 * Creates the wanted number of shortest connections between junction boxes.
 * Then, creates the associated circuits and returns the product of the sizes
 * of the three largest circuits.
 *
 * @param {number} [nthClosest=10] The number of closest distances to consider.
 * Defaults to 10.
 * @returns {number} The product of the sizes of the three largest circuits.
 */
const playgroundPart1 = (nthClosest = 10): number => {
  const distances: PointDistance[] = allPointDistances.slice(0, nthClosest);

  const circuits = createCircuits(distances).circuits.sort(
    (a, b) => b.length - a.length
  );

  return circuits[0].length * circuits[1].length * circuits[2].length;
};

/**
 * Connects every single junction boxes and returns the product of the x
 * coordinates of the two last junction boxes that were connected.
 *
 * @returns {number} The product of the x coordinates of the two last junction
 * boxes that were connected.
 */
const playgroundPart2 = (): number => {
  const distances: PointDistance[] = allPointDistances;

  const { lastJunction } = createCircuits(distances);

  return lastJunction[0].x * lastJunction[1].x;
};

console.log(playgroundPart1(1000));
console.log(playgroundPart2());
