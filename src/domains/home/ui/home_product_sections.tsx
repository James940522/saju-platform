"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Coins,
  History,
  SunMedium,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  getReadingAccessLabel,
  readingProductQueries,
  type ReadingCode,
} from "@/entities/reading";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";
import { useMinimumLoadingTime } from "@/shared/lib";
import { Button, Skeleton } from "@/shared/ui";

const MINIMUM_SKELETON_DURATION_MS =
  process.env.NODE_ENV === "development" ? 1_500 : 0;

type ProductPlacement = {
  code: ReadingCode;
  description: string;
  icon: LucideIcon;
};

const togetherProductPlacements = [
  {
    code: "wealth-ranking",
    description: "우리 중 누가 제일\n재물운이 강할까?",
    icon: Coins,
  },
  {
    code: "past-life-relationship",
    description: "두 사람의 인연을\n이야기로 풀어봐요.",
    icon: History,
  },
] satisfies readonly ProductPlacement[];

const nearFortunePlacements = [
  {
    code: "daily-fortune",
    description: "오늘의 흐름",
    icon: SunMedium,
  },
  {
    code: "monthly-fortune",
    description: "이달의 변화",
    icon: CalendarDays,
  },
  {
    code: "three-month-fortune",
    description: "앞으로의 흐름",
    icon: Clock3,
  },
] satisfies readonly ProductPlacement[];

function CharacterSlot() {
  return (
    <div
      aria-label="캐릭터 이미지 자리"
      className="grid size-12 shrink-0 place-items-center rounded-full border border-brand-gold bg-brand-cream font-display text-[10px] text-brand-gold-foreground min-[390px]:size-14"
    >
      캐릭터
    </div>
  );
}

function HeroCharacterSlot() {
  return (
    <div
      aria-label="캐릭터 이미지 자리"
      className="grid size-[88px] shrink-0 place-items-center rounded-full border border-brand-gold bg-brand-cream font-display text-sm text-brand-gold-foreground min-[390px]:size-[104px]"
    >
      캐릭터
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="shrink-0 font-display text-[21px] font-bold leading-none text-foreground">
        {children}
      </h2>
      <span aria-hidden="true" className="h-px w-full bg-border" />
    </div>
  );
}

function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-3.5 ${
        compact ? "min-h-[92px]" : "min-h-[108px]"
      }`}
    >
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-3.5 w-full" />
      <Skeleton className="mt-1.5 h-3.5 w-4/5" />
    </div>
  );
}

function HomeProductSectionsSkeleton() {
  return (
    <div aria-busy="true" aria-label="홈 풀이 상품을 불러오는 중">
      <section className="mt-6 px-4">
        <SectionTitle>함께 보는 풀이</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <Skeleton className="h-[252px] rounded-[22px]" />
      </section>

      <section className="mt-6 px-4">
        <SectionTitle>오늘 · 이번 달 · 앞으로</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <ProductCardSkeleton compact key={index} />
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <Skeleton className="h-[78px] rounded-2xl" />
      </section>
    </div>
  );
}

export function HomeProductSections() {
  const { data, error, isError, isFetching, isPending, refetch } = useQuery(
    readingProductQueries.list(),
  );
  const shouldShowSkeleton = useMinimumLoadingTime(
    isPending,
    MINIMUM_SKELETON_DURATION_MS,
  );

  if (shouldShowSkeleton) {
    return <HomeProductSectionsSkeleton />;
  }

  if (isError && !data) {
    const message = isApiClientError(error)
      ? error.message
      : "예상하지 못한 오류가 발생했습니다.";

    return (
      <section className="mt-6 px-4" role="alert">
        <div className="rounded-2xl border border-paper-border bg-paper px-5 py-6 text-center">
          <h2 className="font-display text-lg font-bold text-foreground">
            풀이 상품을 불러오지 못했어요
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {message}
          </p>
          <Button
            className="mt-4 h-11 rounded-full border-foreground px-5 text-sm"
            disabled={isFetching}
            onClick={() => void refetch()}
            variant="outline"
          >
            {isFetching ? "다시 불러오는 중" : "다시 시도"}
          </Button>
        </div>
      </section>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <section className="mt-6 px-4">
        <div className="rounded-2xl border border-paper-border bg-paper px-5 py-6 text-center">
          <h2 className="font-display text-lg font-bold text-foreground">
            표시할 풀이 상품이 없어요
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            새로운 풀이를 준비하고 있습니다.
          </p>
        </div>
      </section>
    );
  }

  const productsByCode = new Map(
    data.products.map((product) => [product.code, product]),
  );
  const detailedSaju = productsByCode.get("detailed-saju");
  const dailyFortune = productsByCode.get("daily-fortune");

  return (
    <div aria-busy={isFetching}>
      <section className="mt-6 px-4">
        <SectionTitle>함께 보는 풀이</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
          {togetherProductPlacements.map((placement) => {
            const product = productsByCode.get(placement.code);

            if (!product) {
              return null;
            }

            const Icon = placement.icon;

            return (
              <Link
                className="grid min-h-[108px] grid-cols-[minmax(0,1fr)_48px] items-center gap-2 rounded-2xl border border-border bg-surface p-3.5 min-[390px]:grid-cols-[minmax(0,1fr)_56px]"
                href={routes.reading(product.code)}
                key={product.code}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className="shrink-0 text-primary"
                      size={17}
                      strokeWidth={1.8}
                    />
                    <h3 className="text-[13px] font-bold text-foreground">
                      {product.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.55] text-muted-foreground">
                    {placement.description}
                  </p>
                </div>
                <CharacterSlot />
              </Link>
            );
          })}
        </div>
      </section>

      {detailedSaju ? (
        <section className="mt-6 px-4">
          <div className="grid min-h-[252px] grid-cols-[minmax(0,1fr)_88px] items-center gap-2 overflow-hidden rounded-[22px] bg-hero px-5 py-6 text-primary-foreground shadow-soft min-[390px]:grid-cols-[minmax(0,1fr)_104px]">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#e4bd61]">
                AI 프리미엄 {detailedSaju.title}
              </p>
              <h1 className="mt-3 font-display text-[25px] font-bold leading-[1.38]">
                AI가 풀어주는
                <br />
                나의 사주 이야기
              </h1>
              <p className="mt-3 text-[13px] leading-6 text-hero-foreground">
                타고난 운명과 흐름을
                <br />
                쉽고 깊이 있게 풀어드려요.
              </p>
              <Link
                className="mt-5 flex h-11 w-full items-center justify-center gap-1 rounded-full bg-[#e1b957] px-3 text-[12px] font-bold text-[#2b3441]"
                href={routes.reading(detailedSaju.code)}
              >
                {detailedSaju.title} 시작하기
                <ChevronRight size={17} strokeWidth={2} />
              </Link>
            </div>
            <HeroCharacterSlot />
          </div>
        </section>
      ) : null}

      <section className="mt-6 px-4">
        <SectionTitle>오늘 · 이번 달 · 앞으로</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {nearFortunePlacements.map((placement) => {
            const product = productsByCode.get(placement.code);

            if (!product) {
              return null;
            }

            const Icon = placement.icon;

            return (
              <Link
                className="flex min-h-[92px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-2 py-3 text-center"
                href={routes.reading(product.code)}
                key={product.code}
              >
                <Icon className="text-primary" size={24} strokeWidth={1.6} />
                <h3 className="mt-2 text-[12px] font-bold text-foreground">
                  {product.title}
                </h3>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {placement.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {dailyFortune ? (
        <section className="mt-5 px-4">
          <Link
            className="flex min-h-[78px] items-center gap-3 rounded-2xl border border-paper-border bg-surface px-4 py-3"
            href={routes.reading(dailyFortune.code)}
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gold-soft text-[#936c21]">
              <SunMedium size={25} strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[17px] font-bold text-foreground">
                {dailyFortune.title} · {getReadingAccessLabel(dailyFortune)}
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                매일 달라지는 오늘의 흐름을 확인해보세요
              </p>
            </div>
            <span className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-paper-border px-3 text-[11px] font-semibold text-[#8b6826]">
              보기
              <ChevronRight size={14} />
            </span>
          </Link>
        </section>
      ) : null}
    </div>
  );
}
