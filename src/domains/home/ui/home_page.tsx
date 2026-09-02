import {
  Bell,
  CalendarHeart,
  ChevronRight,
  Flame,
  HeartHandshake,
  Home,
  MessageCircleQuestion,
  MoonStar,
  ScrollText,
  Sparkles,
  UserRound,
} from "lucide-react";

const fortuneMenus = [
  {
    title: "사주 풀이",
    description: "타고난 성향과 흐름",
    price: "990원",
    icon: ScrollText,
  },
  {
    title: "애정운",
    description: "관계와 마음의 방향",
    price: "990원",
    icon: HeartHandshake,
  },
  {
    title: "직업운",
    description: "일과 선택의 기운",
    price: "990원",
    icon: Sparkles,
  },
  {
    title: "궁합",
    description: "두 사람의 리듬",
    price: "990원",
    icon: MoonStar,
  },
  {
    title: "올해 운세",
    description: "한 해의 큰 흐름",
    price: "990원",
    icon: CalendarHeart,
  },
  {
    title: "고민 상담",
    description: "지금 묻고 싶은 일",
    price: "330원",
    icon: MessageCircleQuestion,
  },
];

const todaySignals = [
  { label: "관계", value: "차분히 듣기" },
  { label: "일", value: "정리 후 결정" },
  { label: "금전", value: "작은 지출 주의" },
];

const navItems = [
  { label: "홈", icon: Home, isActive: true },
  { label: "운세", icon: MoonStar, isActive: false },
  { label: "기도", icon: Flame, isActive: false },
  { label: "마이", icon: UserRound, isActive: false },
];

export function HomePage() {
  return (
    <main className="min-h-dvh pb-[calc(86px+env(safe-area-inset-bottom))]">
      <header className="px-5 pb-4 pt-[calc(18px+env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">방문자님,</p>
            <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
              오늘의 운을
              <br />
              차분히 살펴볼게요
            </h1>
          </div>
          <button
            className="grid size-11 place-items-center rounded-full border border-border bg-surface text-foreground"
            type="button"
            aria-label="알림 보기"
          >
            <Bell size={20} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <section className="px-5">
        <div className="rounded-[24px] border border-paper-border bg-paper p-5 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <MoonStar size={30} strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Today
              </p>
              <h2 className="mt-2 text-xl font-semibold leading-snug text-foreground">
                생년월일을 입력하고 나만의 흐름을 받아보세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                사주 구조와 오늘의 기운을 한 화면에서 가볍게 확인할 수
                있도록 준비 중입니다.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <a
              className="flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
              href="#birth-start"
            >
              내 사주 입력하기
            </a>
            <a
              className="grid size-12 place-items-center rounded-full border border-border bg-surface text-foreground"
              href="#daily-fortune"
              aria-label="오늘의 운세 보기"
            >
              <ChevronRight size={21} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </section>

      <section className="mt-5 px-5" id="daily-fortune">
        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                오늘의 기운
              </p>
              <p className="mt-1 text-sm text-muted">매일 바뀌는 무료 운세</p>
            </div>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              무료
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {todaySignals.map((signal) => (
              <div
                className="min-h-20 rounded-2xl border border-border bg-background p-3"
                key={signal.label}
              >
                <p className="text-xs text-muted">{signal.label}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-foreground">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted">운세 메뉴</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              필요한 풀이만 골라보기
            </h2>
          </div>
          <a
            className="shrink-0 text-sm font-semibold text-primary"
            href="#fortune-list"
          >
            전체
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3" id="fortune-list">
          {fortuneMenus.map((menu) => {
            const Icon = menu.icon;

            return (
              <article
                className="min-h-[154px] rounded-2xl border border-border bg-surface p-4"
                key={menu.title}
              >
                <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {menu.title}
                </h3>
                <p className="mt-1 min-h-10 text-sm leading-5 text-muted">
                  {menu.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {menu.price}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-7 px-5" id="birth-start">
        <div className="rounded-[24px] bg-foreground p-5 text-background">
          <p className="text-sm font-medium text-background/70">입력 흐름</p>
          <h2 className="mt-2 text-xl font-semibold leading-snug">
            태어난 날과 시간을 알면 더 섬세하게 볼 수 있어요
          </h2>
          <div className="mt-5 space-y-3">
            {["생년월일", "출생 시간", "관심 주제"].map((step, index) => (
              <div className="flex items-center gap-3" key={step}>
                <span className="grid size-7 place-items-center rounded-full bg-background/12 text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[var(--app-max-width)] border-t border-border bg-surface/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 backdrop-blur"
        aria-label="주요 메뉴"
      >
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-semibold ${
                  item.isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted"
                }`}
                href="#"
                key={item.label}
                aria-current={item.isActive ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span className="mt-1">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
