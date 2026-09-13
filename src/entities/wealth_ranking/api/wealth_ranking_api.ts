import { ApiClientError, requestApi } from "@/shared/api";
import { toWealthRankingResult } from "../lib/to_wealth_ranking_result";

export async function createWealthRanking(
  chartIds: readonly string[],
  signal?: AbortSignal,
) {
  const response = await requestApi<unknown, { chartIds: readonly string[] }>({
    method: "POST",
    url: "/v1/readings/wealth-ranking",
    data: { chartIds },
    // Backend supports up to 60 seconds for generation; the shared 10s timeout is too short.
    timeout: 70_000,
    signal,
  });
  try {
    return toWealthRankingResult(response.data, chartIds);
  } catch {
    throw new ApiClientError({
      code: response.code,
      message: "풀이 결과를 확인하지 못했어요. 잠시 후 다시 시도해주세요.",
      data: { reason: "INVALID_API_RESPONSE" },
    });
  }
}
