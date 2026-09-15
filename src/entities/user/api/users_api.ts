import { isApiClientError, requestApi } from "@/shared/api";
import { DEMO_USER_ID } from "@/shared/api";

import type { User } from "../model/user";
import type {
  CompleteRegistrationRequestDto,
  CurrentUserDataDto,
  UserDto,
} from "./user_dto";

export type CurrentUserData = {
  user: User;
};

function getDemoUser(): CurrentUserDataDto {
  return { user: {
    id: DEMO_USER_ID,
    displayName: "김하늘",
    status: "active",
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
    withdrawnAt: null,
  } };
}

function toUser(user: UserDto): User {
  return {
    id: user.id,
    displayName: user.displayName,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    withdrawnAt: user.withdrawnAt,
  };
}

export async function getCurrentUser(signal?: AbortSignal): Promise<CurrentUserData | null> {
  try {
    const response = await requestApi<CurrentUserDataDto>({
      method: "GET",
      url: "/v1/users/me",
      signal,
    }, getDemoUser);

    return { user: toUser(response.data.user) };
  } catch (error) {
    if (
      isApiClientError(error) &&
      error.code === 404 &&
      error.data?.reason === "USER_NOT_FOUND"
    ) {
      return null;
    }

    throw error;
  }
}

export type AccountWithdrawalResult = { status: "completed" | "processing" };

export async function withdrawCurrentUser(): Promise<AccountWithdrawalResult> {
  const response = await requestApi<AccountWithdrawalResult, { confirmDataDeletion: true }>({
    method: "DELETE",
    url: "/v1/users/me",
    data: { confirmDataDeletion: true },
    timeout: 25_000,
  });
  if (!((response.code === 200 && response.data.status === "completed") ||
    (response.code === 202 && response.data.status === "processing"))) {
    throw new Error("Invalid withdrawal response");
  }
  return response.data;
}

export async function completeCurrentUserRegistration(): Promise<CurrentUserData> {
  const request: CompleteRegistrationRequestDto = {
    termsAccepted: true,
    privacyPolicyAccepted: true,
    isAtLeast14: true,
  };
  const response = await requestApi<
    CurrentUserDataDto,
    CompleteRegistrationRequestDto
  >({
    method: "PUT",
    url: "/v1/users/me/registration",
    data: request,
  }, getDemoUser);

  return { user: toUser(response.data.user) };
}
