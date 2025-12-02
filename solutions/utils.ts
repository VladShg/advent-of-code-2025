export const nsToMs = (ns: bigint) => (Number(ns) / 1_000_000).toFixed(3)

export const measureTime = <T>(fn: () => T): [T, string] => {
  const start = process.hrtime.bigint()
  const result = fn()
  const end = process.hrtime.bigint()
  return [result, nsToMs(end - start)]
}

export const sumTimesMs = (times: string[]): string => {
  const totalNs = times.reduce(
    (sum, timeMs) => sum + BigInt(Math.round(parseFloat(timeMs) * 1_000_000)),
    BigInt(0)
  )
  return nsToMs(totalNs)
}

export const logResults = <T>(fn1: () => T, fn2: () => T): void => {
  const [part1, part1Time] = measureTime(() => fn1())
  const [part2, part2Time] = measureTime(() => fn2())
  
  console.group("=== Answers === ")
  console.log(`Part 1: ${part1} (${part1Time} ms)`)
  console.log(`Part 2: ${part2} (${part2Time} ms)`)
  console.log(`Total: ${sumTimesMs([part1Time, part2Time])} ms`)
  console.groupEnd()
}