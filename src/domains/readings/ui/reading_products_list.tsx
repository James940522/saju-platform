"use client";

import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarHeart,
  Coins,
  HeartHandshake,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  getReadingAccessLabel,
  readingProductQueries,
  type ReadingTheme,
} from "@/entities/reading";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";
import { useMinimumLoadingTime } from "@/shared/lib";
import { Button, Skeleton } from "@/shared/ui";

const MINIMUM_SKELETON_DURATION_MS =
  process.env.NODE_ENV === "development" ? 1_500 : 0;

const themeIcons: Record<ReadingTheme, LucideIcon> = {
  self: ScrollText,
  relationship: HeartHandshake,
  fortune: CalendarHeart,
  wealth: Coins,
  career: BriefcaseBusiness,
  question: MessageCircleQuestion,
};

function ReadingProductCardSkeleton() {
  return (
    <div className="min-h-[158px] rounded-2xl border border-border bg-surface p-4">
      <Skeleton className="size-10 rounded-xl" />
      <Skeleton className="mt-4 h-5 w-3/5" />
      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="mt-3 h-4 w-16" />
    </div>
  );
}

function ReadingProductsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="풀이 상품을 불러오는 중"
      className="mt-6 grid grid-cols-2 gap-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <ReadingProductCardSkeleton key={index} />
      ))}
    </section>
  );
}

export function ReadingProductsList() {
  const { data, error, isError, isFetching, isPending, refetch } = useQuery(
    readingProductQueries.list(),
  );
  const shouldShowSkeleton = useMinimumLoadingTime(
    isPending,
    MINIMUM_SKELETON_DURATION_MS,
  );

  if (shouldShowSkeleton) {
    return <ReadingProductsSkeleton />;
  }

  if (isError && !data) {
    const message = isApiClientError(error)
      ? error.message
      : "예상하지 못한 오류가 발생했습니다.";

    return (
      <section
        className="mt-6 rounded-2xl border border-paper-border bg-paper px-5 py-6 text-center"
        role="alert"
      >
        <h2 className="font-display text-lg font-bold text-foreground">
          풀이 상품을 불러오지 못했어요
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{message}</p>
        <Button
          className="mt-4 h-11 rounded-full border-foreground px-5 text-sm"
          disabled={isFetching}
          onClick={() => void refetch()}
          variant="outline"
        >
          {isFetching ? "다시 불러오는 중" : "다시 시도"}
        </Button>
      </section>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <section className="mt-6 rounded-2xl border border-paper-border bg-paper px-5 py-6 text-center">
        <h2 className="font-display text-lg font-bold text-foreground">
          표시할 풀이 상품이 없어요
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          새로운 풀이를 준비하고 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-busy={isFetching}
      className="mt-6 grid grid-cols-2 gap-3"
    >
      {data.products.map((reading) => {
        const Icon = themeIcons[reading.theme];

        return (
          <Link
            className="min-h-[158px] rounded-2xl border border-border bg-surface p-4"
            href={routes.reading(reading.code)}
            key={reading.code}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">
              {reading.title}
            </h2>
            <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
              {reading.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {getReadingAccessLabel(reading)}
            </p>
          </Link>
        );
      })}
    </section>
  );
}
