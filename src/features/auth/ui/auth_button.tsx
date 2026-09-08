"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  signOutAuthenticatedUser,
  subscribeToAuth,
} from "@/entities/auth";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import { clearDemoSajuProfiles } from "@/entities/saju_profile";
import { userKeys, userQueries } from "@/entities/user";
import { routes } from "@/shared/config";

export function AuthButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const queryClient = useQueryClient();
  const userId = useSyncExternalStore<string | null | undefined>(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const { data: currentUserData } = useQuery({
    ...userQueries.current(),
    enabled: Boolean(userId),
  });

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOutAuthenticatedUser();
      queryClient.removeQueries({ queryKey: userKeys.all });
      clearDemoSajuProfiles();
      clearDemoReadingPurchases();
    } catch {
      // Keep the current session and local data when sign-out fails.
    } finally {
      setIsSigningOut(false);
    }
  }

  if (userId === undefined) {
    return (
      <span
        aria-hidden="true"
        className="h-10 w-[74px] rounded-full border border-paper-border bg-surface"
      />
    );
  }

  if (userId) {
    const displayName = currentUserData?.user.displayName;

    return (
      <button
        aria-label="현재 계정 로그아웃"
        className="flex h-10 items-center gap-1.5 rounded-full border border-paper-border bg-surface px-3 text-xs font-semibold text-foreground disabled:opacity-60"
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
        type="button"
      >
        <LogOut size={16} strokeWidth={1.8} />
        <span className="max-w-24 truncate">
          {isSigningOut ? "확인 중" : displayName ? `${displayName}님` : "로그아웃"}
        </span>
      </button>
    );
  }

  return (
    <Link
      className="flex h-10 items-center gap-1.5 rounded-full border border-paper-border bg-surface px-3 text-xs font-semibold text-foreground"
      href={routes.login()}
    >
      <LogIn size={16} strokeWidth={1.8} />
      로그인
    </Link>
  );
}
