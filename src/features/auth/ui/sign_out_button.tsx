"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOutAuthenticatedUser } from "@/entities/auth";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import { routes } from "@/shared/config";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasError, setHasError] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setHasError(false);
    try {
      await signOutAuthenticatedUser();
      await queryClient.cancelQueries();
      queryClient.clear();
      clearDemoReadingPurchases();
      router.replace(routes.home);
    } catch {
      setHasError(true);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
        className="min-h-11 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-60"
      >
        {isSigningOut ? "로그아웃 중…" : "로그아웃"}
      </button>
      {hasError ? (
        <p role="alert" className="mt-1 text-xs text-destructive">
          로그아웃하지 못했어요. 다시 시도해주세요.
        </p>
      ) : null}
    </div>
  );
}
