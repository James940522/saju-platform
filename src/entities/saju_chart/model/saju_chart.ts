export type CalendarType = "solar" | "lunar";

export type LuckCycleGender = "male" | "female";

export type FiveElementCode = "wood" | "fire" | "earth" | "metal" | "water";

export type YinYangCode = "yang" | "yin";

export type HeavenlyStemCode =
  | "gap"
  | "eul"
  | "byeong"
  | "jeong"
  | "mu"
  | "gi"
  | "gyeong"
  | "sin"
  | "im"
  | "gye";

export type EarthlyBranchCode =
  | "ja"
  | "chuk"
  | "in"
  | "myo"
  | "jin"
  | "sa"
  | "o"
  | "mi"
  | "sin"
  | "yu"
  | "sul"
  | "hae";

export type TenGodCode =
  | "day_master"
  | "bi_gyeon"
  | "geop_jae"
  | "sik_sin"
  | "sang_gwan"
  | "pyeon_jae"
  | "jeong_jae"
  | "pyeon_gwan"
  | "jeong_gwan"
  | "pyeon_in"
  | "jeong_in";

export type BirthDate = {
  year: number;
  month: number;
  day: number;
};

export type BirthTime =
  | {
      precision: "exact";
      hour: number;
      minute: number;
    }
  | {
      precision: "unknown";
    };

export type BirthInput = {
  calendarType: CalendarType;
  isLeapMonth: boolean;
  date: BirthDate;
  time: BirthTime;
  luckCycleGender: LuckCycleGender | null;
};

export type StemSymbol = {
  code: HeavenlyStemCode;
  korean: string;
  hanja: string;
  element: FiveElementCode;
  yinYang: YinYangCode;
};

export type BranchSymbol = {
  code: EarthlyBranchCode;
  korean: string;
  hanja: string;
  element: FiveElementCode;
  yinYang: YinYangCode;
};

export type VoidBranch = Pick<
  BranchSymbol,
  "code" | "korean" | "hanja"
>;

export type Ganji = {
  korean: string;
  hanja: string;
  stem: StemSymbol;
  branch: BranchSymbol;
};

export type NatalPillar = Ganji & {
  tenGods: {
    stem: TenGodCode;
    branch: TenGodCode;
  };
};

export type ElementDistribution = {
  method: "eight-symbol-count-v1";
  totalSymbols: 6 | 8;
  counts: Record<FiveElementCode, number>;
};

export type LuckCycleDirection = "forward" | "backward";

export type LuckCycleStart = {
  roundedAge: number;
  years: number;
  months: number;
  days: number;
};

export type LuckCycleItem = {
  sequence: number;
  startAge: number;
  ganji: Ganji;
};

export type LuckCycle = {
  direction: LuckCycleDirection;
  start: LuckCycleStart;
  items: readonly LuckCycleItem[];
};

export type SajuChartWarningCode =
  | "birth_time_unknown"
  | "luck_cycle_unavailable"
  | "near_solar_term_boundary";

export type SajuChartWarning = {
  code: SajuChartWarningCode;
  message: string;
};

export type SajuChartNormalizedBirth = {
  calendarType: CalendarType;
  inputDate: BirthDate;
  solarDate: BirthDate;
  lunarDate: BirthDate & {
    isLeapMonth: boolean;
  };
  time: BirthTime;
  luckCycleGender: LuckCycleGender | null;
  timezone: "Asia/Seoul";
};

export type SajuChartSnapshotV1 = {
  schemaVersion: 1;
  quality: "complete" | "partial";
  calculation: {
    engine: "manseryeok";
    engineVersion: string;
    policyVersion: string;
    calculatedAt: string;
  };
  normalizedBirth: SajuChartNormalizedBirth;
  pillars: {
    year: NatalPillar;
    month: NatalPillar;
    day: NatalPillar;
    hour: NatalPillar | null;
  };
  dayMaster: StemSymbol;
  elementDistribution: ElementDistribution;
  voidBranches: readonly VoidBranch[];
  luckCycle: LuckCycle | null;
  warnings: readonly SajuChartWarning[];
};

export type SajuChartSnapshot = SajuChartSnapshotV1;
