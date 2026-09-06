import type {
  BranchSymbol,
  FiveElementCode,
  NatalPillar,
  SajuChartSnapshot,
  StemSymbol,
  TenGodCode,
} from "@/entities/saju_chart";

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
  const dayPillar = snapshot.pillars.day;
  const dayMaster = toSymbolCellViewModel(
    snapshot.dayMaster,
    dayPillar.tenGods.stem,
  );

  return {
    qualityLabel:
      snapshot.quality === "complete" ? "전체 명식" : "부분 명식",
    birthSummary: `${formatDate(birth.inputDate)} · ${calendarLabel} · ${timeLabel}`,
    normalizedDateSummary: `양력 ${formatDate(birth.solarDate)} · 음력 ${formatDate(birth.lunarDate)}${birth.lunarDate.isLeapMonth ? " 윤달" : ""}`,
    pillars: PILLAR_ORDER.map((position) =>
      toPillarColumnViewModel(position, snapshot.pillars[position]),
    ),
    dayMaster,
    elementDistribution: {
      methodLabel: "원국 8글자 단순 집계",
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
    luckCycle: snapshot.luckCycle
      ? {
          directionLabel:
            snapshot.luckCycle.direction === "forward" ? "순행" : "역행",
          startLabel: `${snapshot.luckCycle.start.roundedAge}세 시작 · ${snapshot.luckCycle.start.years}년 ${snapshot.luckCycle.start.months}개월 ${snapshot.luckCycle.start.days}일`,
          items: snapshot.luckCycle.items.map((item) => ({
            sequence: item.sequence,
            startAge: item.startAge,
            ganji: item.ganji.korean,
            hanja: item.ganji.hanja,
          })),
        }
      : null,
    warnings: snapshot.warnings.map((warning) => warning.message),
    calculationMeta: `스키마 v${snapshot.schemaVersion} · ${snapshot.calculation.engine} ${snapshot.calculation.engineVersion} · ${snapshot.calculation.policyVersion}`,
  };
}
