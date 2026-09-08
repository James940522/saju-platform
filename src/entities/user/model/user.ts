export type UserStatus =
  | "pending_registration"
  | "active"
  | "suspended"
  | "withdrawn";

export type User = {
  id: string;
  displayName: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  withdrawnAt: string | null;
};
