import {
  BriefcaseBusiness,
  CalendarHeart,
  Coins,
  HeartHandshake,
  MessageCircleQuestion,
  ScrollText,
} from "lucide-react";

const readingItems = [
  {
    title: "타고난 사주",
    description: "성향, 기질, 인생 전반의 큰 구조",
    price: "990원",
    icon: ScrollText,
  },
  {
    title: "재물운",
    description: "돈의 흐름과 지켜야 할 선택",
    price: "990원",
    icon: Coins,
  },
  {
    title: "연애운",
    description: "마음의 흐름과 관계의 온도",
    price: "990원",
    icon: HeartHandshake,
  },
  {
    title: "직업운",
    description: "일의 방향과 맞는 역할",
    price: "990원",
    icon: BriefcaseBusiness,
  },
  {
    title: "올해의 사주",
    description: "올해 조심할 때와 밀어붙일 때",
    price: "990원",
    icon: CalendarHeart,
  },
  {
    title: "고민 풀이",
    description: "지금 궁금한 일을 직접 묻기",
    price: "330원",
    icon: MessageCircleQuestion,
  },
];

export function ReadingsPage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <p className="text-sm font-medium text-muted">깊게 보는 콘텐츠</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
        풀이
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        타고난 성향과 관계, 일, 돈처럼 한 번 깊게 읽고 싶은 주제를 모아둔
        영역입니다.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3">
        {readingItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="min-h-[158px] rounded-2xl border border-border bg-surface p-4"
              key={item.title}
            >
              <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
                {item.description}
              </p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {item.price}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
