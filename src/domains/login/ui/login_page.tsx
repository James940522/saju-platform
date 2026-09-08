import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingDefinition } from "@/entities/reading";
import { SocialLoginButtons } from "@/features/auth";
import { routes } from "@/shared/config";

type LoginPageProps = {
  authError?: string;
  intent?: string;
  role?: string;
  target?: string;
};

const LOGIN_ERROR_MESSAGE: Record<string, string> = {
  oauth_callback_failed:
    "소셜 로그인을 완료하지 못했어요. 다시 시도해주세요.",
  user_provisioning_failed:
    "로그인은 확인했지만 사용자 정보를 준비하지 못했어요. 잠시 후 다시 시도해주세요.",
};

export function LoginPage({ authError, intent, role, target }: LoginPageProps) {
  const reading = intent ? getReadingDefinition(intent) : undefined;

  if (intent && !reading) {
    notFound();
  }

  if (target && target !== "profile") {
    notFound();
  }

  if (role && role !== "default" && role !== "partner") {
    notFound();
  }

  if (role && target !== "profile") {
    notFound();
  }

  if (
    target === "profile" &&
    role === "partner" &&
    (!reading || reading.subjectRequirement.type !== "pair")
  ) {
    notFound();
  }

  const completionHref =
    target === "profile"
      ? routes.profileNew({
          ...(reading ? { intent: reading.code } : {}),
          role: role === "partner" ? "partner" : "default",
        })
      : reading
        ? routes.readingStart(reading.code)
        : routes.home;
  const backHref = reading ? routes.reading(reading.code) : routes.home;

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
          href={backHref}
          aria-label={reading ? `${reading.title} 소개로 돌아가기` : "홈으로 돌아가기"}
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div>
          <p className="text-[11px] font-semibold text-brand-gold-muted">SOCIAL SIGN IN</p>
          <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
            로그인
          </h1>
        </div>
      </header>

      <section className="mt-7 rounded-[24px] bg-hero px-5 py-7 text-primary-foreground shadow-soft">
        <span className="grid size-12 place-items-center rounded-full border border-brand-gold text-brand-gold-on-dark">
          <LogIn size={23} strokeWidth={1.7} />
        </span>
        <h2 className="mt-4 font-display text-[23px] font-bold leading-[1.45]">
          {reading
            ? `${reading.title} 풀이를 시작하려면 로그인해주세요`
            : "내 사주와 풀이 기록을 이어서 확인해요"}
        </h2>
        <p className="mt-3 text-xs leading-5 text-hero-foreground">
          카카오 또는 네이버 계정으로 간편하게 시작할 수 있어요.
        </p>
      </section>

      <SocialLoginButtons
        completionHref={completionHref}
        initialError={authError ? LOGIN_ERROR_MESSAGE[authError] : undefined}
      />

      <aside className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-brand-gold-muted" size={20} />
        <p className="text-[11px] leading-5 text-muted-foreground">
          서비스가 별도 비밀번호를 저장하지 않으며, 로그인 확인 후 필요한
          최소 사용자 정보만 서버에 생성합니다.
        </p>
      </aside>
    </main>
  );
}
