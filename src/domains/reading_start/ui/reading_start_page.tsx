import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReadingDefinition,
  getReadingSubjectLabel,
} from "@/entities/reading";
import { ReadingStartGate } from "@/features/start_reading";
import { routes } from "@/shared/config";

type ReadingStartPageProps = {
  readingCode: string;
};

export function ReadingStartPage({ readingCode }: ReadingStartPageProps) {
  const reading = getReadingDefinition(readingCode);

  if (!reading) {
    notFound();
  }

  const subjectLabel = getReadingSubjectLabel(reading.subjectRequirement);

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          href={routes.reading(reading.code)}
          aria-label={`${reading.title} 소개로 돌아가기`}
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#9a7c42]">풀이 준비</p>
          <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
            {reading.title}
          </h1>
        </div>
      </header>

      <section className="mt-6 rounded-[24px] bg-hero px-5 py-6 text-primary-foreground shadow-soft">
        <p className="flex items-center gap-2 text-xs font-semibold text-[#e7bd5f]">
          <Sparkles size={15} />
          {subjectLabel}
        </p>
        <h2 className="mt-3 font-display text-[22px] font-bold leading-[1.45]">
          필요한 사주가 준비되었는지 확인할게요
        </h2>
        <p className="mt-2 text-xs leading-5 text-[#dce4ef]">
          등록되지 않은 정보만 차례대로 입력한 뒤 이 화면으로 돌아와요.
        </p>
      </section>

      <ReadingStartGate
        price={reading.price}
        readingCode={reading.code}
        readingTitle={reading.title}
        subjectRequirement={reading.subjectRequirement}
      />

      <aside className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3 text-[11px] leading-5 text-muted">
        현재 UI 프로토타입은 입력한 사주와 결제 완료 상태를 이 탭에만
        저장해요. 실제 인증, 결제 승인, 사주 계산과 풀이 생성은 백엔드 연결
        단계에서 추가합니다.
      </aside>
    </main>
  );
}
