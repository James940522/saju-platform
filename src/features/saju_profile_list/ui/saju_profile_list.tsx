"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Plus,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  sajuProfileQueries,
  type SajuProfileSummaryDto,
} from "@/entities/saju_chart";
import { routes } from "@/shared/config";

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

function SajuProfileCard({ profile }: { profile: SajuProfileSummaryDto }) {
  const calendarLabel = `${profile.birth.calendarType === "solar" ? "양력" : "음력"}${profile.birth.isLeapMonth ? " · 윤달" : ""}`;

  return (
    <Link
      aria-label={`${profile.displayName} 만세력 보기`}
      className="block rounded-[22px] border border-paper-border bg-paper p-5 transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      href={routes.sajuProfile(profile.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
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
          <h2 className="mt-2 truncate font-display text-xl font-bold text-foreground">
            {profile.displayName}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
            <UserRound size={21} strokeWidth={1.8} />
          </span>
          <ChevronRight className="text-muted-foreground" size={19} />
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="text-brand-gold-muted" size={17} />
          <dt className="sr-only">생년월일</dt>
          <dd className="text-foreground">
            {profile.birth.date.year}.{profile.birth.date.month}.
            {profile.birth.date.day} ({calendarLabel})
          </dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock3 className="text-brand-gold-muted" size={17} />
          <dt className="sr-only">출생시간</dt>
          <dd className="text-foreground">
            {formatBirthTime(profile.birth.time)}
          </dd>
        </div>
      </dl>
    </Link>
  );
}

export function SajuProfileList() {
  const profilesQuery = useQuery(sajuProfileQueries.list());

  if (profilesQuery.isPending) {
    return (
      <section
        aria-live="polite"
        className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm text-muted-foreground">
          등록한 사주 프로필을 불러오고 있어요
        </p>
      </section>
    );
  }

  if (profilesQuery.isError) {
    return (
      <section className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-semibold text-destructive">
          사주 프로필을 불러오지 못했어요
        </p>
        <button
          className="mt-4 h-11 w-full rounded-xl border border-foreground text-sm font-semibold text-foreground"
          onClick={() => void profilesQuery.refetch()}
          type="button"
        >
          다시 시도하기
        </button>
      </section>
    );
  }

  if (profilesQuery.data.profiles.length === 0) {
    return (
      <section className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5 text-center">
        <UserRound
          className="mx-auto text-brand-gold-muted"
          size={30}
          strokeWidth={1.7}
        />
        <h2 className="mt-3 font-display text-lg font-bold text-foreground">
          아직 등록된 사주 프로필이 없어요
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          첫 사주 프로필을 등록하면 자동으로 대표 프로필이 돼요.
        </p>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          href={routes.profileNew()}
        >
          <Plus size={17} />
          사주 프로필 등록하기
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-6" aria-labelledby="saju-profile-list-title">
      <div className="flex items-center justify-between gap-3 px-1">
        <h2
          className="font-display text-lg font-bold text-foreground"
          id="saju-profile-list-title"
        >
          등록한 프로필
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            총 {profilesQuery.data.profiles.length}개
          </span>
          <Link
            className="flex h-9 items-center gap-1 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground"
            href={routes.profileNew()}
          >
            <Plus size={15} />
            추가
          </Link>
        </div>
      </div>
      <div className="mt-3 space-y-3">
        {profilesQuery.data.profiles.map((profile) => (
          <SajuProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}
