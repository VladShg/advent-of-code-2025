import * as fs from "fs"
import { logResults } from "./utils"

// Part 1
const getSafeCode = (sequence: string[], start = 50): number => {
  let answer = 0
  let current = start
  for (let i = 0; i < sequence.length; i++) {
    const [dir, step] = [sequence[i][0], parseInt(sequence[i].slice(1))]
    if (dir === "L") {
      current -= step
    } else {
      current += step
    }
    current = ((current % 100) + 100) % 100
    if (current === 0) answer++
  }
  return answer
}

// Part 2
const getSafeClicks = (sequence: string[], start = 50): number => {
  let answer = 0
  let current = start

  for (const line of sequence) {
    const dir = line[0]
    const step = parseInt(line.slice(1), 10)

    if (dir === "R") {
      answer += Math.floor((current + step) / 100)
      current = (current + step) % 100
    } else {
      const distanceTo0 = current || 100
      if (step >= distanceTo0) {
        answer += 1 + Math.floor((step - distanceTo0) / 100)
      }
      current = (((current - step) % 100) + 100) % 100
    }
  }

  return answer
}

const input = fs.readFileSync("./inputs/day1.txt", "utf-8")
const shifts = input.toString().split("\r\n")

logResults(
  () => getSafeCode(shifts),
  () => getSafeClicks(shifts)
)
