import { getDataLines } from "../utils";

type Edge = "left" | "right" | "top" | "bottom";

class Rectangle {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;

  constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
    this.xmin = xmin;
    this.ymin = ymin;
    this.xmax = xmax;
    this.ymax = ymax;
  }
}

class Point {
  x: number;
  y: number;

  constructor(line: string) {
    [this.x, this.y] = line.split(",").map((num) => parseInt(num, 10));
  }
}

const positions = getDataLines().map((line) => new Point(line));

const calcRectArea = (rect: Point[]): number => {
  const xmin = Math.min(...rect.map((p) => p.x));
  const ymin = Math.min(...rect.map((p) => p.y));
  const xmax = Math.max(...rect.map((p) => p.x));
  const ymax = Math.max(...rect.map((p) => p.y));
  return (xmax - xmin + 1) * (ymax - ymin + 1);
};

const movieTheaterPart1 = (): number => {
  let maxArea = 0;
  for (let i = 0; i < positions.length; i++) {
    const pos1 = positions[i];
    for (let j = i + 1; j < positions.length; j++) {
      const pos2 = positions[j];
      const area = calcRectArea([pos1, pos2]);
      maxArea = Math.max(maxArea, area);
    }
  }
  return maxArea;
};

const isInside = (p: Point, edge: Edge, value: number): boolean => {
  switch (edge) {
    case "left":
      return p.x > value;
    case "right":
      return p.x < value;
    case "bottom":
      return p.y > value;
    case "top":
      return p.y < value;
  }
};

const computeIntersection = (
  p1: Point,
  p2: Point,
  edge: Edge,
  value: number
): Point => {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;

  let x;
  let y;
  switch (edge) {
    case "left":
    case "right":
      x = value;
      y = p1.y + (dy * (x - p1.x)) / dx;
      break;
    case "bottom":
    case "top":
      y = value;
      x = p1.x + (dx * (y - p1.y)) / dy;
      break;
  }
  return { x, y };
};

const clipPolygonWithEdge = (
  polygon: Point[],
  edge: Edge,
  val: number
): Point[] => {
  const newPolygon: Point[] = [];
  const numberOfEdges = polygon.length;

  for (let i = 0; i < numberOfEdges; i++) {
    const current = polygon[i];
    const prev = polygon[(i + numberOfEdges - 1) % numberOfEdges];

    const currentInside = isInside(current, edge, val);
    const prevInside = isInside(prev, edge, val);

    if (currentInside) {
      if (!prevInside) {
        // entering: add intersection
        newPolygon.push(computeIntersection(prev, current, edge, val));
      }
      // add current vertex
      newPolygon.push(current);
    } else if (prevInside) {
      // leaving: add intersection
      newPolygon.push(computeIntersection(prev, current, edge, val));
    }
  }

  return newPolygon;
};

const clipPolygonByRectangle = (polygon: Point[], rect: Rectangle): Point[] => {
  let clipped = [...polygon];
  clipped = clipPolygonWithEdge(clipped, "left", rect.xmin);
  clipped = clipPolygonWithEdge(clipped, "top", rect.ymax);
  clipped = clipPolygonWithEdge(clipped, "right", rect.xmax);
  clipped = clipPolygonWithEdge(clipped, "bottom", rect.ymin);
  return clipped;
};

const createRectangle = (pos1: Point, pos2: Point): Rectangle => {
  const minx = Math.min(pos1.x, pos2.x);
  const miny = Math.min(pos1.y, pos2.y);
  const maxx = Math.max(pos1.x, pos2.x);
  const maxy = Math.max(pos1.y, pos2.y);
  return new Rectangle(minx, miny, maxx, maxy);
};

const movieTheaterPart2 = (): number => {
  let maxArea = 0;
  let n = positions.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const rect = createRectangle(positions[i], positions[j % n]);
      const clippedPolygon = clipPolygonByRectangle(positions, rect);
      if (clippedPolygon.length === 4) {
        maxArea = Math.max(maxArea, calcRectArea(clippedPolygon));
      }
    }
  }
  return maxArea;
};

console.log("movieTheaterPart1: ", movieTheaterPart1());
console.log("movieTheaterPart2: ", movieTheaterPart2());
