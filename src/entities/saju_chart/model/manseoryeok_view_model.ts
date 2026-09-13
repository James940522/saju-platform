import type { FiveElementCode } from "./saju_chart";

export type PillarPosition = "year" | "month" | "day" | "hour";

export type SymbolCellViewModel = {
  hanja: string;
  korean: string;
  element: FiveElementCode;
  elementLabel: string;
  yinYangLabel: string;
  tenGodLabel: string;
};

export type PillarColumnViewModel = {
  position: PillarPosition;
  title: string;
  isDayMaster: boolean;
  isUnknown: boolean;
  stem: SymbolCellViewModel | null;
  branch: SymbolCellViewModel | null;
};

export type ElementDistributionItemViewModel = {
  code: FiveElementCode;
  label: string;
  hanja: string;
  count: number;
};

export type ManseoryeokChartViewModel = {
  qualityLabel: string;
  birthSummary: string;
  normalizedDateSummary: string;
  timeCorrectionSummary: string | null;
  timePolicyLabel: string;
  pillars: readonly PillarColumnViewModel[];
  dayMaster: SymbolCellViewModel;
  elementDistribution: {
    methodLabel: string;
    totalSymbols: 6 | 8;
    items: readonly ElementDistributionItemViewModel[];
  };
  voidBranches: readonly string[];
  warnings: readonly string[];
  calculationMeta: string;
};
