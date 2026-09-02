import { CalendarDays, MoonStar, Sparkles, Sunrise } from "lucide-react";

const fortuneItems = [
  {
    title: "오늘의 운세",
    description: "하루의 관계, 일, 금전 흐름",
    badge: "무료",
    icon: Sunrise,
  },
  {
    title: "이번 주 운세",
    description: "이번 주에 챙겨야 할 기운",
    badge: "준비 중",
    icon: CalendarDays,
  },
  {
    title: "이번 달 운세",
    description: "월간 흐름과 선택 포인트",
    badge: "준비 중",
    icon: MoonStar,
  },
  {
    title: "신년 운세",
    description: "새해의 방향과 주의할 시기",
    badge: "준비 중",
    icon: Sparkles,
  },
];

export function FortunePage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <p className="text-sm font-medium text-muted">반복 방문 콘텐츠</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
        운세
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        오늘, 이번 주, 이번 달처럼 시간이 지나며 바뀌는 운의 흐름을 확인하는
        메뉴입니다.
      </p>

      <section className="mt-6 space-y-3">
        {fortuneItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              key={item.title}
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {item.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                {item.badge}
              </span>
            </article>
          );
        })}
      </section>
    </main>
  );
}
