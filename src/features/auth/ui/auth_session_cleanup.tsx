"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  clearWithdrawnSession,
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import { userQueries, userKeys } from "@/entities/user";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";

export function AuthSessionCleanup() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const { error } = useQuery({
    ...userQueries.current(userId),
    enabled: Boolean(userId),
    retry: false,
  });

  useEffect(() => {
    let previous = getAuthenticatedUserId();
    const unsubscribe = subscribeToAuth(() => {
      const next = getAuthenticatedUserId();
      if (previous && next !== previous) {
        // clear() also cancels queries. Clear synchronously before the next
        // account starts fetching so its new requests are not removed later.
        queryClient.clear();
        clearDemoReadingPurchases();
      }
      previous = next;
    });
    function handleFocus() {
      if (getAuthenticatedUserId())
        void queryClient.invalidateQueries({ queryKey: userKeys.all });
    }
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handleFocus);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handleFocus);
    };
  }, [queryClient]);

  useEffect(() => {
    // Keep the withdrawal result/error on its own page; other views lose access.
    if (!userId || pathname === routes.account || !isApiClientError(error))
      return;
    if (
      error.code === 401 ||
      error.data?.reason === "ACCOUNT_WITHDRAWAL_IN_PROGRESS"
    ) {
      void clearWithdrawnSession().catch(() => undefined);
    }
  }, [error, pathname, userId]);
  return null;
}
