export const MIN_WEALTH_PARTICIPANTS = 2;
export const MAX_WEALTH_PARTICIPANTS = 5;

export type WealthRankingEntry = {
  rank: number;
  chartId: string;
  displayName: string;
  fortune: string;
  isPartial: boolean;
  calculationNotes: string[];
};

export type WealthRankingResult = {
  ranking: WealthRankingEntry[];
  rationale: string;
  notice: string;
};
