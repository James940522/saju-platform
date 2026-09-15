"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getReadingJobs, readingJobKeys } from "../api/reading_jobs_api";
import { isReadingPending } from "./reading_job";

export function useReadingJobs(userId: string) {
  return useInfiniteQuery({
    queryKey: readingJobKeys.list(userId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => getReadingJobs(pageParam, signal),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchInterval: (query) =>
      query.state.data?.pages.some((page) => page.jobs.some(isReadingPending))
        ? 3000
        : false,
  });
}
