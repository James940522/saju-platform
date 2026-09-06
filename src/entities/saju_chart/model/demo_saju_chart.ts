import type { SajuChartSnapshotV1 } from "./saju_chart";

export const DEMO_SAJU_CHART_SNAPSHOT: SajuChartSnapshotV1 = {
  schemaVersion: 1,
  quality: "complete",
  calculation: {
    engine: "manseryeok",
    engineVersion: "2.0.0",
    policyVersion: "kr-kst-midnight-v1",
    calculatedAt: "2026-09-03T00:00:00.000Z",
  },
  normalizedBirth: {
    calendarType: "solar",
    inputDate: { year: 1992, month: 10, day: 24 },
    solarDate: { year: 1992, month: 10, day: 24 },
    lunarDate: { year: 1992, month: 9, day: 29, isLeapMonth: false },
    time: { precision: "exact", hour: 5, minute: 30 },
    luckCycleGender: null,
    timezone: "Asia/Seoul",
  },
  pillars: {
    year: {
      korean: "임신",
      hanja: "壬申",
      stem: {
        code: "im",
        korean: "임",
        hanja: "壬",
        element: "water",
        yinYang: "yang",
      },
      branch: {
        code: "sin",
        korean: "신",
        hanja: "申",
        element: "metal",
        yinYang: "yang",
      },
      tenGods: { stem: "geop_jae", branch: "jeong_in" },
    },
    month: {
      korean: "경술",
      hanja: "庚戌",
      stem: {
        code: "gyeong",
        korean: "경",
        hanja: "庚",
        element: "metal",
        yinYang: "yang",
      },
      branch: {
        code: "sul",
        korean: "술",
        hanja: "戌",
        element: "earth",
        yinYang: "yang",
      },
      tenGods: { stem: "jeong_in", branch: "jeong_gwan" },
    },
    day: {
      korean: "계유",
      hanja: "癸酉",
      stem: {
        code: "gye",
        korean: "계",
        hanja: "癸",
        element: "water",
        yinYang: "yin",
      },
      branch: {
        code: "yu",
        korean: "유",
        hanja: "酉",
        element: "metal",
        yinYang: "yin",
      },
      tenGods: { stem: "day_master", branch: "pyeon_in" },
    },
    hour: {
      korean: "을묘",
      hanja: "乙卯",
      stem: {
        code: "eul",
        korean: "을",
        hanja: "乙",
        element: "wood",
        yinYang: "yin",
      },
      branch: {
        code: "myo",
        korean: "묘",
        hanja: "卯",
        element: "wood",
        yinYang: "yin",
      },
      tenGods: { stem: "sik_sin", branch: "sik_sin" },
    },
  },
  dayMaster: {
    code: "gye",
    korean: "계",
    hanja: "癸",
    element: "water",
    yinYang: "yin",
  },
  elementDistribution: {
    method: "eight-symbol-count-v1",
    totalSymbols: 8,
    counts: {
      wood: 2,
      fire: 0,
      earth: 1,
      metal: 3,
      water: 2,
    },
  },
  voidBranches: [
    {
      code: "sul",
      korean: "술",
      hanja: "戌",
    },
    {
      code: "hae",
      korean: "해",
      hanja: "亥",
    },
  ],
  luckCycle: null,
  warnings: [
    {
      code: "luck_cycle_unavailable",
      message: "성별 기준값이 없어 대운 정보는 이 예시에서 제외했어요.",
    },
  ],
};
