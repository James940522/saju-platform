import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarHeart,
  Coins,
  HeartHandshake,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { readingCatalog, type ReadingTheme } from "@/entities/reading";
import { routes } from "@/shared/config";

const themeIcons: Record<ReadingTheme, LucideIcon> = {
  self: ScrollText,
  relationship: HeartHandshake,
  fortune: CalendarHeart,
  wealth: Coins,
  career: BriefcaseBusiness,
  question: MessageCircleQuestion,
};

export function ReadingsPage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <p className="text-sm font-medium text-muted">궁금한 주제별 콘텐츠</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
        풀이
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        오늘의 흐름부터 관계, 일, 돈, 타고난 성향까지 원하는 풀이를
        골라보세요.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3">
        {readingCatalog.map((reading) => {
          const Icon = themeIcons[reading.theme];

          return (
            <Link
              className="min-h-[158px] rounded-2xl border border-border bg-surface p-4"
              href={routes.reading(reading.code)}
              key={reading.code}
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                {reading.title}
              </h2>
              <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
                {reading.description}
              </p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {reading.accessLabel}
              </p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
