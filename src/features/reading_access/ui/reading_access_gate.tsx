"use client";

import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
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
} from "@/entities/saju_profile";
import { routes } from "@/shared/config";

type ReadingAccessGateProps = {
  children: ReactNode;
  readingCode: string;
  requiredPaymentAmount?: number;
  requiresPartner?: boolean;
};

export function ReadingAccessGate({
  children,
  readingCode,
  requiredPaymentAmount,
  requiresPartner = false,
}: ReadingAccessGateProps) {
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
  const purchase =
    typeof purchaseSnapshot === "string"
      ? parseDemoReadingPurchaseSnapshot(purchaseSnapshot)
      : null;
  const isChecking =
    userIdentifier === undefined ||
    defaultProfileSnapshot === undefined ||
    partnerProfileSnapshot === undefined ||
    purchaseSnapshot === undefined;
  const hasRequiredProfiles =
    Boolean(defaultProfile) && (!requiresPartner || Boolean(partnerProfile));
  const hasRequiredPayment =
    requiredPaymentAmount === undefined ||
    (purchase?.readingCode === readingCode &&
      purchase.amount === requiredPaymentAmount);
  const canAccess =
    Boolean(userIdentifier) && hasRequiredProfiles && hasRequiredPayment;

  useEffect(() => {
    if (!isChecking && !canAccess) {
      router.replace(routes.readingStart(readingCode));
    }
  }, [canAccess, isChecking, readingCode, router]);

  if (isChecking || !canAccess) {
    return (
      <main className="min-h-dvh px-4 pt-[calc(16px+env(safe-area-inset-top))]">
        <section
          aria-live="polite"
          className="rounded-[22px] border border-paper-border bg-paper px-5 py-7 text-center"
        >
          <p className="font-display text-lg font-bold text-foreground">
            풀이 이용 상태를 확인하고 있어요
          </p>
          <p className="mt-2 text-xs leading-5 text-muted">
            필요한 단계가 남아 있으면 풀이 준비 화면으로 이동해요.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
