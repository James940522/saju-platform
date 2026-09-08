"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type FormEvent,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  completeCurrentUserRegistration,
  userKeys,
  userQueries,
} from "@/entities/user";

type AgeConfirmation = "at_least_14" | "under_14" | undefined;

export function RegistrationConsentDialog() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacyPolicy, setHasAcceptedPrivacyPolicy] =
    useState(false);
  const [ageConfirmation, setAgeConfirmation] =
    useState<AgeConfirmation>();
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
  const registrationMutation = useMutation({
    mutationFn: completeCurrentUserRegistration,
    onSuccess(data) {
      queryClient.setQueryData(userKeys.current(), data);
    },
  });
  const isOpen = currentUserData?.user.status === "pending_registration";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const canCompleteRegistration =
    hasAcceptedTerms &&
    hasAcceptedPrivacyPolicy &&
    ageConfirmation === "at_least_14" &&
    !registrationMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCompleteRegistration) {
      return;
    }

    registrationMutation.mutate();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-8">
      <section
        aria-describedby="registration-consent-description"
        aria-labelledby="registration-consent-title"
        aria-modal="true"
        className="w-full max-w-[448px] rounded-2xl bg-surface px-6 py-6 shadow-2xl"
        role="dialog"
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
          이용자가 만 14세 이상인지 확인해요. 사주·궁합·귀인지도에 입력하는
          상대방의 나이를 확인하는 절차는 아니에요.
        </p>

        <form className="mt-5" onSubmit={handleSubmit}>
          <label className="flex items-start gap-2.5 text-sm leading-6 text-foreground">
            <input
              checked={hasAcceptedTerms}
              className="mt-1 size-4 accent-primary"
              onChange={(event) => setHasAcceptedTerms(event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>[필수]</strong> 이용약관에 동의합니다.
              <span className="ml-1 underline underline-offset-2">전문 보기</span>
            </span>
          </label>

          <label className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-foreground">
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
              <span className="ml-1 underline underline-offset-2">전문 보기</span>
            </span>
          </label>

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
                onChange={() => setAgeConfirmation("under_14")}
                type="radio"
              />
              만 14세 미만입니다.
            </label>
          </fieldset>

          {ageConfirmation === "under_14" ? (
            <p className="mt-3 text-xs font-semibold text-destructive" role="alert">
              만 14세 미만인 경우 현재 서비스를 이용할 수 없습니다.
            </p>
          ) : null}

          {registrationMutation.isError ? (
            <p className="mt-3 text-xs font-semibold text-destructive" role="alert">
              가입 확인을 저장하지 못했어요. 잠시 후 다시 시도해주세요.
            </p>
          ) : null}

          <button
            className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:bg-[#A5A9B2] disabled:text-white"
            disabled={!canCompleteRegistration}
            type="submit"
          >
            {registrationMutation.isPending ? "저장 중..." : "확인하고 계속하기"}
          </button>
        </form>
      </section>
    </div>
  );
}
