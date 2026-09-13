import type {
  BranchSymbol,
  FiveElementCode,
  NatalPillar,
  SajuChartSnapshot,
  StemSymbol,
  TenGodCode,
} from "../model/saju_chart";

import { ELEMENT_THEMES } from "../config/element_theme";
import type {
  ManseoryeokChartViewModel,
  PillarColumnViewModel,
  PillarPosition,
  SymbolCellViewModel,
} from "../model/manseoryeok_view_model";

const PILLAR_ORDER: readonly PillarPosition[] = [
  "year",
  "month",
  "day",
  "hour",
];

const PILLAR_LABELS: Record<PillarPosition, string> = {
  year: "년주",
  month: "월주",
  day: "일주",
  hour: "시주",
};

const TEN_GOD_LABELS: Record<TenGodCode, string> = {
  day_master: "일간",
  bi_gyeon: "비견",
  geop_jae: "겁재",
  sik_sin: "식신",
  sang_gwan: "상관",
  pyeon_jae: "편재",
  jeong_jae: "정재",
  pyeon_gwan: "편관",
  jeong_gwan: "정관",
  pyeon_in: "편인",
  jeong_in: "정인",
};

const ELEMENT_ORDER: readonly FiveElementCode[] = [
  "wood",
  "fire",
  "earth",
  "metal",
  "water",
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDate(date: { year: number; month: number; day: number }) {
  return `${date.year}.${pad(date.month)}.${pad(date.day)}`;
}

function toSymbolCellViewModel(
  symbol: StemSymbol | BranchSymbol,
  tenGod: TenGodCode,
): SymbolCellViewModel {
  return {
    hanja: symbol.hanja,
    korean: symbol.korean,
    element: symbol.element,
    elementLabel: ELEMENT_THEMES[symbol.element].label,
    yinYangLabel: symbol.yinYang === "yang" ? "양" : "음",
    tenGodLabel: TEN_GOD_LABELS[tenGod],
  };
}

function toPillarColumnViewModel(
  position: PillarPosition,
  pillar: NatalPillar | null,
): PillarColumnViewModel {
  if (!pillar) {
    return {
      position,
      title: PILLAR_LABELS[position],
      isDayMaster: false,
      isUnknown: true,
      stem: null,
      branch: null,
    };
  }

  return {
    position,
    title: PILLAR_LABELS[position],
    isDayMaster: position === "day",
    isUnknown: false,
    stem: toSymbolCellViewModel(pillar.stem, pillar.tenGods.stem),
    branch: toSymbolCellViewModel(pillar.branch, pillar.tenGods.branch),
  };
}

export function toManseoryeokViewModel(
  snapshot: SajuChartSnapshot,
): ManseoryeokChartViewModel {
  const birth = snapshot.normalizedBirth;
  const timeLabel =
    birth.time.precision === "exact"
      ? `${pad(birth.time.hour)}:${pad(birth.time.minute)}`
      : "시간 미상";
  const calendarLabel = birth.calendarType === "solar" ? "양력" : "음력";
  const correction = birth.timeCorrection;
  const timePolicyLabel = correction
    ? "한국시 보정 · 보정 시각의 자정 기준"
    : snapshot.calculation.policyVersion === "kr-kst-midnight-v1"
      ? "한국 표준시 · 보정 미적용 · 자정 기준"
      : "저장된 계산 기준";
  const timeCorrectionSummary =
    correction?.correctedTime &&
    correction.correctedSolarDate &&
    correction.adjustmentMinutes !== null
      ? `${correction.adjustmentMinutes === 0 ? "당시 표준시 기준 · 보정 0분" : `한국시 보정 · ${Math.abs(correction.adjustmentMinutes)}분 ${correction.adjustmentMinutes < 0 ? "빼기" : "더하기"}`} → 양력 ${formatDate(correction.correctedSolarDate)} ${pad(correction.correctedTime.hour)}:${pad(correction.correctedTime.minute)}`
      : correction
        ? "한국시 보정 기준 · 시간 미상으로 보정 시각을 확정하지 않았어요."
        : null;
  const dayPillar = snapshot.pillars.day;
  const dayMaster = toSymbolCellViewModel(
    snapshot.dayMaster,
    dayPillar.tenGods.stem,
  );

  return {
    qualityLabel: snapshot.quality === "complete" ? "전체 명식" : "부분 명식",
    birthSummary: `${formatDate(birth.inputDate)} · ${calendarLabel} · ${timeLabel}`,
    normalizedDateSummary: `양력 ${formatDate(birth.solarDate)} · 음력 ${formatDate(birth.lunarDate)}${birth.lunarDate.isLeapMonth ? " 윤달" : ""}`,
    timeCorrectionSummary,
    timePolicyLabel,
    pillars: PILLAR_ORDER.map((position) =>
      toPillarColumnViewModel(position, snapshot.pillars[position]),
    ),
    dayMaster,
    elementDistribution: {
      methodLabel: `원국 ${snapshot.elementDistribution.totalSymbols}글자 단순 집계`,
      totalSymbols: snapshot.elementDistribution.totalSymbols,
      items: ELEMENT_ORDER.map((code) => ({
        code,
        label: ELEMENT_THEMES[code].label,
        hanja: ELEMENT_THEMES[code].hanja,
        count: snapshot.elementDistribution.counts[code],
      })),
    },
    voidBranches: snapshot.voidBranches.map(
      (branch) => `${branch.korean} ${branch.hanja}`,
    ),
    warnings: snapshot.warnings
      .filter((warning) => warning.code !== "luck_cycle_unavailable")
      .map((warning) => warning.message),
    calculationMeta: `스키마 v${snapshot.schemaVersion} · ${snapshot.calculation.engine} ${snapshot.calculation.engineVersion} · ${snapshot.calculation.policyVersion}`,
  };
}
