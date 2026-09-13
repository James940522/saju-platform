"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { clearWithdrawnSession } from "@/entities/auth";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import {
  withdrawCurrentUser,
  type AccountWithdrawalResult,
} from "@/entities/user";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";

type AccountWithdrawalProps = {
  onAccepted: (result: AccountWithdrawalResult) => void;
};

export function AccountWithdrawal({ onAccepted }: AccountWithdrawalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const [needsLogin, setNeedsLogin] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: withdrawCurrentUser,
    retry: false,
    async onSuccess(result) {
      // Render the result before clearing auth so AuthGate cannot redirect it.
      onAccepted(result);
      await queryClient.cancelQueries();
      queryClient.clear();
      clearDemoReadingPurchases();
      await clearWithdrawnSession().catch(() => undefined);
    },
    onError(error) {
      const isUnknown =
        !isApiClientError(error) ||
        error.code === null ||
        (error.code >= 500 &&
          error.data?.reason !== "ACCOUNT_WITHDRAWAL_UNAVAILABLE");
      setNeedsLogin(isApiClientError(error) && error.code === 401);
      setRequestError(
        isUnknown
          ? "처리 결과를 확인하지 못했어요. 탈퇴 요청이 접수됐을 수 있어요. 다시 시도해 상태를 확인해주세요."
          : isApiClientError(error) && error.code === 401
            ? "로그인 상태를 확인할 수 없어요. 탈퇴 완료 여부는 확인되지 않았어요. 다시 로그인해주세요."
            : isApiClientError(error)
              ? error.message
              : "탈퇴 요청을 접수하지 못했어요.",
      );
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasConfirmed && !mutation.isPending && !needsLogin) mutation.mutate();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="min-h-11 text-sm text-muted-foreground underline underline-offset-4"
        onClick={() => {
          setHasConfirmed(false);
          setRequestError(undefined);
          setNeedsLogin(false);
          setIsOpen(true);
        }}
      >
        회원 탈퇴
      </button>
      {isOpen ? (
        <dialog
          ref={dialogRef}
          aria-labelledby="withdrawal-title"
          aria-describedby="withdrawal-description"
          className="fixed inset-0 m-auto max-h-[calc(100dvh-48px)] w-[calc(100%-40px)] max-w-[390px] overflow-y-auto rounded-[24px] border-0 bg-surface p-5 text-foreground shadow-2xl backdrop:bg-black/45"
          onCancel={(event) => {
            event.preventDefault();
            if (!mutation.isPending) setIsOpen(false);
          }}
        >
          <div className="grid size-12 place-items-center rounded-full bg-destructive-soft text-destructive">
            <TriangleAlert size={23} aria-hidden="true" />
          </div>
          <h2
            id="withdrawal-title"
            className="mt-4 font-display text-xl font-bold"
          >
            정말 탈퇴하시겠어요?
          </h2>
          <div
            id="withdrawal-description"
            className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground"
          >
            <p>
              탈퇴하면 회원정보와 등록한{" "}
              <strong className="text-foreground">
                모든 사주 프로필, 출생정보, 만세력 계산 이력
              </strong>
              이 영구 삭제돼요.
            </p>
            <p>
              삭제된 데이터는 복구할 수 없으며, 다시 가입해도 이전 기록은
              돌아오지 않아요.
            </p>
            <p className="text-xs leading-5">
              카카오의 선녀 사주 연결도 해제돼요. 카카오 계정 자체는 삭제되지
              않아요.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5">
            <label className="flex items-start gap-2.5 rounded-xl bg-paper p-3 text-xs font-semibold leading-5">
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-destructive"
                checked={hasConfirmed}
                disabled={mutation.isPending}
                onChange={(event) => setHasConfirmed(event.target.checked)}
              />
              모든 데이터가 삭제되고 복구할 수 없음을 확인했어요.
            </label>
            {requestError ? (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-destructive-soft p-3 text-xs leading-5 text-destructive"
              >
                {requestError}
              </p>
            ) : null}
            {needsLogin ? (
              <Link
                href={routes.login({ next: routes.account })}
                className="mt-3 block text-sm text-primary underline"
              >
                다시 로그인하기
              </Link>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                ref={cancelRef}
                type="button"
                disabled={mutation.isPending}
                onClick={() => setIsOpen(false)}
                className="h-12 rounded-xl bg-paper text-sm font-bold disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!hasConfirmed || mutation.isPending || needsLogin}
                className="h-12 rounded-xl bg-destructive text-xs font-bold text-destructive-foreground disabled:opacity-40"
              >
                {mutation.isPending ? "탈퇴 처리 중…" : "탈퇴하고 데이터 삭제"}
              </button>
            </div>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
