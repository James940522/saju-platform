import { ApiClientError, requestApi } from "@/shared/api";
import {
  toReadingJob,
  toReadingJobs,
  toReadingResult,
} from "../model/reading_job";

function parse<T>(value: unknown, mapper: (value: unknown) => T): T {
  try {
    return mapper(value);
  } catch {
    throw new ApiClientError({
      code: null,
      message: "풀이 상태를 확인하지 못했어요. 다시 불러와주세요.",
      data: { reason: "INVALID_API_RESPONSE" },
    });
  }
}
export async function createReadingJob(
  chartIds: readonly string[],
  requestKey: string,
  signal?: AbortSignal,
) {
  const response = await requestApi<unknown>({
    method: "POST",
    url: "/v1/reading-jobs",
    headers: { "Idempotency-Key": requestKey },
    data: { productCode: "wealth-ranking", chartIds },
    signal,
  });
  return parse(response.data, toReadingJob);
}
export async function getReadingJob(jobId: string, signal?: AbortSignal) {
  const response = await requestApi<unknown>({
    method: "GET",
    url: `/v1/reading-jobs/${encodeURIComponent(jobId)}`,
    signal,
  });
  return parse(response.data, toReadingJob);
}
export async function getReadingJobs(cursor?: string, signal?: AbortSignal) {
  const response = await requestApi<unknown>({
    method: "GET",
    url: "/v1/reading-jobs",
    params: { limit: 20, cursor },
    signal,
  });
  return parse(response.data, toReadingJobs);
}
export async function getReadingResult(jobId: string, signal?: AbortSignal) {
  const response = await requestApi<unknown>({
    method: "GET",
    url: `/v1/reading-results/${encodeURIComponent(jobId)}`,
    signal,
  });
  return parse(response.data, toReadingResult);
}
export const readingJobKeys = {
  all: ["reading-jobs"] as const,
  list: (userId: string) => ["reading-jobs", userId, "list"] as const,
  detail: (userId: string, jobId: string) =>
    ["reading-jobs", userId, jobId] as const,
  active: (userId: string) => ["reading-jobs", userId, "active"] as const,
  result: (jobId: string) => ["reading-results", jobId] as const,
};
