"use client";

import { useEffect, useState } from "react";

export function useMinimumLoadingTime(
  isLoading: boolean,
  durationMs: number,
) {
  const [shouldHoldLoading, setShouldHoldLoading] = useState(
    isLoading && durationMs > 0,
  );

  useEffect(() => {
    if (!shouldHoldLoading) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldHoldLoading(false);
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, shouldHoldLoading]);

  return isLoading || shouldHoldLoading;
}
