"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import { userQueries } from "@/entities/user";
import { routes } from "@/shared/config";

export function AuthButton() {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const { data } = useQuery({
    ...userQueries.current(userId),
    enabled: Boolean(userId),
  });

  if (userId === undefined) {
    return <span aria-hidden="true" className="ml-3 min-h-11 w-16 shrink-0" />;
  }

  const name = userId ? data?.user.displayName?.trim() || "회원" : "방문자";

  return (
    <Link
      href={userId ? routes.account : routes.login()}
      aria-label={`어서오세요 ${name}님, ${userId ? "계정 관리" : "로그인"}`}
      className="ml-3 inline-flex min-h-11 shrink-0 flex-col items-end justify-center font-display text-sm font-bold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <span className="text-[11px] font-normal text-muted-foreground">어서오세요</span>
      <span className="max-w-24 truncate">{name}님</span>
    </Link>
  );
}
