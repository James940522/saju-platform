export type UserStatusDto =
  | "pending_registration"
  | "active"
  | "suspended"
  | "withdrawn";

export type UserDto = {
  id: string;
  displayName: string | null;
  status: UserStatusDto;
  createdAt: string;
  updatedAt: string;
  withdrawnAt: string | null;
};

export type CurrentUserDataDto = {
  user: UserDto;
};

export type CompleteRegistrationRequestDto = {
  termsAccepted: true;
  privacyPolicyAccepted: true;
  isAtLeast14: true;
};
