"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock3, Pencil, UserRound } from "lucide-react";
import Link from "next/link";

import {
  sajuProfileQueries,
  type SajuProfileSummaryDto,
} from "@/entities/saju_chart";
import { DeleteSajuProfileButton } from "@/features/saju_profile_delete";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";
import { ManseoryeokChart } from "@/widgets/manseoryeok_chart";

const RELATION_LABELS: Record<
  SajuProfileSummaryDto["relationType"],
  string
> = {
  self: "본인",
  family: "가족",
  friend: "친구",
  partner: "연인·배우자",
  other: "기타",
};

function formatBirthTime(
  birthTime: SajuProfileSummaryDto["birth"]["time"],
) {
  if (birthTime.precision === "unknown") {
    return "시간 모름";
  }

  return `${birthTime.hour.toString().padStart(2, "0")}:${birthTime.minute.toString().padStart(2, "0")}`;
}

type SajuProfileDetailContentProps = {
  profileId: string;
};

export function SajuProfileDetailContent({
  profileId,
}: SajuProfileDetailContentProps) {
  const profileQuery = useQuery(sajuProfileQueries.detail(profileId));

  if (profileQuery.isPending) {
    return (
      <section
        aria-live="polite"
        className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm text-muted-foreground">
          저장된 사주 프로필을 불러오고 있어요
        </p>
      </section>
    );
  }

  if (profileQuery.isError) {
    const isNotFound =
      isApiClientError(profileQuery.error) &&
      profileQuery.error.data?.reason === "SAJU_PROFILE_NOT_FOUND";

    return (
      <section className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5 text-center">
        <UserRound
          className="mx-auto text-brand-gold-muted"
          size={30}
          strokeWidth={1.7}
        />
        <h2 className="mt-3 font-display text-lg font-bold text-foreground">
          {isNotFound
            ? "사주 프로필을 찾을 수 없어요"
            : "사주 프로필을 불러오지 못했어요"}
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {isNotFound
            ? "삭제되었거나 이 계정에 속하지 않은 프로필이에요."
            : "잠시 후 다시 시도해주세요."}
        </p>
        {isNotFound ? (
          <Link
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-foreground text-sm font-semibold text-foreground"
            href={routes.sajuProfiles}
          >
            사주 관리로 돌아가기
          </Link>
        ) : (
          <button
            className="mt-5 h-11 w-full rounded-xl border border-foreground text-sm font-semibold text-foreground"
            onClick={() => void profileQuery.refetch()}
            type="button"
          >
            다시 시도하기
          </button>
        )}
      </section>
    );
  }

  const { chart, profile } = profileQuery.data;
  const calendarLabel = `${profile.birth.calendarType === "solar" ? "양력" : "음력"}${profile.birth.isLeapMonth ? " · 윤달" : ""}`;

  return (
    <>
      <section className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-primary">
            {RELATION_LABELS[profile.relationType]}
          </span>
          {profile.isPrimary ? (
            <span className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-[10px] font-semibold text-brand-gold-foreground">
              대표
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate font-display text-2xl font-bold text-foreground">
            {profile.displayName}
          </h2>
          <Link
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-paper-border bg-surface px-3 text-xs font-bold text-foreground"
            href={routes.sajuProfileEdit(profile.id)}
          >
            <Pencil size={14} />
            수정
          </Link>
        </div>

        <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
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
            <dd className="ml-auto text-right font-semibold text-foreground">
              {profile.birth.date.year}.{profile.birth.date.month}.
              {profile.birth.date.day} ({calendarLabel})
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <Clock3 className="text-brand-gold-muted" size={18} />
            <dt className="text-muted-foreground">태어난 시각</dt>
            <dd className="ml-auto font-semibold text-foreground">
              {formatBirthTime(profile.birth.time)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-5" aria-label="만세력 계산 결과">
        {chart ? (
          <ManseoryeokChart snapshot={chart.snapshot} />
        ) : (
          <div className="rounded-[22px] border border-paper-border bg-paper p-5">
            <p className="text-sm font-semibold text-foreground">
              만세력 계산 결과가 없어요
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              저장된 프로필을 확인한 뒤 다시 시도해주세요.
            </p>
          </div>
        )}
      </section>

      <section className="mt-6 border-t border-border pt-6">
        <DeleteSajuProfileButton profile={profile} />
      </section>
    </>
  );
}
