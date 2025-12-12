import { logResults } from "./utils"
import * as fs from "fs"

type Present = {
  area: number;
  shape: [string, string, string]
}

type Region = {
  x: number;
  y: number;
  presents: number[]
}

const filterSuitableZones = (regions: Region[], presents: Present[]) => {
  let areas = 0;
  for (let region of regions) {
    let requiredArea = region.presents.reduce((acc, curr, index) => acc + curr * presents[index].area, 0)
    if (requiredArea > region.x * region.y) continue

    let total = region.presents.reduce((acc, curr) => acc + curr, 0)
    for (let y = 0; y + 3 <= region.y; y += 3) {
      for (let x = 0; x + 3 <= region.x; x += 3) {
        total--;
      }
    }
    if (total <= 0) { areas++ }
  }
  return areas
}



const text = fs.readFileSync("./inputs/day12.txt", "utf-8")
const outputs = text.split("\r\n\r\n")

const presents = outputs.slice(0, 6).map(block => {
  const rows = block.split('\r\n')
  const shape = rows.slice(1)
  const area = shape.join('').split('').reduce((acc, curr) => acc + (curr === '#' ? 1 : 0), 0)
  return {
    area, shape
  } as Present
});

const regions = outputs[6].split('\r\n').map(item => {
  const [bounds, presents] = item.split(': ')
  const [x, y] = bounds.split('x').map(i => parseInt(i))

  return {
    presents: presents.split(' ').map(i => parseInt(i)),
    x, y
  } as Region
})


logResults(
  () => filterSuitableZones(regions, presents),
  () => -1
)
