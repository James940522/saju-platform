import { AuthButton } from "@/features/auth";

import { HomeProductSections } from "./home_product_sections";

export function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="flex items-center justify-between px-4 pb-4 pt-[calc(18px+env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface font-display text-sm font-bold text-primary">
            00
          </div>
          <div>
            <p className="font-display text-[22px] font-bold leading-none text-foreground">
              00사주
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              당신의 오늘을 함께 바라봅니다
            </p>
          </div>
        </div>
        <AuthButton />
      </header>

      <HomeProductSections />

      <section className="mt-5 px-4 pb-4">
        <div className="grid min-h-[138px] grid-cols-[minmax(0,1fr)_76px] items-center gap-3 rounded-2xl border border-paper-border bg-paper p-4">
          <div>
            <h2 className="font-display text-[18px] font-bold text-foreground">
              00사주가 전하는 마음
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
              어려운 말보다 궁금한 질문에 먼저 답하고,
              <br />
              더 나은 선택을 할 수 있도록 함께합니다.
            </p>
          </div>
          <div className="grid size-[76px] place-items-center rounded-full border border-brand-gold bg-surface font-display text-[12px] text-brand-gold-foreground">
            캐릭터
          </div>
        </div>
      </section>
    </main>
  );
}
