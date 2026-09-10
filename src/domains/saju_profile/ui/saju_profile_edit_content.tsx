"use client";

import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import Link from "next/link";

import { sajuProfileQueries } from "@/entities/saju_chart";
import { UpdateSajuProfileForm } from "@/features/saju_input";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";

type SajuProfileEditContentProps = {
  profileId: string;
};

export function SajuProfileEditContent({
  profileId,
}: SajuProfileEditContentProps) {
  const profileQuery = useQuery(sajuProfileQueries.detail(profileId));

  if (profileQuery.isPending) {
    return (
      <section
        aria-live="polite"
        className="mt-6 rounded-[22px] border border-paper-border bg-paper p-5"
      >
        <p className="text-sm text-muted-foreground">
          수정할 사주 프로필을 불러오고 있어요
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

  return (
    <>
      <aside className="mt-6 rounded-2xl border border-brand-gold/35 bg-brand-gold-soft/45 px-4 py-3 text-xs leading-5 text-muted-foreground">
        이름이나 관계만 바꾸면 현재 만세력을 유지해요. 생년월일, 태어난
        시각, 성별 기준값을 바꾸면 새로운 만세력 계산본을 저장합니다.
      </aside>
      <UpdateSajuProfileForm
        key={profileQuery.data.profile.id}
        profile={profileQuery.data.profile}
      />
    </>
  );
}
