"use client";

import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import {
  getDemoUserIdentifier,
  signInDemoUser,
} from "@/entities/demo_user";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import { clearDemoSajuProfiles } from "@/entities/saju_profile";

type DemoLoginFormProps = {
  completionHref: string;
};

export function DemoLoginForm({ completionHref }: DemoLoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string>();

  function rejectLogin(message: string) {
    setPassword("");
    setFormError(message);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedIdentifier = identifier.trim();

    if (normalizedIdentifier.length < 2) {
      rejectLogin("아이디를 2자 이상 입력해주세요.");
      return;
    }

    if (password.length < 4) {
      rejectLogin("비밀번호를 4자 이상 입력해주세요.");
      return;
    }

    const previousIdentifier = getDemoUserIdentifier();

    if (previousIdentifier !== normalizedIdentifier) {
      const areProfilesCleared = clearDemoSajuProfiles();
      const arePurchasesCleared = clearDemoReadingPurchases();

      if (!areProfilesCleared || !arePurchasesCleared) {
        rejectLogin(
          "이전 데모 정보를 정리하지 못했어요. 저장소 설정을 확인해주세요.",
        );
        return;
      }
    }

    if (!signInDemoUser(normalizedIdentifier)) {
      rejectLogin(
        "현재 브라우저에서 로그인 상태를 기억할 수 없어요. 저장소 설정을 확인해주세요.",
      );
      return;
    }

    setFormError(undefined);
    setPassword("");
    router.replace(completionHref);
  }

  return (
    <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
      <div>
        <label
          className="text-sm font-bold text-foreground"
          htmlFor="demo-identifier"
        >
          아이디
        </label>
        <div className="relative mt-2">
          <UserRound
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={19}
            strokeWidth={1.8}
          />
          <input
            aria-invalid={formError ? true : undefined}
            autoComplete="username"
            className="h-13 w-full rounded-xl border border-border bg-surface pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent-soft"
            id="demo-identifier"
            maxLength={40}
            name="identifier"
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="2자 이상 입력"
            type="text"
            value={identifier}
          />
        </div>
      </div>

      <div>
        <label
          className="text-sm font-bold text-foreground"
          htmlFor="demo-password"
        >
          비밀번호
        </label>
        <div className="relative mt-2">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={19}
            strokeWidth={1.8}
          />
          <input
            aria-describedby={formError ? "demo-login-error" : undefined}
            aria-invalid={formError ? true : undefined}
            autoComplete="current-password"
            className="h-13 w-full rounded-xl border border-border bg-surface pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent-soft"
            id="demo-password"
            maxLength={80}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="4자 이상 입력"
            type="password"
            value={password}
          />
        </div>
      </div>

      {formError ? (
        <p
          className="rounded-xl bg-[#f9e8e3] px-3.5 py-3 text-xs font-semibold leading-5 text-[#a24646]"
          id="demo-login-error"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-display text-[18px] font-bold text-[#f1cf78]"
        type="submit"
      >
        데모 로그인
        <LogIn size={19} strokeWidth={1.8} />
      </button>

      <p className="rounded-xl border border-paper-border bg-paper px-4 py-3 text-[11px] leading-5 text-muted">
        실제 계정을 확인하지 않는 UI 프로토타입이에요. 아무 아이디와
        비밀번호를 조건에 맞게 입력하면 로그인되며, 현재 탭에는 아이디만
        기억하고 비밀번호는 저장하지 않아요.
      </p>
    </form>
  );
}
