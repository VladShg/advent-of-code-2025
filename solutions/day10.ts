import { logResultsAsync } from "./utils"
import * as fs from "fs"
import { init } from 'z3-solver';


type Machine = [string[], number[][], number[]]

const press = (lights: string[], buttons: number[]): string[] => {
  let updated = Array.from(lights)
  for (let b of buttons) {
    updated[b] = updated[b] === '#' ? '.' : '#';
  }
  return updated
}

// Part 1
const getMinPresses = (machines: Machine[]): number => {
  const bfs = (
    targetLights: string[],
    buttonSchematics: number[][]
  ): number => {
    const targetKey = targetLights.join('');
    const initialLights = targetLights.map(i => '.');
    const initialKey = initialLights.join('');

    if (initialKey === targetKey) {
      return 0;
    }

    const reachable = new Map<string, number>();
    reachable.set(initialKey, 0);

    const queue: string[] = [initialKey];
    let head = 0;

    while (head < queue.length) {
      const currentKey = queue[head++];
      const presses = reachable.get(currentKey)!;

      if (currentKey === targetKey) {
        return presses;
      }

      for (const button of buttonSchematics) {
        const nextLightsArr = press(currentKey.split(''), button);
        const nextKey = nextLightsArr.join('');
        const nextPresses = presses + 1;
        if (!reachable.has(nextKey)) {
          reachable.set(nextKey, nextPresses);
          queue.push(nextKey);
        }
      }
    }
    return Infinity;
  }

  let sum = 0;
  for (let machine of machines) {
    const minPresses = bfs(machine[0], machine[1])

    if (minPresses === Infinity) {
      console.error("Machine target is unreachable!");
      return Infinity;
    }
    sum += minPresses;
  }

  return sum
}


async function solveMinimumButtonPresses(machines: Machine[]): Promise<number> {
  const { Context } = await init();
  const { Solver, Int, Sum } = Context('main', {});

  let totalMinPresses = 0;

  for (const [lights, buttons, joltages] of machines) {
    const solver = new Solver();

    const buttonVars = buttons.map((_, i) => Int.const(`b${i}`));

    for (const btnVar of buttonVars) {
      solver.add(btnVar.ge(0));
    }

    for (let counter = 0; counter < joltages.length; counter++) {
      const targetJoltage = joltages[counter];

      const affectingButtons = buttons
        .map((btn, idx) => ({ btn, idx }))
        .filter(({ btn }) => btn.includes(counter))
        .map(({ idx }) => buttonVars[idx]);

      if (affectingButtons.length > 0) {
        // @ts-ignore
        solver.add(Sum(...affectingButtons).eq(targetJoltage));
      } else if (targetJoltage !== 0) {
        throw new Error(`Counter ${counter} cannot reach target ${targetJoltage}`);
      }
    }

    // @ts-ignore
    const totalPresses = Sum(...buttonVars);

    let minPresses = Infinity;
    let low = 0;
    let high = joltages.reduce((a, b) => a + b, 0) * 2;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      solver.push();
      solver.add(totalPresses.le(mid));

      const result = await solver.check();

      if (result === 'sat') {
        const model = solver.model();
        const actualPresses = buttonVars.reduce((sum, btnVar) => {
          return sum + Number(model.eval(btnVar).toString());
        }, 0);
        minPresses = Math.min(minPresses, actualPresses);
        high = mid - 1;
      } else {
        low = mid + 1;
      }

      solver.pop();
    }

    if (minPresses === Infinity) {
      throw new Error('No solution found for machine');
    }

    totalMinPresses += minPresses;
  }

  return totalMinPresses;
}

const text = fs.readFileSync("./inputs/day10.txt", "utf-8")
const machines = text.split("\r\n").map(m => {
  let items = m.split(' ')
  let lights = items[0].slice(1, items[0].length - 1).split('')
  let buttons = items.slice(1, items.length - 1).map(b => b.slice(1, b.length - 1).split(',').map(n => parseInt(n)))
  let joltage = items[items.length - 1].slice(1, items[items.length - 1].length - 1).split(',').map(n => parseInt(n))
  return [lights, buttons, joltage] as Machine
})

logResultsAsync(
  async () => getMinPresses(machines),
  async () => await solveMinimumButtonPresses(machines)
).then(console.log)