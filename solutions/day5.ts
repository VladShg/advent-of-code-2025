import { logResults } from "./utils"
import * as fs from "fs"

type Range = [number, number]

const mergeRanges = (ranges: Range[]): Range[] => {
  if (!ranges.length) return [];

  const sorted = ranges.sort((a, b) => a[0] - b[0]);
  const merged: Range[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    if (current[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push([...current]);
    }
  }

  return merged;
};

// Part 1
const getFreshItems = (ranges: Range[], items: number[]): number => {
  let count = 0;
  const flatRanges = mergeRanges(ranges);
  for (let item of items) {
    for (let range of flatRanges) {
      if (range[0] <= item && item <= range[1]) {
        count++
      }
    }
  }
  return count;
}

// Part 2
const getFreshRanges = (ranges: Range[]): number => {
  let count = 0;
  for (let range of mergeRanges(ranges)) {
    count += range[1] - range[0] + 1;
  }
  return count
}

const text = fs.readFileSync("./inputs/day5.txt", "utf-8")
const input: [string, string] = text.split('\r\n\r\n') as [string, string]
const [ranges, items] = [
  input[0].split('\r\n').map((v: string) => v.split('-').map(i => parseInt(i))) as Range[],
  input[1].split('\r\n').map(i => parseInt(i))
]


logResults(
  () => getFreshItems(ranges, items),
  () => getFreshRanges(ranges)
)
