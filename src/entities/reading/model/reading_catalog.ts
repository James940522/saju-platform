export type ReadingCode =
  | "detailed-saju"
  | "love-fortune"
  | "couple-compatibility"
  | "past-life-relationship"
  | "reunion-fortune"
  | "daily-fortune"
  | "monthly-fortune"
  | "three-month-fortune"
  | "wealth-ranking"
  | "yearly-wealth"
  | "job-change"
  | "major-luck"
  | "concern-reading";

export type ReadingTheme =
  | "self"
  | "relationship"
  | "fortune"
  | "wealth"
  | "career"
  | "question";

export type ReadingSubjectRequirement =
  | { type: "single" }
  | { type: "pair" }
  | { type: "group"; min: number; max: number };

export type ReadingDefinition = {
  code: ReadingCode;
  title: string;
  description: string;
  theme: ReadingTheme;
  subjectRequirement: ReadingSubjectRequirement;
  accessLabel: string;
  price?: number;
  highlights: readonly string[];
};

export const readingCatalog: readonly ReadingDefinition[] = [
  {
    code: "detailed-saju",
    title: "상세 사주",
    description: "타고난 성향부터 앞으로의 큰 흐름까지 깊이 살펴봐요.",
    theme: "self",
    subjectRequirement: { type: "single" },
    accessLabel: "가격 검토 중",
    highlights: ["타고난 성향", "직업과 재물", "현재와 미래의 흐름"],
  },
  {
    code: "love-fortune",
    title: "연애운",
    description: "지금 내 연애운이 어떤 방향으로 흐르는지 살펴봐요.",
    theme: "relationship",
    subjectRequirement: { type: "single" },
    accessLabel: "990원대 예정",
    highlights: ["현재 연애 흐름", "좋은 인연의 시기", "관계에서 주의할 점"],
  },
  {
    code: "couple-compatibility",
    title: "두 사람 궁합",
    description: "두 사람의 성향과 관계가 어떻게 맞물리는지 확인해요.",
    theme: "relationship",
    subjectRequirement: { type: "pair" },
    accessLabel: "가격 검토 중",
    highlights: ["성격과 감정 궁합", "대화와 갈등 방식", "오래 이어지는 관계의 조건"],
  },
  {
    code: "past-life-relationship",
    title: "전생 관계",
    description: "두 사람의 사주에 나타난 인연의 특징을 이야기로 풀어봐요.",
    theme: "relationship",
    subjectRequirement: { type: "pair" },
    accessLabel: "990원",
    price: 990,
    highlights: ["두 사람의 인연 유형", "이번 생에서 만난 이유", "조심해야 할 관계 패턴"],
  },
  {
    code: "reunion-fortune",
    title: "재회운",
    description: "멀어진 관계가 다시 이어질 흐름이 있는지 살펴봐요.",
    theme: "relationship",
    subjectRequirement: { type: "pair" },
    accessLabel: "가격 검토 중",
    highlights: ["현재 관계의 흐름", "다시 연락하기 좋은 시기", "반복하지 않아야 할 문제"],
  },
  {
    code: "daily-fortune",
    title: "오늘의 운세",
    description: "오늘 하루의 관계, 일, 금전 흐름을 간단히 확인해요.",
    theme: "fortune",
    subjectRequirement: { type: "single" },
    accessLabel: "무료 예정",
    highlights: ["오늘의 전체 흐름", "챙기면 좋은 선택", "주의하면 좋은 순간"],
  },
  {
    code: "monthly-fortune",
    title: "이번 달 운세",
    description: "이번 달에 다가오는 변화와 선택의 흐름을 살펴봐요.",
    theme: "fortune",
    subjectRequirement: { type: "single" },
    accessLabel: "990원 예정",
    highlights: ["월간 전체 흐름", "좋은 시기", "조심할 시기"],
  },
  {
    code: "three-month-fortune",
    title: "3개월 운세",
    description: "앞으로 세 달의 흐름을 월별로 나누어 확인해요.",
    theme: "fortune",
    subjectRequirement: { type: "single" },
    accessLabel: "990원 예정",
    highlights: ["월별 핵심 흐름", "기회가 오는 시기", "미리 대비할 변화"],
  },
  {
    code: "wealth-ranking",
    title: "재물운 랭킹",
    description: "함께한 사람 중 누가 가장 강한 재물 흐름을 가졌는지 알아봐요.",
    theme: "wealth",
    subjectRequirement: { type: "group", min: 2, max: 5 },
    accessLabel: "무료 예정",
    highlights: ["참여자별 재물 성향", "재물운 순위", "함께 공유하는 결과 카드"],
  },
  {
    code: "yearly-wealth",
    title: "올해 재물운",
    description: "올해 돈의 흐름과 재물을 지키기 좋은 시기를 확인해요.",
    theme: "wealth",
    subjectRequirement: { type: "single" },
    accessLabel: "990원 예정",
    highlights: ["올해 재물 흐름", "돈이 들어오는 시기", "주의해야 할 선택"],
  },
  {
    code: "job-change",
    title: "이직운",
    description: "지금 움직여도 좋을지, 일의 변화가 오는 시기를 살펴봐요.",
    theme: "career",
    subjectRequirement: { type: "single" },
    accessLabel: "990원 예정",
    highlights: ["현재 직업 흐름", "이동하기 좋은 시기", "변화에서 주의할 점"],
  },
  {
    code: "major-luck",
    title: "대운",
    description: "10년 단위로 바뀌는 인생의 큰 흐름을 살펴봐요.",
    theme: "self",
    subjectRequirement: { type: "single" },
    accessLabel: "가격 검토 중",
    highlights: ["대운의 전환점", "시기별 핵심 주제", "앞으로 준비할 방향"],
  },
  {
    code: "concern-reading",
    title: "고민 풀이",
    description: "지금 마음에 걸리는 질문을 사주의 흐름과 함께 살펴봐요.",
    theme: "question",
    subjectRequirement: { type: "single" },
    accessLabel: "가격 검토 중",
    highlights: ["질문에 대한 핵심 답변", "선택할 때 볼 기준", "지금 실천할 조언"],
  },
] as const;

export function getReadingDefinition(readingCode: string) {
  return readingCatalog.find((reading) => reading.code === readingCode);
}

export function getReadingSubjectLabel(
  requirement: ReadingSubjectRequirement,
) {
  switch (requirement.type) {
    case "single":
      return "1인 풀이";
    case "pair":
      return "2인 풀이";
    case "group":
      return `${requirement.min}~${requirement.max}인 풀이`;
  }
}
