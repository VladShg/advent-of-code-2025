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
