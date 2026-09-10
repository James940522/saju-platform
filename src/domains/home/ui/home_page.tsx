import Image from "next/image";
import { AuthButton } from "@/features/auth";
import { BRAND_CHARACTER_IMAGES, BRAND_NAME } from "@/shared/config";

import { HomeProductSections } from "./home_product_sections";

export function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="flex items-center justify-between px-4 pb-4 pt-[calc(18px+env(safe-area-inset-top))]">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            alt=""
            className="size-14 shrink-0 object-contain"
            height={56}
            preload
            src={BRAND_CHARACTER_IMAGES.cheerful}
            width={56}
          />
          <div className="min-w-0">
            <p className="whitespace-nowrap font-display text-[22px] font-bold leading-none text-foreground">
              {BRAND_NAME}
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
        <div className="grid min-h-[148px] grid-cols-[minmax(0,1fr)_92px] items-center gap-2 overflow-hidden rounded-2xl border border-paper-border bg-paper p-4">
          <div>
            <h2 className="font-display text-[18px] font-bold text-foreground">
              {BRAND_NAME}가 전하는 마음
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
              어려운 말보다 궁금한 질문에 먼저 답하고,
              <br />
              더 나은 선택을 할 수 있도록 함께합니다.
            </p>
          </div>
          <Image
            alt=""
            className="h-auto w-[92px] object-contain"
            height={188}
            src={BRAND_CHARACTER_IMAGES.presenting}
            width={188}
          />
        </div>
      </section>
    </main>
  );
}
