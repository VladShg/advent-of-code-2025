import * as fs from "fs"

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

const input = fs.readFileSync("./solutions/input.txt", "utf-8")
const shifts = input.toString().split("\r\n")

// console.log(getSafeCode(shifts))

console.log(getSafeClicks(shifts))
