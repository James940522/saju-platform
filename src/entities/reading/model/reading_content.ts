export type ReadingCode = string;

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

export type ReadingAvailability = "active" | "coming_soon" | "hidden";

export type ReadingCurrency = "KRW";

export type ReadingPricing =
  | { type: "free" }
  | { type: "paid"; amount: number; currency: ReadingCurrency }
  | {
      type: "pending";
      expectedAmount?: number;
      currency?: ReadingCurrency;
    };

export type ReadingResultType =
  | "standard"
  | "daily_fortune"
  | "past_life_relationship"
  | "ranking";

export type ReadingContent = {
  id: string;
  code: ReadingCode;
  title: string;
  description: string;
  theme: ReadingTheme;
  subjectRequirement: ReadingSubjectRequirement;
  availability: ReadingAvailability;
  pricing: ReadingPricing;
  resultType: ReadingResultType;
  highlights: readonly string[];
};

export type ReadingProductSummary = Pick<
  ReadingContent,
  | "id"
  | "code"
  | "title"
  | "description"
  | "theme"
  | "availability"
  | "pricing"
>;

export type ReadingEntitlement =
  | { status: "accessible" }
  | { status: "purchase_required" }
  | { status: "unavailable"; reason?: string };
