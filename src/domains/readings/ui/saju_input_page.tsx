import { ArrowLeft, CircleHelp } from "lucide-react";
import Link from "next/link";
import { SajuInputForm } from "@/features/saju_input";

const steps = ["정보 입력", "정보 확인", "사주 구성", "풀이 준비"];

export function SajuInputPage() {
  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <Link
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          href="/"
          aria-label="홈으로 돌아가기"
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div className="min-w-0 flex-1 px-3">
          <h1 className="font-display text-[23px] font-bold leading-none text-foreground">
            내 사주 입력
          </h1>
          <p className="mt-1.5 text-[11px] text-muted">
            정확한 정보가 좋은 풀이의 시작이에요
          </p>
        </div>
        <button
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          type="button"
          aria-label="사주 정보 입력 도움말"
        >
          <CircleHelp size={21} strokeWidth={1.7} />
        </button>
      </header>

      <ol className="mt-7 grid grid-cols-4" aria-label="풀이 진행 단계">
        {steps.map((step, index) => (
          <li className="relative flex min-w-0 flex-col items-center" key={step}>
            {index > 0 ? (
              <span
                className="absolute right-1/2 top-[17px] h-px w-full bg-border"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={`relative z-[1] grid size-9 place-items-center rounded-full border font-display text-sm font-bold ${
                index === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-paper-border bg-background text-[#9a7c42]"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`mt-2 whitespace-nowrap text-[10px] font-semibold ${
                index === 0 ? "text-primary" : "text-[#9a7c42]"
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-7 grid min-h-[186px] grid-cols-[92px_minmax(0,1fr)] items-center gap-4 rounded-[22px] bg-hero p-5 text-primary-foreground">
        <div className="grid size-[92px] place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-xs text-[#8f7137]">
          캐릭터
        </div>
        <div>
          <h2 className="font-display text-[21px] font-bold leading-[1.55]">
            정확한 입력이
            <br />
            좋은 풀이로 이어져요
          </h2>
          <p className="mt-2 text-[11px] leading-5 text-[#dce4ef]">
            생년월일과 시간을 바탕으로
            <br />
            나만의 사주를 구성해요.
            <br />
            모를 경우 비워두어도 괜찮아요.
          </p>
        </div>
      </section>

      <SajuInputForm />
    </main>
  );
}
