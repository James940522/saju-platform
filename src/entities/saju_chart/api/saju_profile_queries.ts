import { queryOptions } from "@tanstack/react-query";

import { getSajuProfile, getSajuProfiles } from "./saju_profiles_api";

export const sajuProfileKeys = {
  all: ["saju-profiles"] as const,
  list: () => [...sajuProfileKeys.all, "list"] as const,
  detail: (profileId: string) =>
    [...sajuProfileKeys.all, "detail", profileId] as const,
};

export const sajuProfileQueries = {
  list: () =>
    queryOptions({
      queryKey: sajuProfileKeys.list(),
      queryFn: ({ signal }) => getSajuProfiles(signal),
      staleTime: 60_000,
    }),
  detail: (profileId: string) =>
    queryOptions({
      queryKey: sajuProfileKeys.detail(profileId),
      queryFn: ({ signal }) => getSajuProfile(profileId, signal),
      staleTime: 60_000,
    }),
};
