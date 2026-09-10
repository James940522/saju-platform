"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock3, LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  sajuProfileQueries,
  type SajuProfileSummaryDto,
} from "@/entities/saju_chart";
import { routes } from "@/shared/config";

function formatBirthTime(
  birthTime: SajuProfileSummaryDto["birth"]["time"],
) {
  if (birthTime.precision === "unknown") {
    return "시간 모름";
  }

  return `${birthTime.hour.toString().padStart(2, "0")}:${birthTime.minute.toString().padStart(2, "0")}`;
}

export function DefaultSajuProfilePanel() {
  const userId = useSyncExternalStore<string | null | undefined>(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const profilesQuery = useQuery({
    ...sajuProfileQueries.list(),
    enabled: Boolean(userId),
  });

  if (userId === undefined || (userId && profilesQuery.isPending)) {
    return (
      <section
        aria-live="polite"
        className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm font-medium text-muted-foreground">
          로그인과 사주 정보를 확인하고 있어요
        </p>
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-medium text-muted-foreground">로그인이 필요해요</p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
          로그인하면 내 사주 정보를 저장하고 풀이에 사용할 수 있어요
        </h2>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          href={routes.login({ target: "profile" })}
        >
          <LogIn size={17} />
          로그인하고 등록하기
        </Link>
      </section>
    );
  }

  if (profilesQuery.isError) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-medium text-destructive">
          사주 정보를 불러오지 못했어요
        </p>
        <button
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-foreground px-5 text-sm font-semibold text-foreground"
          onClick={() => void profilesQuery.refetch()}
          type="button"
        >
          다시 시도하기
        </button>
      </section>
    );
  }

  const profile =
    profilesQuery.data?.profiles.find((candidate) => candidate.isPrimary) ??
    profilesQuery.data?.profiles[0];

  if (!profile) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-medium text-muted-foreground">
          아직 등록된 사주가 없어요
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
          출생 정보를 입력하면 내 만세력을 확인할 수 있어요
        </h2>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          href={routes.profileNew({ role: "default" })}
        >
          대표 사주 등록하기
        </Link>
      </section>
    );
  }

  const calendarLabel = `${profile.birth.calendarType === "solar" ? "양력" : "음력"}${profile.birth.isLeapMonth ? " · 윤달" : ""}`;

  return (
    <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
      <p className="text-sm font-semibold text-primary">대표 사주</p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">
        {profile.displayName}
      </h2>

      <dl className="mt-4 space-y-2 rounded-2xl border border-paper-border bg-surface p-4 text-sm">
        <div className="flex items-center gap-3">
          <UserRound className="text-brand-gold-muted" size={18} />
          <dt className="text-muted-foreground">성별</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {profile.birth.luckCycleGender === "male" ? "남성" : "여성"}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="text-brand-gold-muted" size={18} />
          <dt className="text-muted-foreground">생년월일</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {profile.birth.date.year}.{profile.birth.date.month}.
            {profile.birth.date.day} ({calendarLabel})
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="text-brand-gold-muted" size={18} />
          <dt className="text-muted-foreground">출생시간</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {formatBirthTime(profile.birth.time)}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
        로그인한 계정에 저장되어 다른 기기에서도 확인할 수 있어요.
      </p>
    </section>
  );
}
