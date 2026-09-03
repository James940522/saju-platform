"use client";

import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  UserPlus,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import type {
  ReadingCode,
  ReadingSubjectRequirement,
} from "@/entities/reading";
import {
  getDemoUserIdentifier,
  getDemoUserServerSnapshot,
  subscribeToDemoUser,
} from "@/entities/demo_user";
import {
  getDemoReadingPurchaseSnapshot,
  parseDemoReadingPurchaseSnapshot,
  subscribeToDemoReadingPurchases,
} from "@/entities/reading_purchase";
import {
  getDemoSajuProfileSnapshot,
  parseDemoSajuProfileSnapshot,
  subscribeToDemoSajuProfiles,
  type SajuProfileDraft,
} from "@/entities/saju_profile";
import { routes } from "@/shared/config";

type ReadingStartGateProps = {
  price?: number;
  readingCode: ReadingCode;
  readingTitle: string;
  subjectRequirement: ReadingSubjectRequirement;
};

function formatKoreanWon(amount: number) {
  return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
}

function ProfileStatusCard({
  label,
  profile,
}: {
  label: string;
  profile: SajuProfileDraft;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
        <CheckCircle2 size={21} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-foreground">
          {profile.displayName} · {profile.birthDate.year}.
          {profile.birthDate.month}.{profile.birthDate.day}
        </p>
      </div>
    </div>
  );
}

function PendingAction({ children }: { children: string }) {
  return (
    <button
      className="mt-4 h-14 w-full cursor-not-allowed rounded-2xl border border-border bg-surface font-display text-[17px] font-bold text-muted"
      disabled
      type="button"
    >
      {children}
    </button>
  );
}

export function ReadingStartGate({
  price,
  readingCode,
  readingTitle,
  subjectRequirement,
}: ReadingStartGateProps) {
  const router = useRouter();
  const userIdentifier = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoUser,
    getDemoUserIdentifier,
    getDemoUserServerSnapshot,
  );
  const defaultProfileSnapshot = useSyncExternalStore<
    string | null | undefined
  >(
    subscribeToDemoSajuProfiles,
    () => getDemoSajuProfileSnapshot("default"),
    () => undefined,
  );
  const partnerProfileSnapshot = useSyncExternalStore<
    string | null | undefined
  >(
    subscribeToDemoSajuProfiles,
    () => getDemoSajuProfileSnapshot("partner"),
    () => undefined,
  );
  const purchaseSnapshot = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoReadingPurchases,
    () => getDemoReadingPurchaseSnapshot(readingCode),
    () => undefined,
  );
  const defaultProfile =
    typeof defaultProfileSnapshot === "string"
      ? parseDemoSajuProfileSnapshot(defaultProfileSnapshot)
      : null;
  const partnerProfile =
    typeof partnerProfileSnapshot === "string"
      ? parseDemoSajuProfileSnapshot(partnerProfileSnapshot)
      : null;
  const parsedPurchase =
    typeof purchaseSnapshot === "string"
      ? parseDemoReadingPurchaseSnapshot(purchaseSnapshot)
      : null;
  const purchase =
    parsedPurchase?.readingCode === readingCode &&
    (price === undefined || parsedPurchase.amount === price)
      ? parsedPurchase
      : null;
  const isChecking =
    userIdentifier === undefined ||
    defaultProfileSnapshot === undefined ||
    partnerProfileSnapshot === undefined ||
    purchaseSnapshot === undefined;
  const hasDefaultProfile = Boolean(defaultProfile);

  useEffect(() => {
    if (isChecking) {
      return;
    }

    if (!userIdentifier) {
      router.replace(routes.login({ intent: readingCode }));
      return;
    }

    if (!hasDefaultProfile) {
      router.replace(
        routes.profileNew({ intent: readingCode, role: "default" }),
      );
    }
  }, [hasDefaultProfile, isChecking, readingCode, router, userIdentifier]);

  if (isChecking || !userIdentifier || !defaultProfile) {
    return (
      <section
        aria-live="polite"
        className="mt-5 rounded-[22px] border border-paper-border bg-paper px-5 py-7 text-center"
      >
        <p className="font-display text-lg font-bold text-foreground">
          이용 조건을 확인하고 있어요
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">
          로그인과 기본 사주 정보가 없으면 필요한 화면으로 자동 이동해요.
        </p>
      </section>
    );
  }

  if (subjectRequirement.type === "pair" && !partnerProfile) {
    return (
      <section className="mt-5">
        <ProfileStatusCard label="내 사주 저장 완료" profile={defaultProfile} />
        <div className="mt-3 rounded-[22px] border border-dashed border-accent bg-accent-soft/20 px-5 py-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-paper text-[#9a7c42]">
            <UserPlus size={23} strokeWidth={1.7} />
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-foreground">
            상대 사주가 필요해요
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted">
            {readingTitle} 풀이는 두 사람의 생년월일 정보를 함께 사용해요.
          </p>
          <Link
            className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary font-display text-base font-bold text-[#f1cf78]"
            href={routes.profileNew({
              intent: readingCode,
              role: "partner",
            })}
          >
            상대 사주 입력하기
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  if (subjectRequirement.type === "group") {
    return (
      <section className="mt-5">
        <ProfileStatusCard label="내 사주 저장 완료" profile={defaultProfile} />
        <div className="mt-3 rounded-[22px] border border-paper-border bg-paper px-5 py-6 text-center">
          <UsersRound className="mx-auto text-[#9a7c42]" size={31} strokeWidth={1.6} />
          <h2 className="mt-3 font-display text-lg font-bold text-foreground">
            함께 볼 사람을 선택할 차례예요
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted">
            이 풀이는 {subjectRequirement.min}명부터 {subjectRequirement.max}명까지
            참여할 수 있어요.
          </p>
        </div>
        <PendingAction>참여자 선택 준비 중</PendingAction>
      </section>
    );
  }

  return (
    <section className="mt-5">
      <div className="space-y-3">
        <ProfileStatusCard label="내 사주 저장 완료" profile={defaultProfile} />
        {subjectRequirement.type === "pair" && partnerProfile ? (
          <ProfileStatusCard label="상대 사주 저장 완료" profile={partnerProfile} />
        ) : null}
      </div>

      {price !== undefined && !purchase ? (
        <div className="mt-4 rounded-[22px] border border-paper-border bg-paper px-5 py-5 text-center">
          <CreditCard className="mx-auto text-[#9a7c42]" size={30} strokeWidth={1.6} />
          <h2 className="mt-3 font-display text-lg font-bold text-foreground">
            결제 후 전체 풀이를 볼 수 있어요
          </h2>
          <p className="mt-2 text-sm font-semibold text-primary">
            {formatKoreanWon(price)} · 데모 결제
          </p>
          <Link
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-primary font-display text-[18px] font-bold text-[#f1cf78]"
            href={routes.readingCheckout(readingCode)}
          >
            간편결제로 계속하기
            <ChevronRight size={19} />
          </Link>
        </div>
      ) : readingCode === "past-life-relationship" && purchase ? (
        <Link
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-primary font-display text-[18px] font-bold text-[#f1cf78]"
          href={routes.result("past-life-relationship-demo")}
        >
          결제한 풀이 결과 보기
          <ChevronRight size={19} />
        </Link>
      ) : (
        <PendingAction>풀이 생성 연결 준비 중</PendingAction>
      )}
    </section>
  );
}
