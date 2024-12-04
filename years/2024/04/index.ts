import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { Grid, Cell, directions, Direction, Dir } from '../../../util/grid';

const YEAR = 2024;
const DAY = 4;

// solution path: C:\projects\advent-of-code\years\2024\04\index.ts
// data path    : C:\projects\advent-of-code\years\2024\04\data.txt
// problem url  : https://adventofcode.com/2024/day/4
async function p2024day4_part1(input: string, ...params: any[]) {
	let count = 0;

	const grid = new Grid({ serialized: input })
	const xCells = grid.getCells('X');

	for(const xCell of xCells) {
		for(const dir of directions) {
			if(cellStartsWord(xCell, 'xmas', dir)) count++;
		}
	}

	return count;
}

async function p2024day4_part2(input: string, ...params: any[]) {
	let count = 0;

	const grid = new Grid({ serialized: input })
	const aCells = grid.getCells('A');
	const cellsToCheck = aCells.map((aCell) => [
		{ cell: aCell.move('northwest', 1), direction: 'southeast'},
		{ cell: aCell.move('northeast', 1), direction: 'southwest'},
		{ cell: aCell.move('southwest', 1), direction: 'northeast'},
		{ cell: aCell.move('southeast', 1), direction: 'northwest'}
	]).map(group => group.filter(entry => !!entry.cell)) as { cell: Cell, direction: Direction }[][];

	for(const group of cellsToCheck) {
		let groupCount = 0;
		for(const entry of group) {
			if(cellStartsWord(entry.cell, 'mas', entry.direction)) groupCount++;
			if(groupCount > 1) break;
		}

		if(groupCount > 1) count++;
	}

	return count;
}

function cellStartsWord(cell: Cell, word: string, direction: Direction): boolean {
	const wordToCheck = word.toLowerCase();
	if(!cell.canMoveInDirection(direction, word.length - 1)) return false;

	for(let i = 0; i < word.length; i++) {
		if(cell.move(direction, i)!.value.toLowerCase() !== wordToCheck[i]) {
			return false;
		}
	}

	return true;
}

async function run() {
	const part1tests: TestCase[] = [{
		input: 'MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX',
		expected: '18'
	}];
	const part2tests: TestCase[] = [{
		input: 'MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX',
		expected: '9'
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2024, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
