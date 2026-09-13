"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  signOutAuthenticatedUser,
  subscribeToAuth,
} from "@/entities/auth";
import {
  completeCurrentUserRegistration,
  userKeys,
  userQueries,
} from "@/entities/user";
import { sajuProfileKeys } from "@/entities/saju_chart";
import { routes } from "@/shared/config";

type AgeConfirmation = "at_least_14" | "under_14" | undefined;

export function RegistrationConsentDialog() {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );

  // Keep choices across policy navigation, but never across login sessions.
  return userId ? (
    <RegistrationConsentSession key={userId} userId={userId} />
  ) : null;
}

function RegistrationConsentSession({ userId }: { userId: string }) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyPolicy, setHasAcceptedPrivacyPolicy] =
    useState(false);
  const [ageConfirmation, setAgeConfirmation] = useState<AgeConfirmation>();
  const [isUnderAgeDialogOpen, setIsUnderAgeDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignOutError, setHasSignOutError] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const underAgeDialogRef = useRef<HTMLDialogElement>(null);
  const {
    data: currentUserData,
    isPending,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    ...userQueries.current(userId),
    retry: false,
  });
  const registrationMutation = useMutation({
    mutationFn: completeCurrentUserRegistration,
    async onSuccess(data) {
      if (getAuthenticatedUserId() !== userId) return;
      queryClient.setQueryData(userKeys.current(userId), data);
      await queryClient.invalidateQueries({ queryKey: sajuProfileKeys.all });
    },
  });
  const isOpen =
    pathname !== routes.terms &&
    pathname !== routes.privacy &&
    pathname !== routes.account &&
    (isPending || isError || currentUserData?.user.status !== "active");
  const needsRegistration =
    !isPending &&
    !isError &&
    (currentUserData === null ||
      currentUserData?.user.status === "pending_registration");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isUnderAgeDialogOpen) return;
    const dialog = underAgeDialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [isOpen, isUnderAgeDialogOpen]);

  if (!isOpen) {
    return null;
  }

  const canCompleteRegistration =
    hasAcceptedTerms &&
    hasAcceptedPrivacyPolicy &&
    ageConfirmation === "at_least_14" &&
    needsRegistration &&
    !isSigningOut &&
    !registrationMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCompleteRegistration || getAuthenticatedUserId() !== userId) {
      return;
    }

    registrationMutation.mutate();
  }

  function handleOpenPolicy(href: string) {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    router.push(`${href}?${new URLSearchParams({ returnTo })}`);
  }

  function handleSelectUnderAge() {
    setAgeConfirmation("under_14");
    setHasSignOutError(false);
    setIsUnderAgeDialogOpen(true);
  }

  async function handleUnderAgeSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setHasSignOutError(false);

    try {
      await signOutAuthenticatedUser();
      queryClient.removeQueries({ queryKey: userKeys.current(userId) });
      router.replace(routes.login());
      router.refresh();
    } catch {
      setHasSignOutError(true);
      setIsSigningOut(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => event.preventDefault()}
      aria-describedby="registration-consent-description"
      aria-labelledby="registration-consent-title"
      className="fixed m-auto max-h-[calc(100dvh-4rem)] w-[calc(100%-2rem)] max-w-[448px] overflow-y-auto rounded-2xl border-0 bg-surface p-6 text-foreground shadow-2xl backdrop:bg-black/40"
    >
      {needsRegistration ? (
        <section
          aria-describedby="registration-consent-description"
          aria-labelledby="registration-consent-title"
        >
          <h2
            className="font-display text-xl font-bold text-foreground"
            id="registration-consent-title"
          >
            서비스 이용 전 한 번만 확인해주세요
          </h2>
          <p
            className="mt-5 text-sm leading-7 text-muted-foreground"
            id="registration-consent-description"
          >
            서비스 이용을 위해 이용약관과 개인정보처리방침을 확인하고, 실제
            이용자가 만 14세 이상인지 확인해요. 사주·궁합에 입력하는 상대방의
            나이를 확인하는 절차는 아니에요.
          </p>

          <form className="mt-5" onSubmit={handleSubmit}>
            <fieldset disabled={registrationMutation.isPending || isSigningOut}>
              <div className="text-sm leading-6 text-foreground">
                <label className="flex items-start gap-2.5">
                  <input
                    checked={hasAcceptedTerms}
                    className="mt-1 size-4 accent-primary"
                    onChange={(event) =>
                      setHasAcceptedTerms(event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span>
                    <strong>[필수]</strong> 이용약관에 동의합니다.
                  </span>
                </label>
                <Link
                  className="ml-6 inline-flex min-h-11 items-center text-primary underline underline-offset-2"
                  href={routes.terms}
                  onNavigate={(event) => {
                    event.preventDefault();
                    handleOpenPolicy(routes.terms);
                  }}
                >
                  이용약관 전문 보기
                </Link>
              </div>

              <div className="mt-3 text-sm leading-6 text-foreground">
                <label className="flex items-start gap-2.5">
                  <input
                    checked={hasAcceptedPrivacyPolicy}
                    className="mt-1 size-4 accent-primary"
                    onChange={(event) =>
                      setHasAcceptedPrivacyPolicy(event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span>
                    <strong>[필수]</strong> 개인정보처리방침을 확인하고 개인정보
                    처리에 동의합니다.
                  </span>
                </label>
                <Link
                  className="ml-6 inline-flex min-h-11 items-center text-primary underline underline-offset-2"
                  href={routes.privacy}
                  onNavigate={(event) => {
                    event.preventDefault();
                    handleOpenPolicy(routes.privacy);
                  }}
                >
                  개인정보처리방침 전문 보기
                </Link>
              </div>

              <fieldset className="mt-5 rounded-xl bg-[#F2E9D3] px-4 py-4">
                <legend className="text-sm font-bold text-foreground">
                  [필수] 실제 이용자의 연령을 확인해주세요.
                </legend>
                <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
                  <input
                    checked={ageConfirmation === "at_least_14"}
                    className="size-4 accent-primary"
                    name="age-confirmation"
                    onChange={() => setAgeConfirmation("at_least_14")}
                    type="radio"
                  />
                  만 14세 이상입니다.
                </label>
                <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
                  <input
                    checked={ageConfirmation === "under_14"}
                    className="size-4 accent-primary"
                    name="age-confirmation"
                    onChange={handleSelectUnderAge}
                    onClick={() => {
                      if (ageConfirmation === "under_14") {
                        handleSelectUnderAge();
                      }
                    }}
                    type="radio"
                  />
                  만 14세 미만입니다.
                </label>
              </fieldset>

              {ageConfirmation === "under_14" ? (
                <p
                  className="mt-3 text-xs font-semibold text-destructive"
                  role="alert"
                >
                  만 14세 미만인 경우 현재 서비스를 이용할 수 없습니다.
                </p>
              ) : null}

              {registrationMutation.isError ? (
                <p
                  className="mt-3 text-xs font-semibold text-destructive"
                  role="alert"
                >
                  가입 확인을 저장하지 못했어요. 잠시 후 다시 시도해주세요.
                </p>
              ) : null}

              <button
                className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:bg-[#A5A9B2] disabled:text-white"
                disabled={!canCompleteRegistration}
                type="submit"
              >
                {registrationMutation.isPending
                  ? "저장 중..."
                  : "확인하고 계속하기"}
              </button>
            </fieldset>
          </form>
        </section>
      ) : (
        <section aria-live="polite">
          <h2
            id="registration-consent-title"
            className="font-display text-xl font-bold"
          >
            {isPending
              ? "가입 상태를 확인하고 있어요"
              : isError
                ? "회원정보를 불러오지 못했어요"
                : "서비스 이용이 제한된 계정이에요"}
          </h2>
          <p
            id="registration-consent-description"
            className="mt-4 text-sm leading-7 text-muted-foreground"
          >
            {isPending
              ? "잠시만 기다려주세요."
              : isError
                ? "연결을 확인한 뒤 다시 시도해주세요."
                : "계정 관리 화면에서 상태를 확인하거나 로그아웃할 수 있어요."}
          </p>
          {isError ? (
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetch()}
              className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {isFetching ? "다시 확인 중..." : "다시 시도"}
            </button>
          ) : null}
          {!isPending ? (
            <Link
              href={routes.account}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline"
            >
              계정 관리로 이동
            </Link>
          ) : null}
        </section>
      )}

      {isUnderAgeDialogOpen ? (
        <dialog
          ref={underAgeDialogRef}
          aria-describedby="under-age-description"
          aria-labelledby="under-age-title"
          onCancel={(event) => {
            event.preventDefault();
            if (!isSigningOut) setIsUnderAgeDialogOpen(false);
          }}
          className="fixed m-auto max-h-[calc(100dvh-4rem)] w-[calc(100%-2.5rem)] max-w-[384px] overflow-y-auto rounded-2xl border-0 bg-surface p-5 text-foreground shadow-2xl backdrop:bg-black/35"
        >
          <section
            aria-describedby="under-age-description"
            aria-labelledby="under-age-title"
          >
            <h3
              className="font-display text-xl font-bold text-foreground"
              id="under-age-title"
            >
              이용 제한을 확인해주세요
            </h3>
            <p
              className="mt-5 text-sm leading-7 text-muted-foreground"
              id="under-age-description"
            >
              ‘확인하고 중지’를 누르면 로그아웃되고 서비스를 이용할 수 없어요.
              만 14세 이상인데 실수로 선택한 경우에는 취소하고
              <strong> 만 14세 이상</strong>을 선택해주세요.
            </p>

            {hasSignOutError ? (
              <p
                className="mt-3 text-xs font-semibold text-destructive"
                role="alert"
              >
                로그아웃하지 못했어요. 잠시 후 다시 시도해주세요.
              </p>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="h-12 rounded-xl bg-[#F2E9D3] text-sm font-bold text-foreground disabled:opacity-60"
                disabled={isSigningOut}
                onClick={() => setIsUnderAgeDialogOpen(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="h-12 rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
                disabled={isSigningOut}
                onClick={() => void handleUnderAgeSignOut()}
                type="button"
              >
                {isSigningOut ? "로그아웃 중..." : "확인하고 중지"}
              </button>
            </div>
          </section>
        </dialog>
      ) : null}
    </dialog>
  );
}
