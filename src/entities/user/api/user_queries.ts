import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "./users_api";

export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "me"] as const,
};

export const userQueries = {
  current: () =>
    queryOptions({
      queryKey: userKeys.current(),
      queryFn: getCurrentUser,
      staleTime: 60_000,
    }),
};
