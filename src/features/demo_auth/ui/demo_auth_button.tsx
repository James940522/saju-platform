"use client";

import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getDemoUserIdentifier,
  getDemoUserServerSnapshot,
  signOutDemoUser,
  subscribeToDemoUser,
} from "@/entities/demo_user";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import { clearDemoSajuProfiles } from "@/entities/saju_profile";
import { routes } from "@/shared/config";

export function DemoAuthButton() {
  const userIdentifier = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoUser,
    getDemoUserIdentifier,
    getDemoUserServerSnapshot,
  );

  function handleSignOut() {
    const areProfilesCleared = clearDemoSajuProfiles();
    const arePurchasesCleared = clearDemoReadingPurchases();

    if (areProfilesCleared && arePurchasesCleared) {
      signOutDemoUser();
    }
  }

  if (userIdentifier === undefined) {
    return (
      <span
        aria-hidden="true"
        className="h-10 w-[74px] rounded-full border border-paper-border bg-surface"
      />
    );
  }

  if (userIdentifier) {
    return (
      <button
        className="flex h-10 items-center gap-1.5 rounded-full border border-paper-border bg-surface px-3 text-xs font-semibold text-foreground"
        onClick={handleSignOut}
        type="button"
        aria-label={`${userIdentifier} 데모 계정 로그아웃`}
      >
        <LogOut size={16} strokeWidth={1.8} />
        로그아웃
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
