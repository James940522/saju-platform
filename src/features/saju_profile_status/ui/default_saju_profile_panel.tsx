"use client";

import { CalendarDays, Clock3, LogIn, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getDemoUserIdentifier,
  getDemoUserServerSnapshot,
  subscribeToDemoUser,
} from "@/entities/demo_user";
import {
  getDemoSajuProfileSnapshot,
  parseDemoSajuProfileSnapshot,
  subscribeToDemoSajuProfiles,
  type SajuBirthTime,
} from "@/entities/saju_profile";
import { routes } from "@/shared/config";

function formatBirthTime(birthTime: SajuBirthTime) {
  if (birthTime.type === "unknown") {
    return "시간 모름";
  }

  return `${birthTime.hour.toString().padStart(2, "0")}:${birthTime.minute.toString().padStart(2, "0")}`;
}

export function DefaultSajuProfilePanel() {
  const userIdentifier = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoUser,
    getDemoUserIdentifier,
    getDemoUserServerSnapshot,
  );
  const profileSnapshot = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoSajuProfiles,
    () => getDemoSajuProfileSnapshot("default"),
    () => undefined,
  );

  if (userIdentifier === undefined || profileSnapshot === undefined) {
    return (
      <section
        aria-live="polite"
        className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm font-medium text-muted">
          데모 계정과 사주 정보를 확인하고 있어요
        </p>
      </section>
    );
  }

  if (!userIdentifier) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-medium text-muted">로그인이 필요해요</p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
          로그인하면 내 사주 정보를 저장하고 풀이에 사용할 수 있어요
        </h2>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          href={routes.login({ target: "profile" })}
        >
          <LogIn size={17} />
          데모 로그인하고 등록하기
        </Link>
      </section>
    );
  }

  const profile = profileSnapshot
    ? parseDemoSajuProfileSnapshot(profileSnapshot)
    : null;

  if (!profile) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
        <p className="text-sm font-medium text-muted">
          {userIdentifier}님, 아직 등록된 사주가 없어요
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
          기본 정보를 입력하면 풀이와 운세를 바로 이어볼 수 있어요
        </h2>
        <Link
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
          href={routes.profileNew()}
        >
          내 사주 등록하기
        </Link>
      </section>
    );
  }

  const calendarLabel = `${profile.calendarType === "solar" ? "양력" : "음력"}${profile.isLeapMonth ? " · 윤달" : ""}`;

  return (
    <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5">
      <p className="text-sm font-semibold text-primary">기본 사주 저장됨</p>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">
        {profile.displayName}
      </h2>

      <dl className="mt-4 space-y-2 rounded-2xl border border-paper-border bg-surface p-4 text-sm">
        <div className="flex items-center gap-3">
          <UserRound className="text-[#9a7c42]" size={18} />
          <dt className="text-muted">성별</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {profile.gender === "male" ? "남성" : "여성"}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="text-[#9a7c42]" size={18} />
          <dt className="text-muted">생년월일</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {profile.birthDate.year}.{profile.birthDate.month}.
            {profile.birthDate.day} ({calendarLabel})
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="text-[#9a7c42]" size={18} />
          <dt className="text-muted">출생시간</dt>
          <dd className="ml-auto font-semibold text-foreground">
            {formatBirthTime(profile.birthTime)}
          </dd>
        </div>
        {profile.birthRegion ? (
          <div className="flex items-center gap-3">
            <MapPin className="text-[#9a7c42]" size={18} />
            <dt className="text-muted">출생지역</dt>
            <dd className="ml-auto font-semibold text-foreground">
              {profile.birthRegion}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-3 text-[11px] leading-5 text-muted">
        실제 서버가 아닌 현재 탭의 데모 세션에만 저장되어 있어요.
      </p>
      <Link
        className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-foreground px-5 text-sm font-semibold text-foreground"
        href={routes.profileNew()}
      >
        사주 정보 다시 입력하기
      </Link>
    </section>
  );
}
