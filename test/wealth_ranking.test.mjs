import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

// Use the project's TypeScript compiler and Node's test runner without a new dependency.
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "wealth-ranking-test-"));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(
  process.execPath,
  [
    require.resolve("typescript/bin/tsc"),
    "src/entities/wealth_ranking/lib/to_wealth_ranking_result.ts",
    "--outDir",
    output,
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--strict",
    "--skipLibCheck",
    "--esModuleInterop",
  ],
  { cwd: new URL("..", import.meta.url), stdio: "pipe" },
);
const { toWealthRankingResult } = require(
  join(output, "lib/to_wealth_ranking_result.js"),
);

const chartIds = ["chart-a", "chart-b"];
function fixture(ids = [...chartIds].reverse()) {
  return {
    productCode: "wealth-ranking",
    schemaVersion: 1,
    ranking: ids.map((chartId, index) => ({
      rank: index + 1,
      chartId,
      displayName: "동명이인",
      fortune: `${index + 1}위의 한 문장 재물운이에요.`,
      quality: "complete",
      warnings: [],
    })),
    rationale: "참여자들의 사주를 비교한 근거예요.",
    notice: "오락용 사주 풀이예요.",
  };
}

test("preserves the server ranking even with reversed input and duplicate names", () => {
  const result = toWealthRankingResult(fixture(), chartIds);
  assert.deepEqual(
    result.ranking.map((entry) => entry.chartId),
    ["chart-b", "chart-a"],
  );
  assert.equal(result.ranking[0].fortune, "1위의 한 문장 재물운이에요.");
  assert.equal(result.rationale, fixture().rationale);
  assert.equal(result.notice, fixture().notice);
});

test("keeps calculation uncertainty and warnings with the correct participant", () => {
  const value = fixture();
  value.ranking[0].quality = "partial";
  value.ranking[0].warnings = [
    { code: "BIRTH_TIME_UNKNOWN", message: "출생시간 미상" },
  ];
  const result = toWealthRankingResult(value, chartIds);
  assert.equal(result.ranking[0].isPartial, true);
  assert.deepEqual(result.ranking[0].calculationNotes, ["출생시간 미상"]);
  assert.equal(result.ranking[1].isPartial, false);
});

test("supports the maximum five participants", () => {
  const ids = ["a", "b", "c", "d", "e"];
  assert.equal(toWealthRankingResult(fixture(ids), ids).ranking.length, 5);
});

for (const [name, change] of [
  ["missing participant", (value) => value.ranking.pop()],
  [
    "duplicate participant",
    (value) => (value.ranking[1].chartId = value.ranking[0].chartId),
  ],
  [
    "unrequested participant",
    (value) => (value.ranking[0].chartId = "foreign-chart"),
  ],
  ["wrong rank order", (value) => value.ranking.reverse()],
  ["unsupported schema", (value) => (value.schemaVersion = 2)],
  ["wrong product", (value) => (value.productCode = "detailed-saju")],
  ["empty fortune", (value) => (value.ranking[0].fortune = " ")],
  [
    "overlong fortune",
    (value) => (value.ranking[0].fortune = "가".repeat(141)),
  ],
  ["overlong rationale", (value) => (value.rationale = "가".repeat(601))],
  ["missing notice", (value) => delete value.notice],
  ["invalid quality", (value) => (value.ranking[0].quality = "unknown")],
  ["invalid warning", (value) => (value.ranking[0].warnings = [null])],
]) {
  test(`rejects ${name} instead of showing a fabricated result`, () => {
    const value = fixture();
    change(value);
    assert.throws(() => toWealthRankingResult(value, chartIds));
  });
}

test("rejects invalid group sizes and duplicate request IDs", () => {
  assert.throws(() => toWealthRankingResult(fixture(["a"]), ["a"]));
  const ids = ["a", "b", "c", "d", "e", "f"];
  assert.throws(() => toWealthRankingResult(fixture(ids), ids));
  assert.throws(() => toWealthRankingResult(fixture(), ["chart-a", "chart-a"]));
});
