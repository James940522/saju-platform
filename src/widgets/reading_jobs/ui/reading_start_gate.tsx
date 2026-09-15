"use client";

import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  getReadingJobs,
  isReadingPending,
  readingJobKeys,
  READING_STAGE_LABEL,
} from "@/entities/reading_job";
import { routes } from "@/shared/config";

function Checking() {
  return (
    <p
      className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-surface p-5 text-sm text-muted-foreground"
      role="status"
    >
      <LoaderCircle
        size={18}
        className="animate-spin motion-reduce:animate-none"
      />
      진행 중인 풀이를 확인하고 있어요.
    </p>
  );
}

function AuthenticatedGate({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const query = useQuery({
    queryKey: readingJobKeys.active(userId),
    queryFn: ({ signal }) => getReadingJobs(undefined, signal),
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: 3000,
  });
  // There can only be one unfinished job per owner. Newest-first history
  // therefore includes that job on its first page.
  const active = query.data?.jobs.find(isReadingPending);
  if (active)
    return (
      <section
        className="mt-5 rounded-2xl border border-brand-gold bg-surface p-5"
        aria-live="polite"
        aria-busy="true"
      >
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <LoaderCircle
            size={20}
            className="animate-spin text-brand-gold motion-reduce:animate-none"
          />
          재물운 풀이가 진행 중이에요
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {READING_STAGE_LABEL[active.stage]}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          다른 화면을 보거나 나갔다 오셔도 괜찮아요. 완료되면 내 풀이에서 확인할
          수 있어요.
        </p>
        <Link
          href={routes.readingJob(active.id)}
          className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
        >
          진행 중인 풀이 보기
        </Link>
      </section>
    );
  if (query.isError)
    return (
      <section
        className="mt-5 rounded-2xl border border-border bg-surface p-5"
        role="alert"
      >
        <p className="text-sm text-muted-foreground">
          진행 중인 풀이를 확인하지 못했어요. 확인 후 새 풀이를 시작할 수
          있어요.
        </p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
          className="mt-2 min-h-11 text-sm font-semibold underline disabled:opacity-50"
        >
          다시 확인하기
        </button>
      </section>
    );
  // A cached empty list must not flash a new-start UI before this visit's GET.
  if (query.isPending || !query.isFetchedAfterMount) return <Checking />;
  return children;
}

export function ReadingStartGate({ children }: { children: ReactNode }) {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  if (userId === undefined) return <Checking />;
  if (userId === null) return children;
  return (
    <AuthenticatedGate key={userId} userId={userId}>
      {children}
    </AuthenticatedGate>
  );
}
