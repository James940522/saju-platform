import { ArrowLeft, CircleHelp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingDefinition } from "@/entities/reading";
import type {
  SajuProfileSlot,
  SajuRelationType,
} from "@/entities/saju_profile";
import { AuthGate } from "@/features/auth";
import { CreateSajuProfileForm } from "@/features/saju_input";
import { BRAND_CHARACTER_IMAGES, routes } from "@/shared/config";

const steps = ["정보 입력", "정보 확인", "사주 구성", "풀이 준비"];

type SajuProfileCreatePageProps = {
  intent?: string;
  role?: string;
};

export function SajuProfileCreatePage({
  intent,
  role,
}: SajuProfileCreatePageProps) {
  const reading = intent ? getReadingDefinition(intent) : undefined;

  if (intent && !reading) {
    notFound();
  }

  if (role && role !== "default" && role !== "partner") {
    notFound();
  }

  const profileRole: SajuProfileSlot | undefined =
    role === "partner" ? "partner" : role === "default" ? "default" : undefined;

  if (
    profileRole === "partner" &&
    (!reading || reading.subjectRequirement.type !== "pair")
  ) {
    notFound();
  }

  const fixedRelationType: SajuRelationType | undefined =
    profileRole === "partner"
      ? "partner"
      : profileRole === "default"
        ? "self"
        : undefined;
  const isPartner = profileRole === "partner";
  const backHref = reading
    ? routes.reading(reading.code)
    : profileRole
      ? routes.mySaju
      : routes.sajuProfiles;
  const completionHref = reading
    ? routes.readingStart(reading.code)
    : profileRole
      ? routes.mySaju
      : routes.sajuProfiles;
  const profileLabel = isPartner
    ? "상대 사주"
    : profileRole === "default"
      ? "내 사주"
      : "사주 프로필";
  const loginHref = profileRole
    ? routes.login({
        target: "profile",
        ...(reading ? { intent: reading.code } : {}),
        role: profileRole,
      })
    : routes.login({ next: routes.profileNew() });

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <Link
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
          href={backHref}
          aria-label={
            reading
              ? `${reading.title} 소개로 돌아가기`
              : profileRole
                ? "내 만세력으로 돌아가기"
                : "사주 관리로 돌아가기"
          }
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div className="min-w-0 flex-1 px-3">
          <h1 className="font-display text-[23px] font-bold leading-none text-foreground">
            {profileLabel} 입력
          </h1>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {reading
              ? `${reading.title}에 사용할 정보를 입력해요`
              : "정확한 정보가 좋은 풀이의 시작이에요"}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
        >
          <CircleHelp size={21} strokeWidth={1.7} />
        </span>
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
                  : "border-paper-border bg-background text-brand-gold-muted"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`mt-2 whitespace-nowrap text-[10px] font-semibold ${
                index === 0 ? "text-primary" : "text-brand-gold-muted"
              }`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-7 grid min-h-[186px] grid-cols-[104px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-[22px] bg-hero p-5 text-primary-foreground">
        <Image
          alt=""
          className="h-auto w-[104px] object-contain"
          height={208}
          preload
          src={BRAND_CHARACTER_IMAGES.thinking}
          width={208}
        />
        <div>
          <h2 className="font-display text-[21px] font-bold leading-[1.55]">
            정확한 입력이
            <br />
            좋은 풀이로 이어져요
          </h2>
          <p className="mt-2 text-[11px] leading-5 text-hero-foreground">
            생년월일과 시간을 바탕으로
            <br />
            {profileLabel}를 구성해요.
            <br />
            출생 시간을 몰라도 진행할 수 있어요.
          </p>
        </div>
      </section>

      <AuthGate loginHref={loginHref}>
        <CreateSajuProfileForm
          completionHref={completionHref}
          fixedRelationType={fixedRelationType}
          submitLabel={`${profileLabel} 저장하기`}
        />
      </AuthGate>
    </main>
  );
}
