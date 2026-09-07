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

export type ReadingProductDto = {
  id: string;
  code: string;
  title: string;
  description: string;
  theme: ReadingProductThemeDto;
  subjectRequirement: ReadingProductSubjectRequirementDto;
  availability: ReadingProductAvailabilityDto;
  pricing: ReadingProductPricingDto;
  resultType: ReadingProductResultTypeDto;
  highlights: string[];
};

export type GetReadingProductsDataDto = {
  products: ReadingProductDto[];
};

export type GetReadingProductDataDto = {
  product: ReadingProductDto;
};
