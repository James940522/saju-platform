"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";
import { getBrowserSupabaseClient } from "@/shared/supabase/browser_client";

type SocialLoginButtonsProps = {
  completionHref: string;
  initialError?: string;
};

type SocialProvider = "kakao" | "custom:naver";

export function SocialLoginButtons({
  completionHref,
  initialError,
}: SocialLoginButtonsProps) {
  const [pendingProvider, setPendingProvider] = useState<SocialProvider>();
  const [loginError, setLoginError] = useState(initialError);

  async function handleSignIn(provider: SocialProvider) {
    setPendingProvider(provider);
    setLoginError(undefined);

    try {
      const supabase = getBrowserSupabaseClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", completionHref);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        throw error;
      }
    } catch {
      setLoginError(
        "로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
      setPendingProvider(undefined);
    }
  }

  const isPending = pendingProvider !== undefined;

  return (
    <section className="mt-6 space-y-3" aria-label="소셜 로그인">
      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] text-[15px] font-bold text-[#191919] disabled:opacity-60"
        disabled={isPending}
        onClick={() => void handleSignIn("kakao")}
        type="button"
      >
        <span className="font-black" aria-hidden="true">
          K
        </span>
        {pendingProvider === "kakao" ? "카카오로 이동 중..." : "카카오로 계속하기"}
      </button>

      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#03C75A] text-[15px] font-bold text-white disabled:opacity-60"
        disabled={isPending}
        onClick={() => void handleSignIn("custom:naver")}
        type="button"
      >
        <span className="font-black" aria-hidden="true">
          N
        </span>
        {pendingProvider === "custom:naver" ? "네이버로 이동 중..." : "네이버로 계속하기"}
      </button>

      {loginError ? (
        <p
          className="rounded-xl bg-destructive-soft px-3.5 py-3 text-xs font-semibold leading-5 text-destructive"
          role="alert"
        >
          {loginError}
        </p>
      ) : null}

      <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] leading-5 text-muted-foreground">
        <LogIn size={14} strokeWidth={1.8} />
        별도의 아이디나 비밀번호를 만들지 않아요.
      </p>
    </section>
  );
}
