import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  Clock3,
  Coins,
  Heart,
  History,
  MessageCircleQuestion,
  RotateCcw,
  ScrollText,
  Sparkles,
  SunMedium,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ReadingCode } from "@/entities/reading";
import { DemoAuthButton } from "@/features/demo_auth";
import { routes } from "@/shared/config";

type CardTone = "rose" | "blue" | "violet";

type ContentCard = {
  code: ReadingCode;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: CardTone;
};

const relationshipCards: ContentCard[] = [
  {
    code: "love-fortune",
    title: "연애운",
    description: "지금 내 연애운은\n어떤 흐름일까?",
    icon: Heart,
    tone: "rose",
  },
  {
    code: "couple-compatibility",
    title: "두 사람 궁합",
    description: "우리의 인연은\n어떻게 이어질까?",
    icon: UsersRound,
    tone: "blue",
  },
  {
    code: "past-life-relationship",
    title: "전생 관계",
    description: "전생에 우리는\n어떤 관계였을까?",
    icon: History,
    tone: "violet",
  },
  {
    code: "reunion-fortune",
    title: "재회운",
    description: "다시 만날 수 있을까?\n재회의 가능성은?",
    icon: RotateCcw,
    tone: "violet",
  },
];

const nearFortunes: Array<{
  code: ReadingCode;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    code: "daily-fortune",
    title: "오늘 운세",
    description: "오늘의 흐름",
    icon: SunMedium,
  },
  {
    code: "monthly-fortune",
    title: "이번 달 운세",
    description: "이달의 변화",
    icon: CalendarDays,
  },
  {
    code: "three-month-fortune",
    title: "3개월 운세",
    description: "앞으로의 흐름",
    icon: Clock3,
  },
];

const otherReadings: Array<{
  code: ReadingCode;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    code: "detailed-saju",
    title: "상세 사주",
    description: "성향부터 미래의 흐름까지",
    icon: ScrollText,
  },
  {
    code: "wealth-ranking",
    title: "재물운 랭킹",
    description: "우리 중 누가 제일 부자일까?",
    icon: Coins,
  },
  {
    code: "yearly-wealth",
    title: "올해 재물운",
    description: "돈이 들어오는 시기",
    icon: ChartNoAxesCombined,
  },
  {
    code: "job-change",
    title: "이직운",
    description: "지금 옮겨도 괜찮을까?",
    icon: BriefcaseBusiness,
  },
  {
    code: "major-luck",
    title: "대운",
    description: "10년 단위 인생의 큰 흐름",
    icon: Sparkles,
  },
  {
    code: "concern-reading",
    title: "고민 풀이",
    description: "지금 마음에 걸리는 질문",
    icon: MessageCircleQuestion,
  },
];

const toneClasses: Record<CardTone, string> = {
  rose: "bg-[#f9e3e8] text-[#b84964]",
  blue: "bg-[#e6eef8] text-[#315b91]",
  violet: "bg-[#eee5f8] text-[#67428f]",
};

function CharacterSlot({ size = "small" }: { size?: "small" | "large" }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-[#8f7137] ${
        size === "large"
          ? "size-[88px] text-sm min-[390px]:size-[104px]"
          : "size-12 text-[10px] min-[390px]:size-14"
      }`}
      aria-label="캐릭터 이미지 자리"
    >
      캐릭터
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="shrink-0 font-display text-[21px] font-bold leading-none text-foreground">
        {children}
      </h2>
      <span className="h-px w-full bg-border" aria-hidden="true" />
    </div>
  );
}

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
            <p className="mt-1.5 text-[11px] text-muted">
              당신의 오늘을 함께 바라봅니다
            </p>
          </div>
        </div>
        <DemoAuthButton />
      </header>

      <section className="px-4">
        <div className="grid min-h-[252px] grid-cols-[minmax(0,1fr)_88px] items-center gap-2 overflow-hidden rounded-[22px] bg-hero px-5 py-6 text-primary-foreground shadow-soft min-[390px]:grid-cols-[minmax(0,1fr)_104px]">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#e4bd61]">
              AI 프리미엄 사주 풀이
            </p>
            <h1 className="mt-3 font-display text-[25px] font-bold leading-[1.38]">
              AI가 풀어주는
              <br />
              나의 사주 이야기
            </h1>
            <p className="mt-3 text-[13px] leading-6 text-[#dce4ef]">
              타고난 운명과 흐름을
              <br />
              쉽고 깊이 있게 풀어드려요.
            </p>
            <Link
              className="mt-5 flex h-11 w-full items-center justify-center gap-1 rounded-full bg-[#e1b957] px-3 text-[12px] font-bold text-[#2b3441]"
              href={routes.reading("detailed-saju")}
            >
              AI 사주 풀이 시작하기
              <ChevronRight size={17} strokeWidth={2} />
            </Link>
          </div>
          <CharacterSlot size="large" />
        </div>
      </section>

      <section className="mt-6 px-4">
        <SectionTitle>사랑과 인연을 위한 풀이</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
          {relationshipCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                className="grid min-h-[116px] grid-cols-[minmax(0,1fr)_48px] items-center gap-2 rounded-2xl border border-border bg-surface p-3.5 min-[390px]:grid-cols-[minmax(0,1fr)_56px]"
                href={routes.reading(card.code)}
                key={card.title}
              >
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClasses[card.tone]}`}
                  >
                    <Icon size={13} strokeWidth={2} />
                    {card.title}
                  </span>
                  <p className="mt-3 whitespace-pre-line text-[13px] font-medium leading-5 text-foreground">
                    {card.description}
                  </p>
                </div>
                <CharacterSlot />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-4">
        <SectionTitle>오늘 · 이번 달 · 앞으로</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {nearFortunes.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className="flex min-h-[92px] flex-col items-center justify-center rounded-2xl border border-border bg-surface px-2 py-3 text-center"
                href={routes.reading(item.code)}
                key={item.title}
              >
                <Icon className="text-primary" size={24} strokeWidth={1.6} />
                <h3 className="mt-2 text-[12px] font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-[10px] text-muted">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-5 px-4">
        <Link
          className="flex min-h-[78px] items-center gap-3 rounded-2xl border border-paper-border bg-surface px-4 py-3"
          href={routes.reading("daily-fortune")}
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-[#936c21]">
            <SunMedium size={25} strokeWidth={1.6} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[17px] font-bold text-foreground">
              오늘의 운세 · 무료
            </h2>
            <p className="mt-1 text-[11px] text-muted">
              매일 달라지는 오늘의 흐름을 확인해보세요
            </p>
          </div>
          <span className="inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full border border-paper-border px-3 text-[11px] font-semibold text-[#8b6826]">
            보기
            <ChevronRight size={14} />
          </span>
        </Link>
      </section>

      <section className="mt-6 px-4">
        <SectionTitle>이런 풀이도 있어요</SectionTitle>
        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2">
          {otherReadings.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                className="grid min-h-[108px] grid-cols-[minmax(0,1fr)_48px] items-center gap-2 rounded-2xl border border-border bg-surface p-3.5 min-[390px]:grid-cols-[minmax(0,1fr)_56px]"
                href={routes.reading(item.code)}
                key={item.title}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className="shrink-0 text-primary"
                      size={17}
                      strokeWidth={1.8}
                    />
                    <h3 className="text-[13px] font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[11px] leading-[1.55] text-muted">
                    {item.description}
                  </p>
                </div>
                <CharacterSlot />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-5 px-4 pb-4">
        <div className="grid min-h-[138px] grid-cols-[minmax(0,1fr)_76px] items-center gap-3 rounded-2xl border border-paper-border bg-paper p-4">
          <div>
            <h2 className="font-display text-[18px] font-bold text-foreground">
              00사주가 전하는 마음
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              어려운 말보다 궁금한 질문에 먼저 답하고,
              <br />
              더 나은 선택을 할 수 있도록 함께합니다.
            </p>
          </div>
          <div className="grid size-[76px] place-items-center rounded-full border border-accent bg-surface font-display text-[12px] text-[#8f7137]">
            캐릭터
          </div>
        </div>
      </section>
    </main>
  );
}
