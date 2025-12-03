import { logResults } from "./utils"
import * as fs from 'fs';

// Part 1
const getJoltage = (banks: string[]): number => {
	let sum = 0;
	for (let bank of banks) {
		let first = -1, last = -1;
		for (let i = 0; i < bank.length - 1; i++) {
			if (first === -1 || bank[i] > bank[first]) first = i
		}
		for (let i = first + 1; i < bank.length; i++) {
			if (first !== i && (last === -1 || bank[i] > bank[last])) last = i
		}
		sum += parseInt(`${bank[first]}${bank[last]}`)
	}

	return sum
}

// Part 2
const getArrayJoltage = (banks: string[], arraySize = 12): number => {
	let sum = 0;
	for (let bank of banks) {
		const array: number[] = [];
		for (let pos = 0; pos < arraySize; pos++) {
			const start = array.length ? array[array.length - 1] + 1 : 0;
			const end = bank.length - (arraySize - array.length) + 1;
			let max = start;
			for (let j = start + 1; j < end; j++) {
				if (bank[j] > bank[max]) {
					max = j;
				}
			}
			array.push(max);
		}
		sum += parseInt(array.map(idx => bank[idx]).join(''));
	}

	return sum;
};

const input = fs.readFileSync("./inputs/day3.txt", "utf-8")
const keys = input.toString().split("\r\n")

logResults(
	() => getJoltage(keys),
	() => getArrayJoltage(keys)
)