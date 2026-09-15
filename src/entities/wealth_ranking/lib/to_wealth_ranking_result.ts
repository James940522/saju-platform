import {
  MAX_WEALTH_PARTICIPANTS,
  MIN_WEALTH_PARTICIPANTS,
  type WealthRankingResult,
  type PublicWealthRankingResult,
} from "../model/wealth_ranking";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength = Number.MAX_SAFE_INTEGER): string {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) {
    throw new Error("Invalid wealth ranking text");
  }
  return value;
}

export function toPublicWealthRankingResult(
  value: unknown,
): PublicWealthRankingResult {
  if (
    !isRecord(value) ||
    !Array.isArray(value.ranking) ||
    value.ranking.length < MIN_WEALTH_PARTICIPANTS ||
    value.ranking.length > MAX_WEALTH_PARTICIPANTS
  ) {
    throw new Error("Invalid public reading result");
  }
  return {
    ranking: value.ranking.map((entry: unknown, index) => {
      if (!isRecord(entry) || entry.rank !== index + 1)
        throw new Error("Invalid public ranking");
      return {
        rank: index + 1,
        displayName: text(entry.displayName, 30),
        fortune: text(entry.fortune, 140),
      };
    }),
    rationale: text(value.rationale, 3600),
    comparisonTitle:
      value.comparisonTitle === undefined
        ? "함께 살펴보는 재물의 흐름"
        : text(value.comparisonTitle, 60),
    notice: text(value.notice),
  };
}

// Preserve server order and reject incomplete results; never rank participants here.
export function toWealthRankingResult(
  value: unknown,
  chartIds: readonly string[],
): WealthRankingResult {
  if (
    !isRecord(value) ||
    value.productCode !== "wealth-ranking" ||
    value.schemaVersion !== 1 ||
    !Array.isArray(value.ranking) ||
    value.ranking.length !== chartIds.length ||
    value.ranking.length < MIN_WEALTH_PARTICIPANTS ||
    value.ranking.length > MAX_WEALTH_PARTICIPANTS
  ) {
    throw new Error("Invalid wealth ranking response");
  }
  const remaining = new Set(chartIds);
  if (remaining.size !== chartIds.length)
    throw new Error("Duplicate chart IDs");
  const ranking = value.ranking.map((entry: unknown, index) => {
    if (
      !isRecord(entry) ||
      entry.rank !== index + 1 ||
      typeof entry.chartId !== "string" ||
      !remaining.delete(entry.chartId) ||
      (entry.quality !== "complete" && entry.quality !== "partial") ||
      !Array.isArray(entry.warnings)
    ) {
      throw new Error("Invalid wealth ranking entry");
    }
    return {
      rank: index + 1,
      chartId: entry.chartId,
      displayName: text(entry.displayName, 30),
      fortune: text(entry.fortune, 140),
      isPartial: entry.quality === "partial",
      calculationNotes: entry.warnings.map((warning: unknown) => {
        if (!isRecord(warning) || typeof warning.code !== "string")
          throw new Error("Invalid chart warning");
        return text(warning.message);
      }),
    };
  });
  return {
    ranking,
    rationale: text(value.rationale, 600),
    comparisonTitle:
      value.comparisonTitle === undefined
        ? "함께 살펴보는 재물의 흐름"
        : text(value.comparisonTitle, 60),
    notice: text(value.notice),
  };
}
