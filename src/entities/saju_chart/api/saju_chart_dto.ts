import type {
  ApiErrorData,
  ApiErrorResponse,
  ApiResponse,
} from "@/shared/api";
import type {
  BirthInput,
  LuckCycleGender,
  SajuChartSnapshot,
} from "../model/saju_chart";
import type { SajuRelationType } from "@/entities/saju_profile";

export type CreateSajuProfileRequestDto = {
  displayName: string;
  relationType: SajuRelationType;
  birth: Omit<BirthInput, "luckCycleGender"> & {
    luckCycleGender: LuckCycleGender;
  };
};

export type UpdateSajuProfileRequestDto = Partial<
  CreateSajuProfileRequestDto
>;

export type SajuProfileSummaryDto = {
  id: string;
  displayName: string;
  relationType: SajuRelationType;
  isPrimary: boolean;
  birth: Omit<BirthInput, "luckCycleGender"> & {
    luckCycleGender: LuckCycleGender;
  };
  currentChartId: string | null;
  createdAt: string;
  updatedAt: string;
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

export type UpdateSajuProfileResponseDto = GetSajuProfileResponseDto;

export type DeleteSajuProfileResponseDto = ApiResponse<{
  deletedProfileId: string;
  primarySajuProfileId: string | null;
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
  | "FUTURE_BIRTH_DATE"
  | "BIRTH_TIME_REQUIRED_ON_BOUNDARY_DATE"
  | "SAJU_PROFILE_NOT_FOUND"
  | "SAJU_CHART_NOT_FOUND"
  | "ACCESS_DENIED"
  | "CALCULATION_FAILED"
  | "USER_REGISTRATION_REQUIRED"
  | "USER_ACCESS_DENIED"
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
