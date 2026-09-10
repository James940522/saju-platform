import Image from "next/image";
import Link from "next/link";
import type { ReadingCode } from "@/entities/reading";
import { BRAND_CHARACTER_IMAGES, routes } from "@/shared/config";

const fortuneItems: Array<{
  code: ReadingCode;
  title: string;
  description: string;
  badge: string;
  imageSrc: string;
}> = [
  {
    code: "daily-fortune",
    title: "오늘의 운세",
    description: "하루의 관계, 일, 금전 흐름",
    badge: "무료",
    imageSrc: BRAND_CHARACTER_IMAGES.spirit,
  },
  {
    code: "monthly-fortune",
    title: "이번 달 운세",
    description: "월간 흐름과 선택 포인트",
    badge: "준비 중",
    imageSrc: BRAND_CHARACTER_IMAGES.calendar,
  },
  {
    code: "three-month-fortune",
    title: "3개월 운세",
    description: "앞으로 세 달의 변화와 기회",
    badge: "준비 중",
    imageSrc: BRAND_CHARACTER_IMAGES.hourglass,
  },
];

export function FortunePage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <section className="grid grid-cols-[minmax(0,1fr)_88px] items-end gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            반복 방문 콘텐츠
          </p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
            운세
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            오늘, 이번 주, 이번 달처럼 시간이 지나며 바뀌는 운의 흐름을
            확인하는 메뉴입니다.
          </p>
        </div>
        <Image
          alt=""
          className="h-auto w-[92px] object-contain"
          height={184}
          src={BRAND_CHARACTER_IMAGES.moon}
          width={184}
        />
      </section>

      <section className="mt-6 space-y-3">
        {fortuneItems.map((item) => {
          return (
            <Link
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              href={routes.reading(item.code)}
              key={item.code}
            >
              <Image
                alt=""
                className="size-14 shrink-0 object-contain"
                height={112}
                src={item.imageSrc}
                width={112}
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                {item.badge}
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
