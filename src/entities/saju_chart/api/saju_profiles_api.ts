import { requestApi } from "@/shared/api";

import type {
  CreateSajuProfileRequestDto,
  CreateSajuProfileResponseDto,
  DeleteSajuProfileResponseDto,
  GetSajuProfileResponseDto,
  GetSajuProfilesResponseDto,
  UpdateSajuProfileRequestDto,
  UpdateSajuProfileResponseDto,
} from "./saju_chart_dto";

export async function createSajuProfile(
  request: CreateSajuProfileRequestDto,
) {
  const response = await requestApi<
    CreateSajuProfileResponseDto["data"],
    CreateSajuProfileRequestDto
  >({
    method: "POST",
    url: "/v1/saju-profiles",
    data: request,
  });

  return response.data;
}

export async function getSajuProfiles(signal?: AbortSignal) {
  const response = await requestApi<GetSajuProfilesResponseDto["data"]>({
    method: "GET",
    url: "/v1/saju-profiles",
    signal,
  });

  return response.data;
}

export async function getSajuProfile(
  profileId: string,
  signal?: AbortSignal,
) {
  const response = await requestApi<GetSajuProfileResponseDto["data"]>({
    method: "GET",
    url: `/v1/saju-profiles/${encodeURIComponent(profileId)}`,
    signal,
  });

  return response.data;
}

export async function updateSajuProfile(
  profileId: string,
  request: UpdateSajuProfileRequestDto,
) {
  const response = await requestApi<
    UpdateSajuProfileResponseDto["data"],
    UpdateSajuProfileRequestDto
  >({
    method: "PATCH",
    url: `/v1/saju-profiles/${encodeURIComponent(profileId)}`,
    data: request,
  });

  return response.data;
}

export async function deleteSajuProfile(profileId: string) {
  const response = await requestApi<DeleteSajuProfileResponseDto["data"]>({
    method: "DELETE",
    url: `/v1/saju-profiles/${encodeURIComponent(profileId)}`,
  });

  return response.data;
}
