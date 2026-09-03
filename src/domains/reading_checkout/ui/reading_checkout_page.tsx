import { ArrowLeft, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingDefinition } from "@/entities/reading";
import { DemoCheckoutForm } from "@/features/demo_checkout";
import { ReadingAccessGate } from "@/features/reading_access";
import { routes } from "@/shared/config";

type ReadingCheckoutPageProps = {
  readingCode: string;
};

export function ReadingCheckoutPage({
  readingCode,
}: ReadingCheckoutPageProps) {
  const reading = getReadingDefinition(readingCode);

  if (
    !reading ||
    reading.code !== "past-life-relationship" ||
    reading.price === undefined
  ) {
    notFound();
  }

  return (
    <ReadingAccessGate readingCode={reading.code} requiresPartner>
      <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
        <header className="flex items-center gap-3">
          <Link
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted"
            href={routes.readingStart(reading.code)}
            aria-label="풀이 준비로 돌아가기"
          >
            <ArrowLeft size={22} strokeWidth={1.7} />
          </Link>
          <div>
            <p className="text-[11px] font-semibold text-[#9a7c42]">DEMO CHECKOUT</p>
            <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
              간편결제
            </h1>
          </div>
        </header>

        <section className="mt-6 rounded-[24px] bg-hero px-5 py-6 text-primary-foreground shadow-soft">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#e7bd5f]">
            <Sparkles size={15} />
            풀이 준비 마지막 단계
          </p>
          <h2 className="mt-3 font-display text-[22px] font-bold leading-[1.45]">
            간편결제 화면까지 확인해볼게요
          </h2>
          <p className="mt-2 flex items-center gap-2 text-xs leading-5 text-[#dce4ef]">
            <CreditCard size={16} />
            결제 버튼을 눌러도 실제 금액은 청구되지 않아요.
          </p>
        </section>

        <DemoCheckoutForm
          amount={reading.price}
          completionHref={routes.result("past-life-relationship-demo")}
          readingCode={reading.code}
          readingTitle={reading.title}
        />
      </main>
    </ReadingAccessGate>
  );
}
