import type { SajuChartSnapshot } from "./saju_chart";

// Fixed example calculated once by the backend; never calculate a chart in the browser.
export const DEMO_CHART_SNAPSHOT: SajuChartSnapshot = {
  "schemaVersion": 1,
  "quality": "complete",
  "calculation": {
    "engine": "manseryeok",
    "engineVersion": "2.0.0",
    "policyVersion": "kr-mean-solar-midnight-v2",
    "calculatedAt": "2026-09-15T00:00:00.000Z",
    "timeZoneDatabaseVersion": "2026c"
  },
  "normalizedBirth": {
    "calendarType": "solar",
    "inputDate": {
      "year": 1992,
      "month": 10,
      "day": 24
    },
    "solarDate": {
      "year": 1992,
      "month": 10,
      "day": 24
    },
    "lunarDate": {
      "year": 1992,
      "month": 9,
      "day": 29,
      "isLeapMonth": false
    },
    "time": {
      "precision": "exact",
      "hour": 5,
      "minute": 30
    },
    "luckCycleGender": "male",
    "timezone": "Asia/Seoul",
    "timeCorrection": {
      "method": "korean_mean_solar",
      "referenceLongitude": 127.5,
      "equationOfTimeApplied": false,
      "civilUtcOffsetMinutes": 540,
      "adjustmentMinutes": -30,
      "correctedSolarDate": {
        "year": 1992,
        "month": 10,
        "day": 24
      },
      "correctedTime": {
        "hour": 5,
        "minute": 0
      }
    }
  },
  "pillars": {
    "year": {
      "korean": "임신",
      "hanja": "壬申",
      "stem": {
        "code": "im",
        "korean": "임",
        "hanja": "壬",
        "element": "water",
        "yinYang": "yang"
      },
      "branch": {
        "code": "sin",
        "korean": "신",
        "hanja": "申",
        "element": "metal",
        "yinYang": "yang"
      },
      "tenGods": {
        "stem": "geop_jae",
        "branch": "jeong_in"
      }
    },
    "month": {
      "korean": "경술",
      "hanja": "庚戌",
      "stem": {
        "code": "gyeong",
        "korean": "경",
        "hanja": "庚",
        "element": "metal",
        "yinYang": "yang"
      },
      "branch": {
        "code": "sul",
        "korean": "술",
        "hanja": "戌",
        "element": "earth",
        "yinYang": "yang"
      },
      "tenGods": {
        "stem": "jeong_in",
        "branch": "jeong_gwan"
      }
    },
    "day": {
      "korean": "계유",
      "hanja": "癸酉",
      "stem": {
        "code": "gye",
        "korean": "계",
        "hanja": "癸",
        "element": "water",
        "yinYang": "yin"
      },
      "branch": {
        "code": "yu",
        "korean": "유",
        "hanja": "酉",
        "element": "metal",
        "yinYang": "yin"
      },
      "tenGods": {
        "stem": "day_master",
        "branch": "pyeon_in"
      }
    },
    "hour": {
      "korean": "을묘",
      "hanja": "乙卯",
      "stem": {
        "code": "eul",
        "korean": "을",
        "hanja": "乙",
        "element": "wood",
        "yinYang": "yin"
      },
      "branch": {
        "code": "myo",
        "korean": "묘",
        "hanja": "卯",
        "element": "wood",
        "yinYang": "yin"
      },
      "tenGods": {
        "stem": "sik_sin",
        "branch": "sik_sin"
      }
    }
  },
  "dayMaster": {
    "code": "gye",
    "korean": "계",
    "hanja": "癸",
    "element": "water",
    "yinYang": "yin"
  },
  "elementDistribution": {
    "method": "eight-symbol-count-v1",
    "totalSymbols": 8,
    "counts": {
      "wood": 2,
      "fire": 0,
      "earth": 1,
      "metal": 3,
      "water": 2
    }
  },
  "voidBranches": [
    {
      "code": "sul",
      "korean": "술",
      "hanja": "戌"
    },
    {
      "code": "hae",
      "korean": "해",
      "hanja": "亥"
    }
  ],
  "luckCycle": {
    "direction": "forward",
    "start": {
      "roundedAge": 5,
      "years": 4,
      "months": 9,
      "days": 7
    },
    "items": [
      {
        "sequence": 1,
        "startAge": 5,
        "ganji": {
          "korean": "신해",
          "hanja": "辛亥",
          "stem": {
            "code": "sin",
            "korean": "신",
            "hanja": "辛",
            "element": "metal",
            "yinYang": "yin"
          },
          "branch": {
            "code": "hae",
            "korean": "해",
            "hanja": "亥",
            "element": "water",
            "yinYang": "yin"
          }
        }
      },
      {
        "sequence": 2,
        "startAge": 15,
        "ganji": {
          "korean": "임자",
          "hanja": "壬子",
          "stem": {
            "code": "im",
            "korean": "임",
            "hanja": "壬",
            "element": "water",
            "yinYang": "yang"
          },
          "branch": {
            "code": "ja",
            "korean": "자",
            "hanja": "子",
            "element": "water",
            "yinYang": "yang"
          }
        }
      },
      {
        "sequence": 3,
        "startAge": 25,
        "ganji": {
          "korean": "계축",
          "hanja": "癸丑",
          "stem": {
            "code": "gye",
            "korean": "계",
            "hanja": "癸",
            "element": "water",
            "yinYang": "yin"
          },
          "branch": {
            "code": "chuk",
            "korean": "축",
            "hanja": "丑",
            "element": "earth",
            "yinYang": "yin"
          }
        }
      },
      {
        "sequence": 4,
        "startAge": 35,
        "ganji": {
          "korean": "갑인",
          "hanja": "甲寅",
          "stem": {
            "code": "gap",
            "korean": "갑",
            "hanja": "甲",
            "element": "wood",
            "yinYang": "yang"
          },
          "branch": {
            "code": "in",
            "korean": "인",
            "hanja": "寅",
            "element": "wood",
            "yinYang": "yang"
          }
        }
      },
      {
        "sequence": 5,
        "startAge": 45,
        "ganji": {
          "korean": "을묘",
          "hanja": "乙卯",
          "stem": {
            "code": "eul",
            "korean": "을",
            "hanja": "乙",
            "element": "wood",
            "yinYang": "yin"
          },
          "branch": {
            "code": "myo",
            "korean": "묘",
            "hanja": "卯",
            "element": "wood",
            "yinYang": "yin"
          }
        }
      },
      {
        "sequence": 6,
        "startAge": 55,
        "ganji": {
          "korean": "병진",
          "hanja": "丙辰",
          "stem": {
            "code": "byeong",
            "korean": "병",
            "hanja": "丙",
            "element": "fire",
            "yinYang": "yang"
          },
          "branch": {
            "code": "jin",
            "korean": "진",
            "hanja": "辰",
            "element": "earth",
            "yinYang": "yang"
          }
        }
      },
      {
        "sequence": 7,
        "startAge": 65,
        "ganji": {
          "korean": "정사",
          "hanja": "丁巳",
          "stem": {
            "code": "jeong",
            "korean": "정",
            "hanja": "丁",
            "element": "fire",
            "yinYang": "yin"
          },
          "branch": {
            "code": "sa",
            "korean": "사",
            "hanja": "巳",
            "element": "fire",
            "yinYang": "yin"
          }
        }
      },
      {
        "sequence": 8,
        "startAge": 75,
        "ganji": {
          "korean": "무오",
          "hanja": "戊午",
          "stem": {
            "code": "mu",
            "korean": "무",
            "hanja": "戊",
            "element": "earth",
            "yinYang": "yang"
          },
          "branch": {
            "code": "o",
            "korean": "오",
            "hanja": "午",
            "element": "fire",
            "yinYang": "yang"
          }
        }
      },
      {
        "sequence": 9,
        "startAge": 85,
        "ganji": {
          "korean": "기미",
          "hanja": "己未",
          "stem": {
            "code": "gi",
            "korean": "기",
            "hanja": "己",
            "element": "earth",
            "yinYang": "yin"
          },
          "branch": {
            "code": "mi",
            "korean": "미",
            "hanja": "未",
            "element": "earth",
            "yinYang": "yin"
          }
        }
      },
      {
        "sequence": 10,
        "startAge": 95,
        "ganji": {
          "korean": "경신",
          "hanja": "庚申",
          "stem": {
            "code": "gyeong",
            "korean": "경",
            "hanja": "庚",
            "element": "metal",
            "yinYang": "yang"
          },
          "branch": {
            "code": "sin",
            "korean": "신",
            "hanja": "申",
            "element": "metal",
            "yinYang": "yang"
          }
        }
      }
    ]
  },
  "warnings": []
};
