import type {
  BirthInput,
  SajuChartSnapshot,
} from "../model/saju_chart";

export type SajuProfileKind = "self" | "other";

export type SajuRelationType =
  | "self"
  | "family"
  | "friend"
  | "partner"
  | "coworker"
  | "other";

export type CreateSajuProfileRequestDto = {
  displayName: string;
  kind: SajuProfileKind;
  relationType: SajuRelationType;
  birth: BirthInput;
};

export type UpdateSajuProfileRequestDto = {
  displayName?: string;
  relationType?: SajuRelationType;
  birth?: BirthInput;
};

export type SajuProfileSummaryDto = {
  id: string;
  displayName: string;
  kind: SajuProfileKind;
  relationType: SajuRelationType;
  currentChartId: string | null;
};

export type SajuChartDto = {
  id: string;
  profileId: string;
  snapshot: SajuChartSnapshot;
};

export type ApiResponseDto<TData> = {
  data: TData;
  meta: {
    requestId: string;
  };
};

export type CreateSajuProfileResponseDto = ApiResponseDto<{
  profile: SajuProfileSummaryDto;
  chart: SajuChartDto;
}>;

export type GetSajuProfilesResponseDto = ApiResponseDto<{
  profiles: readonly SajuProfileSummaryDto[];
}>;

export type GetSajuProfileResponseDto = ApiResponseDto<{
  profile: SajuProfileSummaryDto;
  chart: SajuChartDto | null;
}>;

export type GetSajuChartResponseDto = ApiResponseDto<{
  chart: SajuChartDto;
}>;

export type SajuApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_SOLAR_DATE"
  | "INVALID_LUNAR_DATE"
  | "INVALID_LEAP_MONTH"
  | "UNSUPPORTED_BIRTH_YEAR"
  | "BIRTH_TIME_REQUIRED_ON_BOUNDARY_DATE"
  | "SAJU_PROFILE_NOT_FOUND"
  | "SAJU_CHART_NOT_FOUND"
  | "ACCESS_DENIED"
  | "CALCULATION_FAILED"
  | "RATE_LIMITED";

export type SajuApiErrorResponseDto = {
  error: {
    code: SajuApiErrorCode;
    message: string;
    requestId: string;
    fieldErrors?: Record<string, readonly string[]>;
  };
};

export type CreateSajuReadingRequestDto =
  | {
      type: "basic";
      chartId: string;
    }
  | {
      type: "yearly";
      chartId: string;
      targetYear: number;
    }
  | {
      type: "past_life_relationship";
      subjectChartId: string;
      targetChartId: string;
    };
