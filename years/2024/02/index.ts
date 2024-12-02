import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2024;
const DAY = 2;

// solution path: C:\projects\advent-of-code\years\2024\02\index.ts
// data path    : C:\projects\advent-of-code\years\2024\02\data.txt
// problem url  : https://adventofcode.com/2024/day/2
async function p2024day2_part1(input: string, ...params: any[]) {
  const reports = parseData(input);
  let safeReportCount = 0;

  reports.forEach(report => {
    const deltas = getDeltas(report);
    const errorCount = countErrors(deltas);
    if (errorCount == 0) safeReportCount++;
  });

  return safeReportCount;
}

async function p2024day2_part2(input: string, ...params: any[]) {
  const reports = parseData(input);
  let safeReportCount = 0;

  reports.forEach(report => {
    const deltas = getDeltas(report);
    const errorCount = countErrors(deltas);

    if (errorCount === 0 || isCaughtByErrorDampener(report)) {
      safeReportCount++;
    }
  });

  return safeReportCount;
}

function parseData(input: string): Array<number[]> {
  const lines = input.split("\n");
  const data = lines.map(line => line.split(" ").map(n => Number.parseInt(n)));
  return data;
}

function getDeltas(report: number[]): number[] {
  const deltas: number[] = [];
  for (let i = 0; i < report.length - 1; i++) {
    deltas.push(report[i + 1] - report[i]);
  }
  return deltas;
}

function countErrors(deltas: number[]): number {
  let errorCount = 0;

  for (let i = 0; i < deltas.length; i++) {
    if (deltas[i] < -3 || deltas[i] > 3 || deltas[i] === 0) errorCount++;
    else if (i < deltas.length - 1 && deltas[i] > 0 && deltas[i + 1] <= 0) errorCount++;
    else if (i < deltas.length - 1 && deltas[i] < 0 && deltas[i + 1] >= 0) errorCount++;
  }

  return errorCount;
}

function isCaughtByErrorDampener(report: number[]): boolean {
  for (let i = 0; i < report.length; i++) {
    const reportWithoutLevelAtIndex = [...report];
    reportWithoutLevelAtIndex.splice(i, 1);

    const errorCount = countErrors(getDeltas(reportWithoutLevelAtIndex));
    if (errorCount === 0) return true;
  }

  return false;
}

async function run() {
  const part1tests: TestCase[] = [
    {
      input: "7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9",
      expected: "2",
    },
  ];
  const part2tests: TestCase[] = [
    {
      input: "7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9",
      expected: "4",
    },
  ];

  const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of p1testsNormalized) {
      test.logTestResult(testCase, String(await p2024day2_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of p2testsNormalized) {
      test.logTestResult(testCase, String(await p2024day2_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2024day2_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2024day2_part2(input));
  const part2After = performance.now();

  logSolution(2, 2024, part1Solution, part2Solution);

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
