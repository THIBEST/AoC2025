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

interface PointArea {
  area: number;
  points: Point[];
}

const points: Point[] = getDataLines().map((line) => new Point(line));
const pointAreas: PointArea[] = [];

/**
 * Computes the area of a rectangle defined by two points.
 *
 * @param {Point} p1 The first point.
 * @param {Point} p2 The second point.
 * @returns {number} The area of the rectangle.
 */
const calcAreaWithTwoPoints = (p1: Point, p2: Point): number => {
  // +1 to include both points.
  const width = Math.abs(p1.x - p2.x) + 1;
  // +1 to include both points.
  const height = Math.abs(p1.y - p2.y) + 1;
  return width * height;
};

/**
 * Computes the largest area of any rectangle that can be formed by two points.
 * Also stores all the possible areas in the {@link pointAreas} array.
 *
 * @returns {number} The largest area.
 */
const movieTheaterPart1 = (): number => {
  if (points.length < 2) {
    return 0;
  }

  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const point2 = points[j];
      const area = calcAreaWithTwoPoints(point1, point2);
      pointAreas.push({
        area,
        points: [point1, point2],
      });

      maxArea = Math.max(maxArea, area);
    }
  }
  return maxArea;
};

/**
 * Checks if a point is "inside" a given edge.
 * For example, if the edge is "left", the point is inside if its x coordinate
 * is greater than the value.
 *
 * @param {Point} point The point to check.
 * @param {Edge} edge The edge to check against.
 * @param {number} value The "value" of the edge (to extend infinitely
 * vertically or horizontally depending on the edge).
 * @returns {boolean} `true` if the point is inside the edge, `false` otherwise.
 */
const isInside = (point: Point, edge: Edge, value: number): boolean => {
  switch (edge) {
    case "left":
      return point.x > value;
    case "right":
      return point.x < value;
    case "bottom":
      return point.y > value;
    case "top":
      return point.y < value;
  }
};

/**
 * Computes the intersection point of two lines defined by two points,
 * clipped with an edge.
 *
 * @param {Point} point1 The first point of the first line.
 * @param {Point} point2 The second point of the first line.
 * @param {Edge} edge The edge to clip with.
 * @param {number} value The value of the edge.
 * @returns {Point} The intersection point.
 */
const computeIntersection = (
  point1: Point,
  point2: Point,
  edge: Edge,
  value: number
): Point => {
  let dx = point2.x - point1.x;
  let dy = point2.y - point1.y;

  let x, y;
  switch (edge) {
    case "left":
    case "right":
      x = value;
      y = point1.y + (dy * (x - point1.x)) / dx;
      break;
    case "bottom":
    case "top":
      y = value;
      x = point1.x + (dx * (y - point1.y)) / dy;
      break;
  }
  return { x, y };
};

/**
 * Clips a polygon with an edge.
 *
 * @param {Point[]} polygon The polygon to clip.
 * @param {Edge} edge The edge to clip the polygon with.
 * @param {number} val The value of the edge.
 * @returns {Point[]} The clipped polygon.
 */
const clipPolygonWithEdge = (
  polygon: Point[],
  edge: Edge,
  val: number
): Point[] => {
  const newPolygon: Point[] = [];
  const numberOfEdges = polygon.length;

  for (let i = 0; i < numberOfEdges; i++) {
    const currentPoint = polygon[i];
    const prevPoint = polygon[(i + numberOfEdges - 1) % numberOfEdges];

    const currentInside = isInside(currentPoint, edge, val);
    const prevInside = isInside(prevPoint, edge, val);

    if (currentInside) {
      if (!prevInside) {
        // Entering the edge: add intersection.
        newPolygon.push(
          computeIntersection(prevPoint, currentPoint, edge, val)
        );
      }
      // Add current vertex.
      newPolygon.push(currentPoint);
    } else if (prevInside) {
      // Leaving the edge: add intersection.
      newPolygon.push(computeIntersection(prevPoint, currentPoint, edge, val));
    } else {
      // Both points are outside.
      // Do nothing.
    }
  }

  return newPolygon;
};

/**
 * Clips a polygon by a rectangle.
 *
 * @param {Point[]} polygon The polygon to clip.
 * @param {Rectangle} rect The rectangle to clip the polygon by.
 * @returns {Point[]} The clipped polygon.
 */
const clipPolygonByRectangle = (polygon: Point[], rect: Rectangle): Point[] => {
  let clipped = [...polygon];
  clipped = clipPolygonWithEdge(clipped, "left", rect.xmin);
  clipped = clipPolygonWithEdge(clipped, "top", rect.ymax);
  clipped = clipPolygonWithEdge(clipped, "right", rect.xmax);
  clipped = clipPolygonWithEdge(clipped, "bottom", rect.ymin);
  return clipped;
};

/**
 * Creates a rectangle from two points.
 *
 * @param {Point} point1 The first point.
 * @param {Point} point2 The second point.
 * @returns {Rectangle} The rectangle created from the two points.
 */
const createRectangle = (point1: Point, point2: Point): Rectangle => {
  const minx = Math.min(point1.x, point2.x);
  const miny = Math.min(point1.y, point2.y);
  const maxx = Math.max(point1.x, point2.x);
  const maxy = Math.max(point1.y, point2.y);
  return new Rectangle(minx, miny, maxx, maxy);
};

/**
 * Computes the area of a polygon.
 *
 * @param {Point[]} polygon The polygon to compute the area of.
 * @returns {number} The area of the polygon.
 */
const calcPolygonArea = (polygon: Point[]): number => {
  const xmin = Math.min(...polygon.map((point: Point) => point.x));
  const ymin = Math.min(...polygon.map((point: Point) => point.y));
  const xmax = Math.max(...polygon.map((point: Point) => point.x));
  const ymax = Math.max(...polygon.map((point: Point) => point.y));
  return (xmax - xmin + 1) * (ymax - ymin + 1);
};

/**
 * Computes the largest possible rectangle area inside the polygon formed by all
 * the points.
 *
 * This is done by using the {@link https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm Sutherland–Hodgman algorithm}.
 * It is adapted to be used in "reverse". Instead of clipping the rectangle to
 * the polygon, the polygon is clipped to the rectangle. We do this because the
 * polygon is not convex but concave. Since the rectangles are convex, we can
 * do it the other way.
 *
 * To optimise it further, we sort the points by area in descending order.
 *
 * @returns {number} The largest rectangle area inside the polygon.
 */
const movieTheaterPart2 = (): number => {
  pointAreas.sort((a, b) => b.area - a.area);

  for (const order of pointAreas) {
    const rect = createRectangle(order.points[0], order.points[1]);
    const clippedPolygon = clipPolygonByRectangle(points, rect);
    if (
      clippedPolygon.length === 4 &&
      calcPolygonArea(clippedPolygon) === order.area
    ) {
      return order.area;
    }
  }

  return 0;
};

console.log("movieTheaterPart1: ", movieTheaterPart1());
console.log("movieTheaterPart2V2", movieTheaterPart2());
