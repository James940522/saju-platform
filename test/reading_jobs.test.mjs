import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "reading-job-test-"));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(
  process.execPath,
  [
    require.resolve("typescript/bin/tsc"),
    "src/entities/reading_job/model/reading_job.ts",
    "--outDir",
    output,
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--strict",
    "--skipLibCheck",
  ],
  { cwd: new URL("..", import.meta.url), stdio: "pipe" },
);
const {
  toReadingJob,
  toReadingJobs,
  toReadingResult,
  isReadingPending,
} = require(join(output, "reading_job.js"));
const fixture = () => ({
  id: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
  productCode: "wealth-ranking",
  status: "queued",
  stage: "queued",
  chartIds: [
    "11111111-1111-4111-a111-111111111111",
    "22222222-2222-4222-a222-222222222222",
  ],
  participantNames: ["가", "나"],
  createdAt: "2026-09-14T00:00:00.000Z",
  startedAt: null,
  completedAt: null,
  error: null,
  result: null,
});
test("queued and running jobs remain pending; restored complete/failed jobs stop polling", () => {
  const queued = fixture();
  assert.equal(isReadingPending(toReadingJob(queued)), true);
  const running = {
    ...queued,
    status: "running",
    stage: "interpreting",
    startedAt: queued.createdAt,
  };
  assert.equal(isReadingPending(toReadingJob(running)), true);
  const done = {
    ...running,
    status: "succeeded",
    stage: "finished",
    completedAt: queued.createdAt,
    result: { ranking: [] },
  };
  assert.equal(isReadingPending(toReadingJob(done)), false);
  const failed = {
    ...done,
    status: "failed",
    result: null,
    error: { reason: "READING_INTERRUPTED", message: "중단됨" },
  };
  assert.equal(isReadingPending(toReadingJob(failed)), false);
});
for (const [label, change] of [
  [
    "completion without result",
    (job) => {
      job.status = "succeeded";
      job.stage = "finished";
      job.completedAt = job.createdAt;
    },
  ],
  [
    "running response with a stale result",
    (job) => {
      job.result = {};
    },
  ],
  [
    "failed response without error",
    (job) => {
      job.status = "failed";
      job.stage = "finished";
      job.completedAt = job.createdAt;
    },
  ],
  [
    "invalid state",
    (job) => {
      job.status = "unknown";
    },
  ],
  [
    "invalid stage",
    (job) => {
      job.stage = "finished";
    },
  ],
  [
    "duplicate charts",
    (job) => {
      job.chartIds[1] = job.chartIds[0];
    },
  ],
  [
    "missing name",
    (job) => {
      job.participantNames.pop();
    },
  ],
])
  test(`rejects ${label} on page restoration`, () => {
    const value = fixture();
    change(value);
    assert.throws(() => toReadingJob(value));
  });
test("parses paginated summary without requiring the result and rejects a corrupt cursor", () => {
  const summary = fixture();
  delete summary.result;
  const page = toReadingJobs({ jobs: [summary], nextCursor: summary.id });
  assert.equal(page.jobs[0].id, summary.id);
  assert.throws(() =>
    toReadingJobs({ jobs: [summary], nextCursor: "invalid" }),
  );
});

const publicFixture = () => ({
  id: fixture().id,
  productCode: "wealth-ranking",
  status: "queued",
  stage: "queued",
  result: null,
  error: null,
});
test("restores the public page without chart IDs, participant metadata or an owner", () => {
  assert.deepEqual(toReadingResult(publicFixture()), publicFixture());
  const running = {
    ...publicFixture(),
    status: "running",
    stage: "interpreting",
  };
  assert.equal(isReadingPending(toReadingResult(running)), true);
  const complete = {
    ...running,
    status: "succeeded",
    stage: "finished",
    result: { ranking: [] },
  };
  assert.equal(isReadingPending(toReadingResult(complete)), false);
  const failed = {
    ...publicFixture(),
    status: "failed",
    stage: "finished",
    error: { message: "풀이 실패", reason: "private-reason" },
  };
  assert.deepEqual(toReadingResult(failed).error, { message: "풀이 실패" });
  assert.deepEqual(
    Object.keys(
      toReadingResult({ ...publicFixture(), chartIds: fixture().chartIds }),
    ).sort(),
    ["error", "id", "productCode", "result", "stage", "status"],
  );
});
for (const change of [
  { status: "succeeded", stage: "finished" },
  { status: "failed", stage: "finished" },
  { status: "running", stage: "finished" },
  { result: { ranking: [] } },
  { error: { message: "error" } },
  { id: "invalid" },
])
  test(`rejects inconsistent public state ${JSON.stringify(change)}`, () => {
    assert.throws(() => toReadingResult({ ...publicFixture(), ...change }));
  });
