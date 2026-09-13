"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  ManseoryeokChart,
  previewSajuChart,
  type PreviewSajuChartRequestDto,
} from "@/entities/saju_chart";
import { isApiClientError } from "@/shared/api";

const INPUT_DEBOUNCE_MS = 350;

// The parent keys this component by birth input. A change unmounts the old
// query, aborts its request and starts a fresh debounce without stale results.
export function SajuChartPreview({
  request,
}: {
  request: PreviewSajuChartRequestDto;
}) {
  const [canRequest, setCanRequest] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setCanRequest(true),
      INPUT_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  const preview = useQuery({
    queryKey: ["saju-charts", "preview", request],
    queryFn: ({ signal }) => previewSajuChart(request, signal),
    enabled: canRequest,
    retry: false,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (
    preview.isSuccess &&
    !preview.isFetching &&
    preview.data.status === "calculated"
  ) {
    return (
      <div>
        <p className="sr-only" role="status" aria-live="polite">
          만세력 계산이 완료됐어요.
        </p>
        <ManseoryeokChart snapshot={preview.data.snapshot} variant="preview" />
      </div>
    );
  }

  const needsInputChange =
    preview.isError &&
    isApiClientError(preview.error) &&
    preview.error.code === 400;
  const isBoundaryDate =
    preview.isError &&
    isApiClientError(preview.error) &&
    preview.error.data?.reason === "BIRTH_TIME_REQUIRED_ON_BOUNDARY_DATE";

  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <p aria-live="polite" role="status" className="text-xs text-foreground">
        {preview.isFetching || preview.isPending
          ? "만세력을 계산하고 있어요."
          : preview.isError
            ? isApiClientError(preview.error)
              ? isBoundaryDate
                ? "이날은 절기가 바뀌어 태어난 시각에 따라 사주가 달라져요. 출생 시간을 입력해주세요."
                : preview.error.message
              : "만세력을 불러오지 못했어요. 다시 시도해주세요."
            : "입력 정보가 전달됐어요."}
      </p>
      {needsInputChange && !preview.isFetching ? (
        <p className="mt-2 text-xs text-muted-foreground">
          입력을 수정하면 자동으로 다시 계산해요.
        </p>
      ) : preview.isError && !preview.isFetching ? (
        <button
          className="mt-2 text-xs font-semibold text-primary underline underline-offset-2"
          onClick={() => void preview.refetch()}
          type="button"
        >
          다시 시도
        </button>
      ) : null}
      {preview.isSuccess && !preview.isFetching ? (
        <p className="mt-1 text-[10px] text-muted-foreground">
          만세력 미리보기는 준비 중이에요.
        </p>
      ) : null}
    </div>
  );
}
