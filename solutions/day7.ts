import { logResults } from "./utils"
import * as fs from "fs"



// Part 1
const getBeamSplits = (rows: string[]): number => {
  let count = 0;

  let visual = rows.map(val => val.split(''))
  let trace: number[][] = rows.map(() => new Array<number>(rows[0].length))
  const entry = rows[0].indexOf('S');

  function sendBeam(row: number, col: number) {
    for (let i = row; i < rows.length; i++) {
      if (trace[i][col] === 1) return
      trace[i][col] = 1
      if (rows[i][col] === '^') {
        count++;
        if (col < rows[0].length - 1) sendBeam(i + 1, col + 1)
        if (col > 0) sendBeam(i + 1, col - 1)
        break
      }
      visual[i][col] = '|'
    }
  }

  sendBeam(1, entry);

  return count;
}

const getBeamPathsDP = (rows: string[]): number => {
  const trace: (string | number)[][] = rows.map(row => row.split(''));
  let curr = trace[0];

  for (let row of trace.slice(1)) {
    for (let [col, cell] of row.entries()) {
      const above = curr[col];
      if (above === 'S' && cell === '.') {
        row[col] = 1;
      } else if (typeof above === 'number' && cell === '.') {
        row[col] = above;
      } else if (typeof above === 'number' && typeof cell === 'number') {
        (row[col] as number) += above;
      } else if (cell === '^' && typeof above === 'number') {
        if (col > 0) {
          if (row[col - 1] === '.') {
            row[col - 1] = above;
          } else if (typeof row[col - 1] === 'number') {
            (row[col - 1] as number) += above;
          }
        }
        if (col < row.length - 1) {
          if (row[col + 1] === '.') {
            row[col + 1] = above;
          } else if (typeof row[col + 1] === 'number') {
            (row[col + 1] as number) += above;
          }
        }
      }
    }

    curr = row;
  }

  return curr
    .filter(cell => typeof cell === 'number')
    .reduce((total, count) => total + (count as number), 0);
}

const text = fs.readFileSync("./inputs/day7.txt", "utf-8")
const rows = text.split('\r\n')

logResults(
  () => getBeamSplits(rows),
  () => getBeamPathsDP(rows)
)
