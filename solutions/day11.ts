import { logResults } from "./utils"
import * as fs from "fs"

type Path = [string, string[]]

// Part 1
const getPaths = (paths: Path[], entry = 'you'): number => {
  const outputs = new Map<string, string[]>()
  paths.forEach(([root, output]) => {
    outputs.set(root, output)
  })

  const traverse = (node: string, visited: Set<string>): number => {
    if (node === "out") return 1
    const neighbors = outputs.get(node)
    if (!neighbors) return 0

    let count = 0
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        count += traverse(neighbor, visited)
        visited.delete(neighbor)
      }
    }
    return count
  }

  return traverse(entry, new Set([entry]))
}

// Part 2
const getMatchingPaths = (paths: Path[], entry = 'svr'): number => {
  const outputs = new Map<string, string[]>()
  paths.forEach(([root, output]) => {
    outputs.set(root, output)
  })

  const memo = new Map<string, number>()

  const traverse = (
    node: string, 
    visited: Set<string>,
    hasFft: boolean,
    hasDac: boolean
  ): number => {
    if (node === "out") {
      return (hasFft && hasDac) ? 1 : 0
    }

    const cacheKey = `${node},${hasFft},${hasDac}`
    if (memo.has(cacheKey)) {
      return memo.get(cacheKey)!
    }

    const neighbors = outputs.get(node)
    if (!neighbors) return 0

    let count = 0
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        count += traverse(
          neighbor, 
          visited,
          hasFft || neighbor === 'fft',
          hasDac || neighbor === 'dac'
        )
        visited.delete(neighbor)
      }
    }
    
    memo.set(cacheKey, count)
    return count
  }

  return traverse(entry, new Set([entry]), entry === 'fft', entry === 'dac')
}

const text = fs.readFileSync("./inputs/day11.txt", "utf-8")
const outputs = text.split("\r\n")
const paths = outputs.map((o) => {
  const [root, paths] = o.split(": ")
  return [root, paths.split(" ")] as Path
})

logResults(
  () => getPaths(paths),
  () => getMatchingPaths(paths)
)
