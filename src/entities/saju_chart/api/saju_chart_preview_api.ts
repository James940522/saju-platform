import { ApiClientError, requestApi } from "@/shared/api";
import { getDemoChartSnapshot } from "../model/demo_saju_profiles";

import type { SajuChartSnapshot } from "../model/saju_chart";
import type { CreateSajuProfileRequestDto } from "./saju_chart_dto";

export type PreviewSajuChartRequestDto = Pick<CreateSajuProfileRequestDto, "birth">;

// Keep the acknowledgement state during the client-first calculation rollout.
export type PreviewSajuChartDataDto =
  | { status: "received"; snapshot: null }
  | { status: "calculated"; snapshot: SajuChartSnapshot };

export async function previewSajuChart(
  request: PreviewSajuChartRequestDto,
  signal?: AbortSignal,
): Promise<PreviewSajuChartDataDto> {
  const { data } = await requestApi<PreviewSajuChartDataDto, PreviewSajuChartRequestDto>({
    method: "POST",
    url: "/v1/saju-charts/preview",
    data: request,
    signal,
  }, () => ({ status: "calculated", snapshot: getDemoChartSnapshot() }));

  if (
    typeof data !== "object" ||
    data === null ||
    !("status" in data) ||
    !("snapshot" in data) ||
    !(
      (data.status === "received" && data.snapshot === null) ||
      (data.status === "calculated" && data.snapshot?.schemaVersion === 1)
    )
  ) {
    throw new ApiClientError({
      code: 200,
      message: "만세력 응답을 읽지 못했어요. 다시 시도해주세요.",
      data: { reason: "INVALID_API_RESPONSE" },
    });
  }

  return data;
}
