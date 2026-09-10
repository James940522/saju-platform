"use client";

import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import { sajuProfileQueries } from "@/entities/saju_chart";

import { ManseoryeokChart } from "./manseoryeok_chart";

export function DefaultManseoryeokChart() {
  const userId = useSyncExternalStore<string | null | undefined>(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const profilesQuery = useQuery({
    ...sajuProfileQueries.list(),
    enabled: Boolean(userId),
  });
  const primaryProfile =
    profilesQuery.data?.profiles.find((profile) => profile.isPrimary) ??
    profilesQuery.data?.profiles[0];
  const profileQuery = useQuery({
    ...sajuProfileQueries.detail(primaryProfile?.id ?? ""),
    enabled: Boolean(userId && primaryProfile),
  });

  if (!userId || !primaryProfile) {
    return null;
  }

  if (profileQuery.isPending) {
    return (
      <section
        aria-live="polite"
        className="mt-7 rounded-[24px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm text-muted-foreground">
          만세력 계산 결과를 불러오고 있어요
        </p>
      </section>
    );
  }

  if (profileQuery.isError || !profileQuery.data.chart) {
    return (
      <section className="mt-7 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm text-destructive">
          만세력 계산 결과를 불러오지 못했어요
        </p>
        <button
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-foreground px-5 text-sm font-semibold text-foreground"
          onClick={() => void profileQuery.refetch()}
          type="button"
        >
          다시 시도하기
        </button>
      </section>
    );
  }

  return (
    <section className="mt-7" aria-labelledby="manseoryeok-title">
      <div className="mb-4 px-1">
        <p className="text-xs font-semibold text-primary">내 사주 원국</p>
        <h2
          className="mt-2 font-display text-xl font-bold text-foreground"
          id="manseoryeok-title"
        >
          {primaryProfile.displayName}님의 만세력
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          저장한 생년월일시를 기준으로 계산한 현재 명식이에요.
        </p>
      </div>

      <ManseoryeokChart snapshot={profileQuery.data.chart.snapshot} />
    </section>
  );
}
