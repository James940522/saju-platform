"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";

type AuthGateProps = {
  children: ReactNode;
  loginHref: string;
};

export function AuthGate({ children, loginHref }: AuthGateProps) {
  const router = useRouter();
  const userId = useSyncExternalStore<string | null | undefined>(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );

  useEffect(() => {
    if (userId === null) {
      router.replace(loginHref);
    }
  }, [loginHref, router, userId]);

  if (userId === undefined || userId === null) {
    return (
      <section
        aria-live="polite"
        className="mt-5 rounded-[22px] border border-paper-border bg-paper px-5 py-7 text-center"
      >
        <p className="font-display text-lg font-bold text-foreground">
          로그인 상태를 확인하고 있어요
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          로그인이 필요하면 로그인 화면으로 자동 이동해요.
        </p>
      </section>
    );
  }

  return children;
}
