import { readingCatalog, type ReadingTheme } from "@/entities/reading";
import { READING_STAGE_LABEL, type ReadingJobSummary } from "@/entities/reading_job";
import { routes } from "@/shared/config";

export type ArchivedResult = {
  id: string;
  productCode: string;
  productTitle: string;
  theme: ReadingTheme;
  title: string;
  description: string;
  createdAt: string;
  href: string;
  status: ReadingJobSummary["status"];
  isDemo: boolean;
};

export function toArchivedResults(jobs: readonly ReadingJobSummary[], demoSavedAt: string | null): ArchivedResult[] {
  // Pages may overlap when a fresh result arrives while older pages load.
  const jobsById = new Map<string, ReadingJobSummary>();
  for (const job of jobs) {
    if (!jobsById.has(job.id)) jobsById.set(job.id, job);
  }
  const uniqueJobs = [...jobsById.values()];
  const results: ArchivedResult[] = uniqueJobs.map((job) => {
    const product = readingCatalog.find((item) => item.code === job.productCode);
    return {
      id: job.id,
      productCode: job.productCode,
      productTitle: product?.title ?? "사주 풀이",
      theme: product?.theme ?? "self",
      title: job.participantNames.join(" × "),
      description: job.status === "succeeded"
        ? "함께 살펴본 재물의 흐름"
        : job.status === "failed"
          ? "풀이를 완료하지 못했어요. 내용을 확인해주세요."
          : READING_STAGE_LABEL[job.stage],
      createdAt: job.createdAt,
      href: routes.readingJob(job.id),
      status: job.status,
      isDemo: false,
    };
  });

  if (demoSavedAt) {
    results.push({
      id: "past-life-relationship-demo",
      productCode: "past-life-relationship",
      productTitle: "전생 관계",
      theme: "relationship",
      title: "나와 상대의 전생 관계",
      description: "예시 결과 · 현재 브라우저 탭에 보관",
      createdAt: demoSavedAt,
      href: routes.result("past-life-relationship-demo"),
      status: "succeeded",
      isDemo: true,
    });
  }

  return results.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export function getArchiveProducts(results: readonly ArchivedResult[]) {
  return readingCatalog
    .filter((product) => product.availability !== "hidden" || results.some((result) => result.productCode === product.code))
    .map(({ code, title }) => ({ code, title }));
}

export function filterArchivedResults(results: readonly ArchivedResult[], productCode: string) {
  return productCode === "all" ? results : results.filter((result) => result.productCode === productCode);
}

export function formatArchiveDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(value)).replaceAll("-", ".");
}
