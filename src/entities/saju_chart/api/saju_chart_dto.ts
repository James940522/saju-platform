import type {
  ApiErrorData,
  ApiErrorResponse,
  ApiResponse,
} from "@/shared/api";
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

export type CreateSajuProfileResponseDto = ApiResponse<{
  profile: SajuProfileSummaryDto;
  chart: SajuChartDto;
}>;

export type GetSajuProfilesResponseDto = ApiResponse<{
  profiles: readonly SajuProfileSummaryDto[];
}>;

export type GetSajuProfileResponseDto = ApiResponse<{
  profile: SajuProfileSummaryDto;
  chart: SajuChartDto | null;
}>;

export type GetSajuChartResponseDto = ApiResponse<{
  chart: SajuChartDto;
}>;

export type SajuApiErrorReason =
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

export type SajuApiErrorData = Omit<ApiErrorData, "reason"> & {
  reason: SajuApiErrorReason;
};

export type SajuApiErrorResponseDto = Omit<ApiErrorResponse, "data"> & {
  data: SajuApiErrorData | null;
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
