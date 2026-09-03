import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingDefinition } from "@/entities/reading";
import { DemoLoginForm } from "@/features/demo_auth";
import { routes } from "@/shared/config";

type LoginPageProps = {
  intent?: string;
  role?: string;
  target?: string;
};

export function LoginPage({ intent, role, target }: LoginPageProps) {
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
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          href={backHref}
          aria-label={reading ? `${reading.title} 소개로 돌아가기` : "홈으로 돌아가기"}
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div>
          <p className="text-[11px] font-semibold text-[#9a7c42]">DEMO ACCOUNT</p>
          <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
            로그인
          </h1>
        </div>
      </header>

      <section className="mt-7 rounded-[24px] bg-hero px-5 py-7 text-primary-foreground shadow-soft">
        <span className="grid size-12 place-items-center rounded-full border border-accent text-[#f1cf78]">
          <LogIn size={23} strokeWidth={1.7} />
        </span>
        <h2 className="mt-4 font-display text-[23px] font-bold leading-[1.45]">
          {reading
            ? `${reading.title} 풀이를 시작하려면 로그인해주세요`
            : "내 사주와 풀이 기록을 이어서 확인해요"}
        </h2>
        <p className="mt-3 text-xs leading-5 text-[#dce4ef]">
          지금은 화면 흐름을 확인하는 단계라 실제 계정 인증은 하지 않아요.
        </p>
      </section>

      <DemoLoginForm completionHref={completionHref} />

      <aside className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-[#9a7c42]" size={20} />
        <p className="text-[11px] leading-5 text-muted">
          입력한 비밀번호는 저장하거나 외부로 전송하지 않습니다. 실제 인증은
          추후 백엔드 세션으로 교체할 영역이에요.
        </p>
      </aside>
    </main>
  );
}
