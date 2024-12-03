import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 3;

// solution path: C:\projects\advent-of-code\years\2024\03\index.ts
// data path    : C:\projects\advent-of-code\years\2024\03\data.txt
// problem url  : https://adventofcode.com/2024/day/3

async function p2024day3_part1(input: string, ...params: any[]) {
	let result = 0;

	let currentSearchIndex = input.indexOf('mul', 0);
	while (currentSearchIndex !== -1) {
		const parseResult = tryParseNumbersInstruction(input, currentSearchIndex + 3);
		if(parseResult.success) {
			result += parseResult.numbers.reduce((total, item) => total * item, 1);
			currentSearchIndex += parseResult.charactersParsed
		}

		currentSearchIndex = input.indexOf('mul', currentSearchIndex + 3)
	}

	return result;
}

async function p2024day3_part2(input: string, ...params: any[]) {
	let result = 0;
	let mulEnabled = true;

	for(let i = 0; i < input.length; i++) {
		if(input[i] === 'm' && mulEnabled && input.slice(i, i + 3) === 'mul') {
			const parseResult = tryParseNumbersInstruction(input, i + 3);
			if(parseResult.success) {
				result += parseResult.numbers.reduce((total, item) => total * item, 1);
				i += parseResult.charactersParsed + 2;
			}
		}

		else if(input[i] === 'd' && input.slice(i, i + 4) === 'do()') mulEnabled = true;
		else if(input[i] === 'd' && input.slice(i, i + 7) === 'don\'t()') mulEnabled = false;
	}

	return result;
}

type TryParseNumbersInstructionResult = { success: false } | { success: true, charactersParsed: number, numbers: number[]}
function tryParseNumbersInstruction(input: string, index: number): TryParseNumbersInstructionResult {
	if(input[index] !== '(') return { success: false };

	let numberStartIndex = index + 1;
	const numbers: number[] = [];
	for(let i = index + 1; i < input.length; i++) {
		if((input[i] < '0' || input[i] > '9') && (input[i] !== ',' && input[i] !== ')')) return { success: false };
		if(input[i] === ',' || input[i] === ')') {
			numbers.push(Number.parseInt(input.slice(numberStartIndex, i), 10));
			numberStartIndex = i + 1;
		}
		if(input[i] === ')') {
			return { success: true, charactersParsed: i - index, numbers }
		}
	}

	return { success: false };
}

async function run() {
	const part1tests: TestCase[] = [{
		input: 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))',
		expected: '161'
	}];
	const part2tests: TestCase[] = [{
		input: 'xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))',
		expected: '48'
	}];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2024day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2024, part1Solution, part2Solution);

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
