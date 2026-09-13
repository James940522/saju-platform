"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import { userQueries, type AccountWithdrawalResult } from "@/entities/user";
import { AccountWithdrawal } from "@/features/account_withdrawal";
import { AuthGate, SignOutButton } from "@/features/auth";
import { routes } from "@/shared/config";

export function AccountPage() {
  const [result, setResult] = useState<AccountWithdrawalResult>();
  const router = useRouter();
  return (
    <main className="min-h-dvh px-5 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          href={result ? routes.home : routes.mySaju}
          aria-label={result ? "홈으로 돌아가기" : "내 만세력으로 돌아가기"}
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface"
        >
          <ArrowLeft size={21} />
        </Link>
        <h1 className="font-display text-2xl font-bold">계정 관리</h1>
      </header>
      {result ? (
        <section className="mt-12 text-center" aria-live="polite">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
            <Check size={27} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">
            {result.status === "completed"
              ? "회원 탈퇴가 완료됐어요"
              : "탈퇴 요청이 접수됐어요"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {result.status === "completed"
              ? "계정과 등록한 사주 데이터가 삭제됐어요."
              : "등록한 사주 데이터는 삭제됐고, 계정 연결을 정리하고 있어요. 창을 닫아도 계속 처리돼요."}
          </p>
          <button
            type="button"
            onClick={() => router.replace(routes.home)}
            className="mt-8 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            홈으로 이동
          </button>
        </section>
      ) : (
        <AuthGate loginHref={routes.login({ next: routes.account })}>
          <AccountInformation />
          <div className="mt-3">
            <SignOutButton />
          </div>
          <section className="mt-12 border-t border-paper-border pt-5">
            <p className="mb-2 text-xs leading-5 text-muted-foreground">
              탈퇴하면 등록한 모든 사주 데이터가 삭제돼요.
            </p>
            <AccountWithdrawal onAccepted={setResult} />
          </section>
        </AuthGate>
      )}
    </main>
  );
}

function AccountInformation() {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const { data, isPending, isError } = useQuery(userQueries.current(userId));
  return (
    <section className="mt-8 flex items-center gap-4 rounded-[22px] bg-paper p-5">
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <UserRound size={24} />
      </div>
      <div>
        <h2 className="text-lg font-semibold">
          {isPending
            ? "확인 중…"
            : (data?.user.displayName ?? "선녀 사주 회원")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {isError
            ? "회원정보를 불러오지 못했어요. 탈퇴 요청은 아래에서 할 수 있어요."
            : "카카오로 로그인 중"}
        </p>
      </div>
    </section>
  );
}
