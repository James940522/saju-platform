"use client";

import { LoaderCircle, ChevronRight, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  isReadingPending,
  READING_STAGE_LABEL,
  useReadingJobs,
} from "@/entities/reading_job";
import { routes } from "@/shared/config";

function List({ userId }: { userId: string }) {
  const query = useReadingJobs(userId);
  const jobs = query.data?.pages.flatMap((page) => page.jobs) ?? [];
  return (
    <section
      className="mt-6 rounded-2xl border border-border bg-surface p-4"
      aria-labelledby="reading-jobs-title"
    >
      <h2 className="font-display text-lg font-bold" id="reading-jobs-title">
        내 풀이
      </h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        다른 화면을 보거나 나갔다 와도 여기에서 이어서 확인할 수 있어요.
      </p>
      {query.isPending && (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          풀이 내역을 불러오고 있어요.
        </p>
      )}
      {query.isError && (
        <div className="mt-3 text-xs text-destructive" role="alert">
          풀이 상태를 불러오지 못했어요. 작업은 서버에서 계속 진행돼요.
          <button
            className="ml-2 min-h-11 underline"
            onClick={() => void query.refetch()}
            type="button"
          >
            다시 확인
          </button>
        </div>
      )}
      {!query.isPending && !query.isError && jobs.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          아직 요청한 풀이가 없어요.
        </p>
      )}
      <ul className="mt-3 divide-y divide-border">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              className="flex items-center gap-3 py-4"
              href={routes.readingJob(job.id)}
            >
              {isReadingPending(job) ? (
                <LoaderCircle
                  className="shrink-0 animate-spin text-brand-gold motion-reduce:animate-none"
                  size={20}
                />
              ) : job.status === "succeeded" ? (
                <CircleCheck
                  className="shrink-0 text-brand-gold-muted"
                  size={20}
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  재물운 랭킹{" "}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    {job.status === "succeeded"
                      ? "완료"
                      : job.status === "failed"
                        ? "완료하지 못함"
                        : "진행 중"}
                  </span>
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {job.participantNames.join(" · ")}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {isReadingPending(job)
                    ? READING_STAGE_LABEL[job.stage]
                    : new Date(job.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <ChevronRight
                className="shrink-0 text-muted-foreground"
                size={18}
              />
            </Link>
          </li>
        ))}
      </ul>
      {query.hasNextPage && (
        <button
          className="min-h-11 w-full text-sm font-semibold underline disabled:opacity-50"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          type="button"
        >
          이전 풀이 더 보기
        </button>
      )}
    </section>
  );
}
export function ReadingJobsList() {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  return typeof userId === "string" ? (
    <List key={userId} userId={userId} />
  ) : null;
}
