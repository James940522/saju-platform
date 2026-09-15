"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  getReadingResult,
  isReadingPending,
  readingJobKeys,
  READING_STAGE_LABEL,
} from "@/entities/reading_job";
import { toPublicWealthRankingResult } from "@/entities/wealth_ranking";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";
import { WealthRankingResult } from "@/widgets/wealth_ranking_result";
import { useRouter } from "next/navigation";

function Content({ jobId }: { jobId: string }) {
  const router = useRouter();
  const query = useQuery({
    queryKey: readingJobKeys.result(jobId),
    queryFn: ({ signal }) => getReadingResult(jobId, signal),
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: (query) =>
      query.state.data && isReadingPending(query.state.data) ? 3000 : false,
  });
  const job = query.data;
  let result = null;
  let invalidResult = false;
  if (job?.status === "succeeded") {
    try {
      result = toPublicWealthRankingResult(job.result);
    } catch {
      invalidResult = true;
    }
  }
  return (
    <main className="min-h-dvh px-4 pb-8 pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          aria-label="결과 보관함으로 돌아가기"
          className="grid size-11 place-items-center rounded-full border border-paper-border"
          href={routes.resultArchive}
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-display text-2xl font-bold">재물운 랭킹</h1>
      </header>
      {query.isPending && (
        <p className="mt-6 text-sm text-muted-foreground" role="status">
          풀이 상태를 불러오고 있어요.
        </p>
      )}
      {(query.isError || invalidResult) && (
        <section
          className="mt-6 rounded-2xl border border-border bg-surface p-5"
          role="alert"
        >
          <p className="text-sm">
            {isApiClientError(query.error) && query.error.code === 404
              ? "삭제되었거나 찾을 수 없는 풀이예요."
              : "풀이 상태를 확인하지 못했어요. 새 요청 없이 다시 확인할 수 있어요."}
          </p>
          <button
            className="mt-2 min-h-11 text-sm font-semibold underline"
            onClick={() => void query.refetch()}
            type="button"
          >
            다시 확인하기
          </button>
        </section>
      )}
      {job && isReadingPending(job) && (
        <section
          className="mt-6 rounded-2xl border border-border bg-surface p-5"
          aria-live="polite"
          aria-busy="true"
        >
          <p className="flex items-center gap-2 font-semibold">
            <LoaderCircle
              className="animate-spin text-brand-gold motion-reduce:animate-none"
              size={20}
            />
            {READING_STAGE_LABEL[job.stage]}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            다른 일을 하고 오셔도 괜찮아요.
            <br />
            화면을 닫거나 새로고침해도 풀이가 계속돼요.
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            보통 수십 초, 요청 상황에 따라 몇 분 정도 걸릴 수 있어요. 완료되면
            결과 보관함에서 다시 확인할 수 있어요.
          </p>
        </section>
      )}
      {job?.status === "failed" && (
        <section
          className="mt-6 rounded-2xl border border-border bg-surface p-5"
          role="status"
        >
          <h2 className="font-semibold">풀이를 완료하지 못했어요</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {job.error?.message}
          </p>
          <Link
            className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
            href={routes.readingStart(job.productCode)}
          >
            참여자를 확인하고 새로 요청하기
          </Link>
        </section>
      )}
      {result && (
        <>
          <p
            className="mt-5 text-sm font-semibold text-brand-gold-muted"
            role="status"
          >
            풀이가 완료되었어요
          </p>
          <WealthRankingResult
            jobId={jobId}
            result={result}
            onEdit={() => router.push(routes.readingStart("wealth-ranking"))}
          />
        </>
      )}
      <Link
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        href={routes.resultArchive}
      >
        결과 보관함 보기
      </Link>
      <Link
        className="mt-5 flex min-h-12 items-center justify-center rounded-xl border border-paper-border text-sm font-semibold"
        href={routes.readings}
      >
        다른 풀이 둘러보기
      </Link>
    </main>
  );
}
export function ReadingJobPage({ jobId }: { jobId: string }) {
  return <Content key={jobId} jobId={jobId} />;
}
