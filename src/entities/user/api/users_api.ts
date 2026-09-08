import { requestApi } from "@/shared/api";

import type { User } from "../model/user";
import type {
  CompleteRegistrationRequestDto,
  CurrentUserDataDto,
  UserDto,
} from "./user_dto";

export type CurrentUserData = {
  user: User;
};

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

export async function getCurrentUser(): Promise<CurrentUserData> {
  const response = await requestApi<CurrentUserDataDto>({
    method: "GET",
    url: "/v1/users/me",
  });

  return { user: toUser(response.data.user) };
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
  });

  return { user: toUser(response.data.user) };
}
