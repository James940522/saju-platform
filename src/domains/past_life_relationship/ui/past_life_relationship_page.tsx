import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  Heart,
  MoonStar,
  Plus,
  Scale,
  Sparkles,
  Sprout,
  SunMedium,
} from "lucide-react";
import Link from "next/link";
import { SaveResultButton } from "@/features/result_save";

const relationshipFlow = [
  {
    step: "1",
    title: "전생의 시작",
    description: "한 사람이 다른 한 사람을 이끌던 관계예요.",
  },
  {
    step: "2",
    title: "이번 생의 만남",
    description: "익숙함과 끌림을 동시에 느끼기 쉬워요.",
  },
  {
    step: "3",
    title: "배워야 할 과제",
    description: "의존보다 균형, 침묵보다 솔직함이 중요해요.",
  },
];

const keyInterpretations = [
  {
    title: "끌리는 이유",
    summary: "익숙한 기운이 강해 처음부터 마음이 열리기 쉬워요.",
    detail:
      "서로의 말투나 반응에서 설명하기 어려운 편안함을 느끼는 관계예요. 빠르게 가까워질 수 있지만, 익숙함만으로 상대를 다 안다고 단정하지 않는 것이 좋아요.",
    icon: Heart,
  },
  {
    title: "부딪히는 지점",
    summary: "한쪽이 가르치려 들면 관계의 균형이 흔들릴 수 있어요.",
    detail:
      "도움을 주고받는 흐름이 강한 만큼 한 사람이 계속 이끌려고 할 수 있어요. 해결책을 말하기 전에 서로의 감정을 확인하는 시간이 필요해요.",
    icon: Scale,
  },
  {
    title: "좋아지는 방향",
    summary: "감정을 숨기지 않고 역할을 나누면 더 편안해져요.",
    detail:
      "누가 더 많이 주고받는지를 따지기보다 각자 잘하는 역할을 인정해보세요. 솔직한 대화가 쌓일수록 오래 이어질 가능성이 커져요.",
    icon: Sprout,
  },
];

function CharacterCircle({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid size-[76px] place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-[11px] text-[#8f7137] min-[390px]:size-[94px]">
        캐릭터
      </div>
      <span className="font-display text-sm font-bold text-[#f2d486]">
        {label}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-display text-[21px] font-bold leading-none text-foreground">
      {children}
    </h2>
  );
}

export function PastLifeRelationshipPage() {
  return (
    <main className="min-h-dvh px-4 pb-[calc(22px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <Link
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          href="/readings"
          aria-label="사주 입력으로 돌아가기"
        >
          <ArrowLeft size={22} strokeWidth={1.7} />
        </Link>
        <div className="min-w-0 flex-1 px-3">
          <h1 className="font-display text-[24px] font-bold leading-none text-foreground">
            전생 관계도
          </h1>
          <p className="mt-1.5 text-[11px] text-muted">
            두 사람의 인연이 어디서 이어졌는지 살펴봐요
          </p>
        </div>
        <button
          className="grid size-11 place-items-center rounded-full border border-paper-border bg-surface text-muted"
          type="button"
          aria-label="전생 관계 풀이 도움말"
        >
          <CircleHelp size={21} strokeWidth={1.7} />
        </button>
      </header>

      <section className="mt-5 overflow-hidden rounded-[22px] bg-hero px-4 py-6 text-primary-foreground shadow-soft">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-[#e7bd5f]">
          <Sparkles size={14} />
          전생 인연 요약
          <Sparkles size={14} />
        </p>

        <div className="mt-5 grid grid-cols-[76px_minmax(0,1fr)_76px] items-center gap-2 min-[390px]:grid-cols-[94px_minmax(0,1fr)_94px]">
          <CharacterCircle label="나" />
          <div className="min-w-0 text-center">
            <h2 className="font-display text-[20px] font-bold leading-[1.55] min-[390px]:text-[23px]">
              스쳐간 사이가 아니라
              <br />
              다시 이어진 인연
            </h2>
            <p className="mt-3 text-[10px] leading-5 text-[#dce4ef] min-[390px]:text-[11px]">
              두 사람의 사주에는
              <br />
              배움과 성장을 주고받는
              <br />
              인연의 흐름이 보여요.
            </p>
          </div>
          <CharacterCircle label="상대" />
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[#c99d47] px-2 py-2.5 text-center">
            <dt className="text-[10px] text-[#e7bd5f]">전생 역할</dt>
            <dd className="mt-1 font-display text-sm font-bold">스승·제자</dd>
          </div>
          <div className="rounded-xl border border-[#c99d47] px-2 py-2.5 text-center">
            <dt className="text-[10px] text-[#e7bd5f]">현생 과제</dt>
            <dd className="mt-1 font-display text-sm font-bold">감정 표현</dd>
          </div>
          <div className="rounded-xl border border-[#c99d47] px-2 py-2.5 text-center">
            <dt className="text-[10px] text-[#e7bd5f]">인연 강도</dt>
            <dd className="mt-1 font-display text-sm font-bold">높음</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <SectionTitle>관계의 흐름</SectionTitle>
        <ol className="mt-3 grid grid-cols-3 rounded-2xl border border-border bg-surface px-2 py-4">
          {relationshipFlow.map((item, index) => (
            <li className="relative min-w-0 px-1 text-center" key={item.step}>
              {index > 0 ? (
                <span
                  className="absolute right-1/2 top-[16px] h-px w-full border-t border-dashed border-accent/70"
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative z-[1] mx-auto grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-[#f2cf75]">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-[13px] font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[10px] leading-[1.55] text-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <SectionTitle>두 사람의 관계도</SectionTitle>
        <div
          className="relative mt-3 overflow-hidden rounded-2xl border border-border bg-surface px-4 py-5"
          aria-label="나와 상대 사이의 보호, 배움, 끌림, 성장 관계"
        >
          <div className="absolute left-[24%] right-[24%] top-1/2 h-px bg-accent/60" />
          <div className="relative z-[1] flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                나의 성향
              </span>
              <div className="grid size-[72px] place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-[10px] text-[#8f7137]">
                캐릭터
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {["보호", "배움", "끌림", "성장"].map((label) => (
                <span
                  className="min-w-16 rounded-full border border-paper-border bg-background px-3 py-1 text-center font-display text-[11px] font-bold text-foreground"
                  key={label}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground">
                상대의 성향
              </span>
              <div className="grid size-[72px] place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-[10px] text-[#8f7137]">
                캐릭터
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6" id="key-interpretations">
        <SectionTitle>핵심 해석</SectionTitle>
        <div className="mt-3 space-y-2">
          {keyInterpretations.map((item) => {
            const Icon = item.icon;

            return (
              <details
                className="group rounded-2xl border border-border bg-surface px-3.5 py-3"
                key={item.title}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-[#e9c66f]">
                    <Icon size={19} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[15px] font-bold text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-muted">
                      {item.summary}
                    </span>
                  </span>
                  <ChevronRight
                    className="shrink-0 text-muted transition-transform group-open:rotate-90"
                    size={19}
                  />
                </summary>
                <p className="ml-[52px] mt-3 border-t border-border pt-3 text-[11px] leading-5 text-muted">
                  {item.detail}
                </p>
              </details>
            );
          })}
        </div>
      </section>

      <aside className="mt-3 flex items-start gap-3 rounded-2xl border border-accent/70 bg-accent-soft/30 px-4 py-4">
        <SunMedium className="mt-0.5 shrink-0 text-[#b18129]" size={28} strokeWidth={1.5} />
        <div>
          <h2 className="font-display text-[16px] font-bold text-foreground">
            00사주의 한 줄 조언
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            이 인연은 답을 주는 관계가 아니라, 서로를 비추며 성장하게 하는
            관계예요.
          </p>
        </div>
      </aside>

      <section className="mt-3 grid min-h-[184px] grid-cols-[minmax(0,1fr)_82px] items-center gap-3 rounded-[22px] bg-hero p-5 text-primary-foreground">
        <div>
          <p className="flex items-center gap-2 font-display text-[20px] font-bold text-[#efc86d]">
            <MoonStar size={20} />
            프리미엄 상세 관계 풀이
          </p>
          <p className="mt-3 text-[11px] leading-5 text-[#dce4ef]">
            만난 시기, 갈등의 원인, 다시 이어질 흐름까지 더 깊게 확인해보세요.
          </p>
          <button
            className="mt-4 h-10 rounded-full border border-accent bg-[#e1b957] px-5 text-xs font-bold text-[#283549]"
            type="button"
          >
            상세 풀이 이어보기
          </button>
        </div>
        <div className="grid size-[82px] place-items-center rounded-full border border-accent bg-[#fffaf0] font-display text-[11px] text-[#8f7137]">
          캐릭터
        </div>
      </section>

      <div className="mt-3 flex gap-2">
        <Link
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface px-3 text-sm font-semibold text-foreground"
          href="/readings"
        >
          <Plus size={18} />
          다른 사람 추가
        </Link>
        <SaveResultButton />
      </div>
    </main>
  );
}
