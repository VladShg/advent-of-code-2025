import { logResults } from "./utils"
import * as fs from "fs"

type Point = [number, number] // x,y

const square = (p1: Point, p2: Point) => {
  return (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1)
}

// Part 1
const getLargestSquare = (points: Point[]): number => {
  let max = 0
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      max = Math.max(max, square(points[j], points[i]))
    }
  }
  return max
}

type Edge = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const sort = (a: number, b: number): [number, number] => {
  if (a < b) {
    return [a, b];
  } else {
    return [b, a];
  }
};

const rectangleArea = (x1: number, y1: number, x2: number, y2: number): number => {
  return (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
};

const manhattanDistance = (a: Point, b: Point): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const getLargestRectanglePart2 = (points: Point[]): number => {
  let result = 0;

  const redTiles: Point[] = [];
  const edges: Edge[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [fX, fY] = points[i];
    const [tX, tY] = points[i + 1];
    edges.push({ x1: fX, y1: fY, x2: tX, y2: tY });
    redTiles.push([fX, fY], [tX, tY]);
  }
  const [initX, initY] = points[0];
  const [lastX, lastY] = points[points.length - 1];
  edges.push({ x1: initX, y1: initY, x2: lastX, y2: lastY });

  // AABB collision detection
  const intersections = (minX: number, minY: number, maxX: number, maxY: number): boolean => {
    for (const edge of edges) {
      const [iMinX, iMaxX] = sort(edge.x1, edge.x2);
      const [iMinY, iMaxY] = sort(edge.y1, edge.y2);
      if (minX < iMaxX && maxX > iMinX && minY < iMaxY && maxY > iMinY) {
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < redTiles.length - 1; i++) {
    for (let j = i; j < redTiles.length; j++) {
      const fromTile = redTiles[i];
      const toTile = redTiles[j];

      const [minX, maxX] = sort(fromTile[0], toTile[0]);
      const [minY, maxY] = sort(fromTile[1], toTile[1]);

      const manhattanDist = manhattanDistance(fromTile, toTile);
      if (manhattanDist * manhattanDist > result) {
        if (!intersections(minX, minY, maxX, maxY)) {
          const area = rectangleArea(fromTile[0], fromTile[1], toTile[0], toTile[1]);
          if (area > result) {
            result = area;
          }
        }
      }
    }
  }

  return result;
};

const text = fs.readFileSync("./inputs/day9.txt", "utf-8")
const points = text
  .split("\r\n")
  .map((item) => item.split(",").map((n) => parseInt(n)) as Point)

logResults(
  () => getLargestSquare(points),
  () => getLargestRectanglePart2(points)
)
