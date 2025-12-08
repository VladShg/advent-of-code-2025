import { logResults } from "./utils"
import * as fs from "fs"

type Point = [number, number, number] // x,y,z


const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
    Math.pow(p1[1] - p2[1], 2) +
    Math.pow(p1[2] - p2[2], 2)
  )
}

let key = (p: Point) => `${p[0]},${p[1]},${p[2]}`

let connect = (p1: Point, p2: Point, map: Map<string, number>, circuits: number[]) => {
  const k1 = key(p1), k2 = key(p2);

  if (map.has(k1) && map.has(k2)) {
    const c1 = map.get(k1)!, c2 = map.get(k2)!;
    if (c1 === c2) return;
    circuits[c1] += circuits[c2];
    circuits[c2] = 0;
    for (let [k, c] of map) {
      if (c === c2) map.set(k, c1);
    }
  } else if (!map.has(k1) && !map.has(k2)) {
    circuits.push(2)
    map.set(k1, circuits.length - 1)
    map.set(k2, circuits.length - 1)
  } else if (map.has(k1)) {
    circuits[map.get(k1)!]++;
    map.set(k2, map.get(k1)!)
  } else {
    circuits[map.get(k2)!]++;
    map.set(k1, map.get(k2)!)
  }
}


// Part 1
const getDistances = (points: Point[]): number => {
  let circuits: number[] = [];
  let map = new Map<string, number>();
  let distances: [number, Point, Point][] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      distances.push([distance(points[i], points[j]), points[i], points[j]])
    }
  }
  distances = distances.sort((d1, d2) => d1[0] - d2[0])
  for (let i = 0; i < Math.min(1000, distances.length); i++) {
    connect(distances[i][1], distances[i][2], map, circuits)
  }
  circuits = circuits.filter(c => c > 0).sort((c1, c2) => c2 - c1)
  return circuits[0] * (circuits?.[1] ?? 1) * (circuits?.[2] ?? 1);
}

const getEarliestPoint = (points: Point[]): number => {
  let circuits: number[] = [];
  let map = new Map<string, number>();
  let distances: [number, Point, Point][] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      distances.push([distance(points[i], points[j]), points[i], points[j]])
    }
  }
  distances = distances.sort((d1, d2) => d1[0] - d2[0])
  for (let i = 0; i < Math.min(distances.length); i++) {
    connect(distances[i][1], distances[i][2], map, circuits)
    if (map.size === points.length) {
      return distances[i][1][0] * distances[i][2][0]
    }
  }
  return -1
}

const text = fs.readFileSync("./inputs/day8.txt", "utf-8")
const points = text.split('\r\n').map(item => item.split(',').map(n => parseInt(n)) as Point)

logResults(
  () => getDistances(points),
  () => getEarliestPoint(points)
)
