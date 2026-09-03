"use client";

import { CheckCircle2, CreditCard, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useSyncExternalStore } from "react";
import {
  getDemoReadingPurchaseSnapshot,
  parseDemoReadingPurchaseSnapshot,
  saveDemoReadingPurchase,
  subscribeToDemoReadingPurchases,
  type DemoPaymentMethod,
} from "@/entities/reading_purchase";

const paymentMethods: Array<{
  value: DemoPaymentMethod;
  label: string;
  tone: string;
}> = [
  { value: "kakao-pay", label: "카카오페이", tone: "bg-[#fee500] text-[#191919]" },
  { value: "naver-pay", label: "네이버페이", tone: "bg-[#03c75a] text-white" },
  { value: "toss-pay", label: "토스페이", tone: "bg-[#e8efff] text-[#2358d7]" },
];

type DemoCheckoutFormProps = {
  amount: number;
  completionHref: string;
  readingCode: string;
  readingTitle: string;
};

function formatKoreanWon(amount: number) {
  return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
}

export function DemoCheckoutForm({
  amount,
  completionHref,
  readingCode,
  readingTitle,
}: DemoCheckoutFormProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] =
    useState<DemoPaymentMethod>();
  const [formError, setFormError] = useState<string>();
  const purchaseSnapshot = useSyncExternalStore(
    subscribeToDemoReadingPurchases,
    () => getDemoReadingPurchaseSnapshot(readingCode),
    () => null,
  );
  const parsedPurchase = parseDemoReadingPurchaseSnapshot(purchaseSnapshot);
  const purchase =
    parsedPurchase?.readingCode === readingCode &&
    parsedPurchase.amount === amount
      ? parsedPurchase
      : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedMethod) {
      setFormError("간편결제 수단을 선택해주세요.");
      return;
    }

    const isSaved = saveDemoReadingPurchase({
      amount,
      method: selectedMethod,
      paidAt: new Date().toISOString(),
      readingCode,
    });

    if (!isSaved) {
      setFormError("데모 결제 상태를 저장하지 못했어요. 다시 시도해주세요.");
      return;
    }

    setFormError(undefined);
    router.replace(completionHref);
  }

  if (purchase) {
    return (
      <section className="mt-5 rounded-[24px] border border-paper-border bg-paper p-5 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={36} strokeWidth={1.7} />
        <h2 className="mt-3 font-display text-xl font-bold text-foreground">
          데모 결제가 완료되어 있어요
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted">
          실제 결제나 청구는 발생하지 않았어요.
        </p>
        <Link
          className="mt-5 flex h-13 w-full items-center justify-center rounded-xl bg-primary font-display text-base font-bold text-[#f1cf78]"
          href={completionHref}
        >
          풀이 결과 보기
        </Link>
      </section>
    );
  }

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <section className="rounded-[24px] border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-xs font-medium text-muted">결제할 풀이</p>
            <h2 className="mt-1 font-display text-lg font-bold text-foreground">
              {readingTitle}
            </h2>
          </div>
          <p className="shrink-0 font-display text-xl font-bold text-primary">
            {formatKoreanWon(amount)}
          </p>
        </div>

        <fieldset className="mt-5">
          <legend className="font-display text-base font-bold text-foreground">
            간편결제 선택
          </legend>
          <div className="mt-3 space-y-2">
            {paymentMethods.map((method) => (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                  selectedMethod === method.value
                    ? "border-primary bg-primary-soft/35"
                    : "border-border"
                }`}
                key={method.value}
              >
                <input
                  checked={selectedMethod === method.value}
                  className="size-4 accent-[#1c385e]"
                  name="paymentMethod"
                  onChange={() => setSelectedMethod(method.value)}
                  required
                  type="radio"
                  value={method.value}
                />
                <span
                  className={`inline-flex min-w-24 items-center justify-center rounded-lg px-3 py-2 text-xs font-bold ${method.tone}`}
                >
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <aside className="mt-3 flex items-start gap-3 rounded-2xl border border-accent/60 bg-accent-soft/25 px-4 py-4">
        <LockKeyhole className="mt-0.5 shrink-0 text-[#9a7c42]" size={20} />
        <div>
          <p className="text-xs font-bold text-foreground">UI 확인용 데모 결제예요</p>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            외부 결제사로 정보를 보내지 않으며 실제 승인이나 청구는 발생하지
            않아요.
          </p>
        </div>
      </aside>

      <button
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-accent bg-primary font-display text-[18px] font-bold text-[#f1cf78]"
        type="submit"
      >
        <CreditCard size={19} />
        {formatKoreanWon(amount)} 데모 결제하기
      </button>

      {formError ? (
        <p className="mt-3 text-center text-xs font-semibold text-[#a24646]" role="alert">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
