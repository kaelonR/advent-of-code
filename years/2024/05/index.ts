import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 5;

// solution path: C:\projects\advent-of-code\years\2024\05\index.ts
// data path    : C:\projects\advent-of-code\years\2024\05\data.txt
// problem url  : https://adventofcode.com/2024/day/5
async function p2024day5_part1(input: string, ...params: any[]) {
  const { orderingRules, updateRecords } = parseInput(input);
  const orderingRulesByPage = groupOrderingRulesByPageNumber(orderingRules);

  const correctlyOrderedRecords = updateRecords.filter(record => updateIsValid(orderingRulesByPage, record));
  return correctlyOrderedRecords.reduce((score, record) => score + record[Math.floor(record.length / 2)], 0);
}

async function p2024day5_part2(input: string, ...params: any[]) {
  const { orderingRules, updateRecords } = parseInput(input);
  const orderingRulesByPage = groupOrderingRulesByPageNumber(orderingRules);

  const incorrectlyOrderedRecords = updateRecords.filter(record => !updateIsValid(orderingRulesByPage, record));
  const correctlyOrderedRecords = incorrectlyOrderedRecords.map(record => reorderUpdateRecord(orderingRulesByPage, record));

  return correctlyOrderedRecords.reduce((score, record) => score + record[Math.floor(record.length / 2)], 0);
}

function parseInput(input: string): { orderingRules: Array<[number, number]>, updateRecords: Array<number[]> } {
  const orderingRules: Array<[number, number]> = []
  const updateRecords: Array<number[]> = []

  const lines = input.split('\n');
  let phase: 'orderingRules' | 'updateRecords' = 'orderingRules'

  for(const line of lines) {
    if(line.length === 0) phase = 'updateRecords'
    else if(phase === 'orderingRules') {
      const parts = line.split('|', 2);
      orderingRules.push([Number.parseInt(parts[0], 10), Number.parseInt(parts[1], 10)])
    } else if (phase === 'updateRecords') {
      updateRecords.push(line.split(',').map(x => Number.parseInt(x, 10)))
    }
  }

  return { orderingRules, updateRecords }
}

type RelativePageOrdering = { comesBefore: Set<number>, comesAfter: Set<number> }
function groupOrderingRulesByPageNumber(orderingRules: Array<[number, number]>) {
  const orderingRulesByPage: Record<number,RelativePageOrdering> = {};

  for(const orderingRule of orderingRules) {
    orderingRulesByPage[orderingRule[0]] = orderingRulesByPage[orderingRule[0]] || { comesBefore: new Set(), comesAfter: new Set() };
    orderingRulesByPage[orderingRule[1]] = orderingRulesByPage[orderingRule[1]] || { comesBefore: new Set(), comesAfter: new Set() };

    orderingRulesByPage[orderingRule[0]].comesAfter.add(orderingRule[1])
    orderingRulesByPage[orderingRule[1]].comesBefore.add(orderingRule[0])
  }

  return orderingRulesByPage;
}

function updateIsValid(orderingRulesByPage: Record<number, RelativePageOrdering>, updateRecord: number[]): boolean {
  const pageIndices = updateRecord.reduce(
    (acc, page, i) => { acc[page] = i; return acc;},
    {} as Record<number, number>);

  for(let i = 0; i < updateRecord.length; i++) {
    const page = updateRecord[i]
    const orderingRules = orderingRulesByPage[page];

    for(const pageThatMustComeBefore of orderingRules.comesBefore) {
      if(pageIndices[pageThatMustComeBefore] > i) return false;
    }
    for(const pageThatMustComeAfter of orderingRules.comesAfter) {
      if(pageIndices[pageThatMustComeAfter] < i) return false;
    }
  }

  return true;
}

function reorderUpdateRecord(orderingRulesByPage: Record<number, RelativePageOrdering>, updateRecord: number[]): number[] {
  updateRecord.sort((a, b) => {
    if (!orderingRulesByPage[a]) return 0;

    return orderingRulesByPage[a].comesBefore.has(b) ? -1 : 1;
  })

  return updateRecord;
}

async function run() {
  const part1tests: TestCase[] = [{
    input: '47|53\n97|13\n97|61\n97|47\n75|29\n61|13\n75|53\n29|13\n97|29\n53|29\n61|53\n97|53\n61|29\n|13\n75|47\n97|75\n47|61\n75|61\n47|29\n75|13\n53|13\n' +
      '\n' +
      '75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47',
    expected: '143'
  }];
  const part2tests: TestCase[] = [{
    input: part1tests[0].input,
    expected: '123'
  }];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day5_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day5_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day5_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now()
  const part2Solution = String(await p2024day5_part2(input));
  const part2After = performance.now();

  logSolution(5, 2024, part1Solution, part2Solution);

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
