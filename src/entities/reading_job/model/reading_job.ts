export type ReadingJobStatus = "queued" | "running" | "succeeded" | "failed";
export type ReadingJobStage =
  "queued" | "preparing" | "interpreting" | "saving" | "finished";
export type ReadingJobSummary = {
  id: string;
  productCode: "wealth-ranking";
  status: ReadingJobStatus;
  stage: ReadingJobStage;
  chartIds: string[];
  participantNames: string[];
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  error: { reason: string; message: string } | null;
};
export type ReadingJob = ReadingJobSummary & { result: unknown };
export const isReadingPending = (job: Pick<ReadingJobSummary, "status">) =>
  job.status === "queued" || job.status === "running";
export const READING_STAGE_LABEL: Record<ReadingJobStage, string> = {
  queued: "풀이 순서를 기다리고 있어요",
  preparing: "사주 자료를 확인하고 있어요",
  interpreting: "재물운을 풀이하고 있어요",
  saving: "풀이 결과를 정리하고 있어요",
  finished: "풀이가 끝났어요",
};

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
const uuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value);
const date = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
export function toReadingJobSummary(value: unknown): ReadingJobSummary {
  if (
    !record(value) ||
    !uuid(value.id) ||
    value.productCode !== "wealth-ranking" ||
    (value.status !== "queued" &&
      value.status !== "running" &&
      value.status !== "succeeded" &&
      value.status !== "failed") ||
    (value.stage !== "queued" &&
      value.stage !== "preparing" &&
      value.stage !== "interpreting" &&
      value.stage !== "saving" &&
      value.stage !== "finished") ||
    !Array.isArray(value.chartIds) ||
    !value.chartIds.every(uuid) ||
    value.chartIds.length < 2 ||
    value.chartIds.length > 5 ||
    new Set(value.chartIds).size !== value.chartIds.length ||
    !Array.isArray(value.participantNames) ||
    value.participantNames.length !== value.chartIds.length ||
    !value.participantNames.every(
      (name: unknown): name is string =>
        typeof name === "string" && name.length > 0 && name.length <= 30,
    ) ||
    !date(value.createdAt) ||
    (value.startedAt !== null && !date(value.startedAt)) ||
    (value.completedAt !== null && !date(value.completedAt))
  )
    throw new Error("Invalid reading job");
  let error: ReadingJobSummary["error"] = null;
  if (value.error !== null) {
    if (
      !record(value.error) ||
      typeof value.error.reason !== "string" ||
      typeof value.error.message !== "string"
    )
      throw new Error("Invalid reading failure");
    error = { reason: value.error.reason, message: value.error.message };
  }
  const terminal = value.status === "succeeded" || value.status === "failed";
  if (
    (value.status === "failed") !== (error !== null) ||
    terminal !== (value.completedAt !== null) ||
    (value.status === "queued" && value.stage !== "queued") ||
    (value.status === "running" &&
      !["preparing", "interpreting", "saving"].includes(value.stage)) ||
    (terminal && value.stage !== "finished")
  )
    throw new Error("Inconsistent reading state");
  return {
    id: value.id,
    productCode: value.productCode,
    status: value.status,
    stage: value.stage,
    chartIds: value.chartIds,
    participantNames: value.participantNames,
    createdAt: value.createdAt,
    startedAt: value.startedAt,
    completedAt: value.completedAt,
    error,
  };
}
export function toReadingJob(value: unknown): ReadingJob {
  const summary = toReadingJobSummary(value);
  if (
    !record(value) ||
    !("result" in value) ||
    (summary.status === "succeeded"
      ? !record(value.result)
      : value.result !== null)
  )
    throw new Error("Invalid reading result");
  return { ...summary, result: value.result };
}
export function toReadingJobs(value: unknown) {
  if (
    !record(value) ||
    !Array.isArray(value.jobs) ||
    (value.nextCursor !== null && !uuid(value.nextCursor))
  )
    throw new Error("Invalid reading list");
  return {
    jobs: value.jobs.map(toReadingJobSummary),
    nextCursor: value.nextCursor,
  };
}

export type ReadingResult = Pick<
  ReadingJobSummary,
  "id" | "productCode" | "status" | "stage"
> & {
  result: unknown;
  error: { message: string } | null;
};

export function toReadingResult(value: unknown): ReadingResult {
  if (
    !record(value) ||
    !uuid(value.id) ||
    value.productCode !== "wealth-ranking" ||
    (value.status !== "queued" &&
      value.status !== "running" &&
      value.status !== "succeeded" &&
      value.status !== "failed") ||
    (value.stage !== "queued" &&
      value.stage !== "preparing" &&
      value.stage !== "interpreting" &&
      value.stage !== "saving" &&
      value.stage !== "finished") ||
    !("result" in value) ||
    (value.status === "succeeded"
      ? !record(value.result)
      : value.result !== null) ||
    (value.status === "failed"
      ? !record(value.error) ||
        typeof value.error.message !== "string" ||
        !value.error.message
      : value.error !== null) ||
    (value.status === "queued" && value.stage !== "queued") ||
    (value.status === "running" &&
      !["preparing", "interpreting", "saving"].includes(value.stage)) ||
    ((value.status === "succeeded" || value.status === "failed") &&
      value.stage !== "finished")
  ) {
    throw new Error("Invalid public reading state");
  }
  return {
    id: value.id,
    productCode: value.productCode,
    status: value.status,
    stage: value.stage,
    result: value.result,
    error:
      record(value.error) && typeof value.error.message === "string"
        ? { message: value.error.message }
        : null,
  };
}
