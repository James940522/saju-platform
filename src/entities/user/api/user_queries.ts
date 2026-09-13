import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "./users_api";

export const userKeys = {
  all: ["users"] as const,
  current: (userId: string | null | undefined) =>
    [...userKeys.all, "me", userId] as const,
};

export const userQueries = {
  current: (userId: string | null | undefined) =>
    queryOptions({
      queryKey: userKeys.current(userId),
      enabled: Boolean(userId),
      queryFn: ({ signal }) => getCurrentUser(signal),
      staleTime: 60_000,
    }),
};
