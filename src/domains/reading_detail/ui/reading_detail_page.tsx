"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  CircleUserRound,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReadingAccessLabel,
  getReadingDefinition,
  getReadingSubjectLabel,
  readingProductQueries,
} from "@/entities/reading";
import { routes } from "@/shared/config";
import { ReadingStartGate } from "@/widgets/reading_jobs";

type ReadingDetailPageProps = {
  readingCode: string;
};

export function ReadingDetailPage({ readingCode }: ReadingDetailPageProps) {
  const isWealthRanking = readingCode === "wealth-ranking";
  const productQuery = useQuery({
    ...readingProductQueries.detail(readingCode),
    enabled: isWealthRanking,
    retry: false,
  });
  const reading =
    productQuery.data?.product ?? getReadingDefinition(readingCode);

  if (!reading) {
    notFound();
  }

  const subjectLabel = getReadingSubjectLabel(reading.subjectRequirement);

  const startAction =
    isWealthRanking &&
    (productQuery.isPending ||
      productQuery.isError ||
      reading.availability !== "active") ? (
      <div className="mt-5 text-center">
        <button
          className="flex h-14 w-full items-center justify-center rounded-2xl border border-paper-border bg-paper text-sm font-semibold text-muted-foreground disabled:opacity-60"
          disabled={!productQuery.isError || productQuery.isFetching}
          onClick={() => void productQuery.refetch()}
          type="button"
        >
          {productQuery.isError
            ? "이용 가능 여부 다시 확인"
            : productQuery.isPending
              ? "이용 가능 여부 확인 중"
              : "지금은 풀이를 준비하고 있어요"}
        </button>
        {productQuery.isError && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            서버에 연결하지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}
      </div>
    ) : (
      <Link
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-brand-gold bg-primary font-display text-[18px] font-bold text-brand-gold-on-dark"
        href={routes.readingStart(reading.code)}
      >
        풀이 시작하기
        <ChevronRight size={19} />
      </Link>
    );

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
          href={routes.readings}
          aria-label="풀이 목록으로 돌아가기"
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-brand-gold-muted">
            풀이 소개
          </p>
          <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
            {reading.title}
          </h1>
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-[24px] bg-hero px-5 py-7 text-primary-foreground shadow-soft">
        <p className="flex items-center gap-2 text-xs font-semibold text-hero-accent">
          <Sparkles size={15} />
          나에게 맞춘 사주 풀이
        </p>
        <h2 className="mt-4 font-display text-[24px] font-bold leading-[1.45]">
          {reading.title}
        </h2>
        <p className="mt-3 text-[13px] leading-6 text-hero-foreground">
          {reading.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-brand-gold px-3 py-1.5 text-[11px] font-semibold text-[#f1d58a]">
            {subjectLabel}
          </span>
          <span className="rounded-full border border-brand-gold px-3 py-1.5 text-[11px] font-semibold text-[#f1d58a]">
            {getReadingAccessLabel(reading)}
          </span>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-[20px] font-bold text-foreground">
          이 풀이에서 확인해요
        </h2>
        <ul className="mt-3 space-y-2">
          {reading.highlights.map((highlight) => (
            <li
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5"
              key={highlight}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <ChevronRight size={17} strokeWidth={1.8} />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {highlight}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-5 flex items-start gap-3 rounded-2xl border border-paper-border bg-paper px-4 py-4">
        <CircleUserRound
          className="mt-0.5 shrink-0 text-brand-gold-muted"
          size={23}
          strokeWidth={1.6}
        />
        <div>
          <h2 className="text-sm font-bold text-foreground">
            필요한 사주 정보
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {subjectLabel}에 맞는 생년월일, 성별, 달력 종류와 출생시간을
            사용해요.
          </p>
        </div>
      </aside>

      {isWealthRanking ? (
        <ReadingStartGate>{startAction}</ReadingStartGate>
      ) : (
        startAction
      )}
    </main>
  );
}
