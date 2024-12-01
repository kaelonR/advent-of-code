import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 1;

// solution path: C:\projects\advent-of-code\years\2024\01\index.ts
// data path    : C:\projects\advent-of-code\years\2024\01\data.txt
// problem url  : https://adventofcode.com/2024/day/1

async function p2024day1_part1(input: string, ...params: any[]) {
	const [list1, list2] = parseData(input);

	return list1.reduce((totalDistance, n, i) => totalDistance + Math.abs(n - list2[i]), 0)
}

async function p2024day1_part2(input: string, ...params: any[]) {
	const [list1, list2] = parseData(input);
	const countMap = listToCountMap(list2);

	return list1.reduce((similarityScore, n) => similarityScore + n * (countMap[n] ?? 0), 0);
}

function parseData(input: string): [number[], number[]] {
	const lines = input.split('\n');
	const list1: number[] = [];
	const list2: number[] = [];

	for(const line of lines) {
		const [id1, id2] = line.split(' ').filter(x => x).map(x => Number.parseInt(x, 10));
		list1.push(id1);
		list2.push(id2);
	}

	return [list1.sort(), list2.sort()]
}

function listToCountMap(list: number[]): Record<number, number> {
	const map: Record<number, number> = {};

	list.forEach(n => {
		map[n] = (map[n] ?? 0) + 1;
	})

	return map;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2024, part1Solution, part2Solution);

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
