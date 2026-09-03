"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";

import {
  getDemoUserIdentifier,
  getDemoUserServerSnapshot,
  subscribeToDemoUser,
} from "@/entities/demo_user";

type DemoAuthGateProps = {
  children: ReactNode;
  loginHref: string;
};

export function DemoAuthGate({ children, loginHref }: DemoAuthGateProps) {
  const router = useRouter();
  const userIdentifier = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoUser,
    getDemoUserIdentifier,
    getDemoUserServerSnapshot,
  );

  useEffect(() => {
    if (userIdentifier === null) {
      router.replace(loginHref);
    }
  }, [loginHref, router, userIdentifier]);

  if (userIdentifier === undefined || userIdentifier === null) {
    return (
      <section
        aria-live="polite"
        className="mt-5 rounded-[22px] border border-paper-border bg-paper px-5 py-7 text-center"
      >
        <p className="font-display text-lg font-bold text-foreground">
          로그인 상태를 확인하고 있어요
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">
          로그인이 필요하면 데모 로그인 화면으로 자동 이동해요.
        </p>
      </section>
    );
  }

  return children;
}
