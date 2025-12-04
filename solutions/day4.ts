import { logResults } from "./utils"
import * as fs from "fs"

// Part 1
const getPaperRolls = (d: string[]): number => {
  let rolls = 0

  for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < d[row].length; col++) {
      if (d[row][col] !== "@") continue
      let neighbors = 0

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          if (d?.[row + dr]?.[col + dc] === "@") {
            neighbors++
          }
        }
      }

      if (neighbors < 4) {
        rolls++
      }
    }
  }

  return rolls
}

// Part 2
const getPaperRollsContinuos = (d: string[]): number => {
  const countNeighbors = (row: number, col: number): number => {
    let neighbors = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        if (mappedDiagram?.[row + dr]?.[col + dc] === "@") {
          neighbors++
        }
      }
    }
    return neighbors
  }

  const markNeighbors = (row: number, col: number): void => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = row + dr
        const nc = col + dc
        if (mappedDiagram?.[nr]?.[nc] === "@") {
          weights[nr][nc]--
        }
      }
    }
  }

  let rolls = 0
  let looseRolls: [number, number][] = []
  let mappedDiagram = Array.from(d).map((i) => i.split(""))
  const weights = new Array(d.length)
    .fill(0)
    .map(() => new Array(d[0].length).fill(0))

  let payload: [number, number][] = []
  for (let row = 0; row < d.length; row++) {
    for (let col = 0; col < d[row].length; col++) {
      if (d[row][col] !== "@") continue
      let neighbors = countNeighbors(row, col)

      if (neighbors < 4) {
        payload.push([row, col])
      } else {
        looseRolls.push([row, col])
      }
      weights[row][col] = neighbors
    }
  }

  while (payload.length) {
    payload.forEach(([row, col]) => {
      rolls++
      markNeighbors(row, col)
    })

    payload = []
    looseRolls = looseRolls.filter(([row, col]) => {
      if (weights[row][col] < 4) {
        payload.push([row, col])
        return false
      }
      return true
    })
  }

  return rolls
}

const input = fs.readFileSync("./inputs/day4.txt", "utf-8")
const keys = input.toString().split("\r\n")

logResults(
  () => getPaperRolls(keys),
  () => getPaperRollsContinuos(keys)
)
