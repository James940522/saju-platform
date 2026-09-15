import { ApiClientError, requestApi } from "@/shared/api";
import { toWealthRankingResult } from "../lib/to_wealth_ranking_result";
import { getDemoWealthRanking } from "../model/demo_wealth_ranking";

export async function createWealthRanking(
  chartIds: readonly string[],
  signal?: AbortSignal,
) {
  const response = await requestApi<unknown, { chartIds: readonly string[] }>({
    method: "POST",
    url: "/v1/readings/wealth-ranking",
    data: { chartIds },
    // Backend allows up to 10 minutes for AI; reserve 1 minute for verification and transport.
    timeout: 11 * 60_000,
    signal,
  }, () => getDemoWealthRanking(chartIds));
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
