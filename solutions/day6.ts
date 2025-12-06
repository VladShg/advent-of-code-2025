import { logResults } from "./utils"
import * as fs from "fs"

const text = fs.readFileSync("./inputs/day6.txt", "utf-8")
const opIndex = /[\+\*]/g.exec(text)?.index!

// Part 1
const getHomeworkSum = (values: number[], operators: string[]): number => {
  let columns: number[] = []
  for (let i = 0; i < operators.length; i++) {
    columns[i] = values[i]
  }
  for (let i = operators.length; i < values.length; i++) {
    const index = i % operators.length
    if (operators[index] === "+") {
      columns[index] += values[i]
    } else {
      columns[index] *= values[i]
    }
  }

  return columns.reduce((acc, curr) => acc + curr, 0)
}

// Part 2

// first iteration - left to right
const getHomeworkSumVerticalLTR = (rows: string[], operators: string): number => {
  let sum = 0
  let column = 0
  let operator = ""
  for (let i = 0; i < operators.length; i++) {
    if (!operator) {
      operator = operators[i]
    }
    let number = ""
    for (let j = 0; j < rows.length; j++) {
      if (rows[j][i] !== " ") number += rows[j][i]
    }
    if (number === "") continue
    if (operators[i] !== " " && i !== 0) {
      sum += column
      column = 0
      operator = operators[i]
    }
    if (column === 0) {
      column = parseInt(number)
    } else if (operator === "*") {
      column *= parseInt(number)
    } else {
      column += parseInt(number)
    }
  }
  return sum + column
}

// changed to rtl since its cleaner, but slower than first iteration because of arrays
const getHomeworkVertical = (rows: string[], operators: string): number => {
  let sum = 0
  let numbers: number[] = []
  let currentOperator = ''

  for (let i = operators.length - 1; i >= 0; i--) {
    const operator = operators[i]

    let number = ''
    for (let j = 0; j < rows.length; j++) {
      if (rows[j][i] && rows[j][i] !== ' ') {
        number += rows[j][i]
      }
    }
    if (number) {
      numbers.push(parseInt(number))
    }

    if (operator !== " ") {
      currentOperator = operator
      sum += currentOperator === '+'
        ? numbers.reduce((acc, curr) => acc + curr, 0)
        : numbers.reduce((acc, curr) => acc * curr, 1)
      numbers = []
    }
  }

  return sum
}
const values = text
  .slice(0, opIndex)
  .replaceAll(/\s+/g, " ")
  .replace(/\s$/g, "")
  .split(" ")
  .map((item) => parseInt(item))
const operators = text
  .slice(opIndex)
  .replaceAll(/\s+/g, " ")
  .replace(/\s$/g, "")
  .split(" ")

const rows = text.slice(0, opIndex - 2).split("\r\n")
const operatorRow = text.slice(opIndex)

logResults(
  () => getHomeworkSum(values, operators),
  () => getHomeworkVertical(rows, operatorRow)
)
