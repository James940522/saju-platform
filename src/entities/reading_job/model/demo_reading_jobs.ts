import { getDemoSajuProfiles } from "@/entities/saju_chart";
import { getDemoWealthRanking } from "@/entities/wealth_ranking";
import { ApiClientError } from "@/shared/api";
import { readDemoStorage, writeDemoStorage } from "@/shared/api";
import { toReadingJob, type ReadingJob } from "./reading_job";

const STORAGE_KEY = "reading-jobs";

function buildJob(id: string, chartIds: readonly string[], createdAt: string): ReadingJob {
  const result = getDemoWealthRanking(chartIds);
  return {
    id, productCode: "wealth-ranking", status: "succeeded", stage: "finished",
    chartIds: [...chartIds], participantNames: result.ranking.map((entry) => entry.displayName),
    createdAt, startedAt: createdAt, completedAt: createdAt, error: null, result,
  };
}

export function getDemoReadingJobs() {
  const stored = readDemoStorage(STORAGE_KEY);
  if (Array.isArray(stored)) {
    try { return { jobs: stored.map(toReadingJob), nextCursor: null }; }
    catch { /* Restore seed data when an old preview session is incompatible. */ }
  }
  const chartIds = getDemoSajuProfiles().profiles.slice(0, 3)
    .flatMap((profile) => profile.currentChartId ? [profile.currentChartId] : []);
  const jobs = chartIds.length >= 2 ? [
    buildJob("de200000-0000-4000-a000-000000000001", chartIds, "2026-09-15T00:00:00.000Z"),
    buildJob("de200000-0000-4000-a000-000000000002", chartIds.slice(0, 2), "2026-09-14T00:00:00.000Z"),
  ] : [];
  writeDemoStorage(STORAGE_KEY, jobs);
  return { jobs, nextCursor: null };
}

export function getDemoReadingJob(jobId: string) {
  const job = getDemoReadingJobs().jobs.find((item) => item.id === jobId);
  if (!job) throw new ApiClientError({
    code: 404, message: "예시 풀이를 찾을 수 없어요. 결과 보관함에서 선택해주세요.",
    data: { reason: "READING_JOB_NOT_FOUND" },
  });
  return job;
}

export function createDemoReadingJob(chartIds: readonly string[], requestKey: string) {
  const { jobs } = getDemoReadingJobs();
  const previousId = readDemoStorage(`reading-request:${requestKey}`);
  if (typeof previousId === "string" && jobs.some((job) => job.id === previousId))
    return getDemoReadingJob(previousId);
  const job = buildJob(crypto.randomUUID(), chartIds, new Date().toISOString());
  writeDemoStorage(STORAGE_KEY, [job, ...jobs]);
  writeDemoStorage(`reading-request:${requestKey}`, job.id);
  return job;
}
