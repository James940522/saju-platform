"use client";

import {
  ArrowLeft,
  Banknote,
  ChevronRight,
  Crown,
  Medal,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { SajuProfileDraft } from "@/entities/saju_profile";
import { SajuProfileForm } from "@/features/saju_input";
import { routes } from "@/shared/config";

const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 5;

const demoRankingDescriptions = [
  "기회를 발견하면 빠르게 움직이는 재물 감각이 돋보여요.",
  "차근차근 쌓고 지키는 안정적인 재물 흐름을 가졌어요.",
  "사람과 정보가 모일 때 재물 기회도 함께 커지는 편이에요.",
  "새로운 시도를 통해 자신만의 수입 흐름을 만드는 힘이 있어요.",
  "꾸준한 관리가 더해질수록 재물운이 단단해지는 유형이에요.",
] as const;

const demoRankingInterpretations = [
  {
    title: "기회를 키우는 실행형",
    earningStyle: "좋은 기회를 발견하면 빠르게 판단하고 행동으로 옮겨요.",
    strength: "새로운 수입원이나 성장 가능성을 먼저 알아보는 감각이 좋아요.",
    caution: "속도만 앞서지 않도록 큰 결정 전에는 숫자를 한 번 더 확인해요.",
  },
  {
    title: "차곡차곡 쌓는 안정형",
    earningStyle: "익숙한 분야에서 꾸준히 성과를 쌓아 재물을 만드는 편이에요.",
    strength: "계획적인 소비와 저축처럼 가진 것을 지키는 힘이 돋보여요.",
    caution: "지나치게 안전한 선택만 고집하면 좋은 기회를 놓칠 수 있어요.",
  },
  {
    title: "사람과 기회를 잇는 관계형",
    earningStyle: "사람과 정보가 모이는 자리에서 새로운 기회를 발견해요.",
    strength: "협업과 소통을 통해 혼자서는 만들기 어려운 흐름을 키워요.",
    caution: "가까운 사이일수록 금전 기준과 약속을 분명히 정하는 게 좋아요.",
  },
  {
    title: "새 길을 만드는 개척형",
    earningStyle: "남들과 다른 아이디어를 현실적인 수입으로 연결하려 해요.",
    strength: "변화에 유연하고 새로운 분야를 배우는 속도가 빠른 편이에요.",
    caution: "여러 가능성을 좇기보다 한 가지를 충분히 키우는 시간이 필요해요.",
  },
  {
    title: "시간을 내 편으로 만드는 성장형",
    earningStyle: "단기 성과보다 오래 이어질 기반을 만들며 성장해요.",
    strength: "경험이 쌓일수록 판단이 안정되고 재물 관리 능력도 단단해져요.",
    caution: "준비가 완벽해질 때까지 기다리지 말고 작은 실행부터 시작해요.",
  },
] as const;

function formatBirthDate(profile: SajuProfileDraft) {
  const { year, month, day } = profile.birthDate;

  return `${year}.${month.toString().padStart(2, "0")}.${day
    .toString()
    .padStart(2, "0")} · ${profile.calendarType === "solar" ? "양력" : "음력"}`;
}

function ParticipantCard({
  index,
  onRemove,
  participant,
}: {
  index: number;
  onRemove: () => void;
  participant: SajuProfileDraft;
}) {
  return (
    <li className="animate-in fade-in slide-in-from-bottom-2 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 duration-300 motion-reduce:animate-none">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-brand-gold-on-dark">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">
          {participant.displayName}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {formatBirthDate(participant)}
        </p>
      </div>
      <button
        aria-label={`${participant.displayName} 참여자 삭제`}
        className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-paper hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        onClick={onRemove}
        type="button"
      >
        <Trash2 size={17} strokeWidth={1.7} />
      </button>
    </li>
  );
}

function RankingResult({
  onEdit,
  onRestart,
  participants,
}: {
  onEdit: () => void;
  onRestart: () => void;
  participants: readonly SajuProfileDraft[];
}) {
  const winner = participants[0];

  if (!winner) {
    return null;
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-500 motion-reduce:animate-none">
      <section className="mt-6 overflow-hidden rounded-[24px] bg-hero px-5 py-7 text-primary-foreground shadow-soft">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-hero-accent">
          <Sparkles size={15} />
          UI 미리보기 결과
          <Sparkles size={15} />
        </p>
        <div className="mt-5 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-brand-gold bg-[#223f68] text-[#f0cc72]">
            <Crown size={31} strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-xs text-hero-foreground">재물운 랭킹 1위</p>
          <h2 className="mt-2 font-display text-[28px] font-bold text-[#f2d17b]">
            {winner.displayName}
          </h2>
          <p className="mx-auto mt-3 max-w-[280px] text-[12px] leading-6 text-hero-foreground">
            {demoRankingDescriptions[0]}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-brand-gold-muted">
              전체 순위
            </p>
            <h2 className="mt-1 font-display text-[21px] font-bold text-foreground">
              우리들의 재물 흐름
            </h2>
          </div>
          <span className="rounded-full bg-brand-gold-soft/55 px-3 py-1.5 text-[10px] font-semibold text-brand-gold-foreground">
            {participants.length}명 참여
          </span>
        </div>

        <ol className="mt-3 space-y-2.5">
          {participants.map((participant, index) => (
            <li
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                index === 0
                  ? "border-brand-gold bg-brand-gold-soft/25"
                  : "border-border bg-surface"
              }`}
              key={`${participant.displayName}-${index}`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full ${
                  index === 0
                    ? "bg-primary text-brand-gold-on-dark"
                    : "bg-paper text-brand-gold-foreground"
                }`}
              >
                {index === 0 ? (
                  <Trophy size={19} strokeWidth={1.7} />
                ) : (
                  <Medal size={19} strokeWidth={1.7} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-foreground">
                    {index + 1}위
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">
                    {participant.displayName}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
                  {demoRankingDescriptions[index]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-7">
        <p className="text-[11px] font-semibold text-brand-gold-muted">
          참여자별 풀이
        </p>
        <h2 className="mt-1 font-display text-[21px] font-bold text-foreground">
          각자의 재물 성향도 살펴봐요
        </h2>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          순위뿐 아니라 돈을 만들고 지키는 방식도 사람마다 달라요.
        </p>

        <div className="mt-3 space-y-2.5">
          {participants.map((participant, index) => {
            const interpretation = demoRankingInterpretations[index];

            return (
              <details
                className="group rounded-2xl border border-border bg-surface px-4 py-3.5 open:border-brand-gold/70 open:bg-brand-gold-soft/10"
                key={`${participant.displayName}-interpretation-${index}`}
                open={index === 0 ? true : undefined}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {participant.displayName}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {interpretation.title}
                    </span>
                  </span>
                  <ChevronRight
                    className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-90 motion-reduce:transition-none"
                    size={19}
                    strokeWidth={1.7}
                  />
                </summary>

                <div className="animate-in fade-in slide-in-from-top-2 mt-4 space-y-3 border-t border-border pt-4 duration-300 motion-reduce:animate-none">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-element-earth-soft text-element-earth">
                      <Banknote size={18} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        돈을 만드는 방식
                      </h3>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                        {interpretation.earningStyle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-element-wood-soft text-element-wood">
                      <TrendingUp size={18} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        재물 강점
                      </h3>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                        {interpretation.strength}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-element-fire-soft text-element-fire">
                      <ShieldCheck size={18} strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        지키면 좋은 점
                      </h3>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                        {interpretation.caution}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <aside className="mt-4 rounded-2xl border border-paper-border bg-paper px-4 py-3 text-[11px] leading-5 text-muted-foreground">
        지금은 입력한 순서대로 배치한 UI 예시예요. 실제 순위와 해석은
        백엔드 계산을 연결한 뒤 제공됩니다.
      </aside>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="flex h-13 items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface text-sm font-semibold text-foreground"
          onClick={onEdit}
          type="button"
        >
          <ArrowLeft size={17} />
          입력 수정
        </button>
        <button
          className="flex h-13 items-center justify-center gap-2 rounded-xl border border-brand-gold bg-primary text-sm font-bold text-brand-gold-on-dark"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw size={17} />
          다시 해보기
        </button>
      </div>
    </div>
  );
}

export function WealthRankingPage() {
  const [participants, setParticipants] = useState<SajuProfileDraft[]>([]);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [isShowingResult, setIsShowingResult] = useState(false);
  const [formSequence, setFormSequence] = useState(0);
  const hasMinimumParticipants = participants.length >= MIN_PARTICIPANTS;
  const hasReachedMaximum = participants.length >= MAX_PARTICIPANTS;

  function handleAddParticipant(participant: SajuProfileDraft) {
    const nextParticipants = [...participants, participant];

    setParticipants(nextParticipants);
    setFormSequence((sequence) => sequence + 1);
    setIsAddingParticipant(nextParticipants.length < MIN_PARTICIPANTS);
  }

  function handleRemoveParticipant(indexToRemove: number) {
    const nextParticipants = participants.filter(
      (_, index) => index !== indexToRemove,
    );

    setParticipants(nextParticipants);

    setIsAddingParticipant(
      nextParticipants.length > 0 &&
        nextParticipants.length < MIN_PARTICIPANTS,
    );
  }

  function handleShowResult() {
    if (!hasMinimumParticipants) {
      return;
    }

    setIsShowingResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRestart() {
    setParticipants([]);
    setIsAddingParticipant(false);
    setIsShowingResult(false);
    setFormSequence((sequence) => sequence + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        {isShowingResult ? (
          <button
            aria-label="참여자 입력으로 돌아가기"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
            onClick={() => setIsShowingResult(false)}
            type="button"
          >
            <ArrowLeft size={22} strokeWidth={1.7} />
          </button>
        ) : (
          <Link
            aria-label="재물운 랭킹 소개로 돌아가기"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
            href={routes.reading("wealth-ranking")}
          >
            <ArrowLeft size={22} strokeWidth={1.7} />
          </Link>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-brand-gold-muted">
            {isShowingResult ? "랭킹 결과" : "참여자 입력"}
          </p>
          <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
            재물운 랭킹
          </h1>
        </div>
      </header>

      {isShowingResult ? (
        <RankingResult
          onEdit={() => setIsShowingResult(false)}
          onRestart={handleRestart}
          participants={participants}
        />
      ) : (
        <>
          <section className="mt-6 rounded-[24px] bg-hero px-5 py-6 text-primary-foreground shadow-soft">
            <p className="flex items-center gap-2 text-xs font-semibold text-hero-accent">
              <UsersRound size={16} />
              최소 {MIN_PARTICIPANTS}명 · 최대 {MAX_PARTICIPANTS}명
            </p>
            <h2 className="mt-3 font-display text-[23px] font-bold leading-[1.45]">
              함께 볼 사람의 사주를
              <br />한 명씩 입력해주세요
            </h2>
            <p className="mt-2 text-xs leading-5 text-hero-foreground">
              두 명이 모이면 바로 순위를 확인할 수 있어요.
            </p>
          </section>

          <section className="mt-5" aria-labelledby="participant-count-title">
            <div className="flex items-center justify-between gap-3">
              <h2
                className="font-display text-[19px] font-bold text-foreground"
                id="participant-count-title"
              >
                참여자 {participants.length}명
              </h2>
              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                  hasMinimumParticipants
                    ? "bg-primary-soft text-primary"
                    : "bg-brand-gold-soft/60 text-brand-gold-foreground"
                }`}
              >
                {hasMinimumParticipants
                  ? "결과 확인 가능"
                  : `${MIN_PARTICIPANTS - participants.length}명 더 필요`}
              </span>
            </div>

            {participants.length > 0 ? (
              <ol
                aria-live="polite"
                className="animate-in fade-in mt-3 space-y-2 duration-300 motion-reduce:animate-none"
              >
                {participants.map((participant, index) => (
                  <ParticipantCard
                    index={index}
                    key={`${participant.displayName}-${index}`}
                    onRemove={() => handleRemoveParticipant(index)}
                    participant={participant}
                  />
                ))}
              </ol>
            ) : (
              <button
                aria-controls="wealth-ranking-participant-form"
                aria-expanded={isAddingParticipant}
                className="group mt-3 flex w-full flex-col items-center rounded-2xl border border-dashed border-brand-gold/70 bg-brand-gold-soft/15 px-5 py-6 text-center transition-colors hover:bg-brand-gold-soft/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.99] motion-reduce:transform-none"
                onClick={() => setIsAddingParticipant(true)}
                type="button"
              >
                <span className="grid size-11 place-items-center rounded-full bg-primary text-brand-gold-on-dark transition-transform duration-300 group-hover:scale-105 group-hover:rotate-90 motion-reduce:transform-none">
                  <Plus size={21} strokeWidth={1.8} />
                </span>
                <span className="mt-3 font-display text-base font-bold text-foreground">
                  참여자 추가하기
                </span>
                <span className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  첫 번째 사람의 사주 정보부터 입력해요
                </span>
              </button>
            )}
          </section>

          {isAddingParticipant && !hasReachedMaximum ? (
            <section
              className="animate-in fade-in slide-in-from-top-3 mt-6 border-t border-border pt-5 duration-500 motion-reduce:animate-none"
              id="wealth-ranking-participant-form"
              key={formSequence}
            >
              <p className="text-[11px] font-semibold text-brand-gold-muted">
                참여자 {participants.length + 1}
              </p>
              <h2 className="mt-1 font-display text-[20px] font-bold text-foreground">
                {participants.length === 0
                  ? "첫 번째 사람을 알려주세요"
                  : "다음 사람을 알려주세요"}
              </h2>
              <SajuProfileForm
                fixedRelationType="other"
                noticeDescription="지금은 화면 흐름 확인용이며 새로고침하면 입력 내용이 사라져요."
                noticeTitle="이 풀이에서만 사용해요"
                onSubmit={handleAddParticipant}
                showRelationField={false}
                submitLabel={`${participants.length + 1}번째 참여자 추가`}
              />
              {hasMinimumParticipants ? (
                <button
                  className="mt-3 h-11 w-full rounded-xl text-xs font-semibold text-muted-foreground"
                  onClick={() => setIsAddingParticipant(false)}
                  type="button"
                >
                  추가하지 않고 결과 보기
                </button>
              ) : null}
            </section>
          ) : null}

          {hasMinimumParticipants && !isAddingParticipant ? (
            <section className="mt-5">
              {!hasReachedMaximum ? (
                <button
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface text-sm font-semibold text-foreground"
                  onClick={() => setIsAddingParticipant(true)}
                  type="button"
                >
                  <Plus size={18} />
                  한 명 더 추가하기
                </button>
              ) : null}
              <button
                className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-brand-gold bg-primary font-display text-[18px] font-bold text-brand-gold-on-dark"
                onClick={handleShowResult}
                type="button"
              >
                재물운 순위 보기
                <ChevronRight size={19} />
              </button>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
