type ReadingProductThemeDto =
  | "self"
  | "relationship"
  | "fortune"
  | "wealth"
  | "career"
  | "question";

type ReadingProductSubjectRequirementDto =
  | { type: "single" }
  | { type: "pair" }
  | { type: "group"; min: number; max: number };

type ReadingProductPricingDto =
  | { type: "free" }
  | { type: "paid"; amount: number; currency: "KRW" }
  | { type: "pending"; expectedAmount?: number; currency?: "KRW" };

type ReadingProductAvailabilityDto = "active" | "coming_soon" | "hidden";

type ReadingProductResultTypeDto =
  | "standard"
  | "daily_fortune"
  | "past_life_relationship"
  | "ranking";

export type ReadingProductSummaryDto = {
  id: string;
  code: string;
  title: string;
  description: string;
  theme: ReadingProductThemeDto;
  availability: ReadingProductAvailabilityDto;
  pricing: ReadingProductPricingDto;
};

export type ReadingProductDto = ReadingProductSummaryDto & {
  subjectRequirement: ReadingProductSubjectRequirementDto;
  resultType: ReadingProductResultTypeDto;
  highlights: string[];
};

export type GetReadingProductsDataDto = {
  products: ReadingProductSummaryDto[];
};

export type GetReadingProductDataDto = {
  product: ReadingProductDto;
};
