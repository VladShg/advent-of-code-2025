import * as fs from "fs"
import { logResults } from "./utils"

// Part 1
const getInvalidIds = (ranges: [number, number][]): number => {
  let sum = 0
  let invalid: string[] = []

  for (const [start, end] of ranges) {
    for (let i = start; i <= end; i++) {
      const key = i.toString()
      if (key.length % 2 !== 0) continue
      if (key.slice(0, key.length / 2) === key.slice(key.length / 2)) {
        invalid.push(key)
        sum += i
      }
    }
  }

  return sum
}

// Part 2
const getInvalidGroupIds = (ranges: [number, number][]): number => {
  let sum = 0
  for (const [start, end] of ranges) {
    for (let i = start; i <= end; i++) {
      const id = i.toString()
      for (let pattern = Math.floor(id.length / 2); pattern >= 1; pattern--) {
        if (id.length % pattern !== 0) continue

        if (id.slice(0, pattern).repeat(id.length / pattern) === id) {
          sum += i
          break
        }
      }
    }
  }
  return sum
}

const input = fs.readFileSync("./inputs/day2.txt", "utf-8")
const keys = input.toString().split(",")
const ranges = keys.map(
  (val) => val.split("-").map((v) => Number.parseInt(v)) as [number, number]
)

logResults(
  () => getInvalidIds(ranges),
  () => getInvalidGroupIds(ranges)
)
