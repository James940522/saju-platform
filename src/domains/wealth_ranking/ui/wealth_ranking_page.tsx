"use client";

import {
  ArrowLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  MAX_WEALTH_PARTICIPANTS,
  MIN_WEALTH_PARTICIPANTS,
} from "@/entities/wealth_ranking";
import { AuthGate } from "@/features/auth";
import { SajuProfileForm } from "@/features/saju_input";
import { routes } from "@/shared/config";
import { useWealthRanking } from "../model/use_wealth_ranking";
import { ReadingStartGate } from "@/widgets/reading_jobs";

function WealthRankingContent({ userId }: { userId: string }) {
  const flow = useWealthRanking(userId);

  return (
    <>
      <section className="mt-6 rounded-[24px] bg-hero px-5 py-6 text-primary-foreground shadow-soft">
        <p className="flex items-center gap-2 text-xs font-semibold text-hero-accent">
          <UsersRound size={16} />
          무료 · 최소 {MIN_WEALTH_PARTICIPANTS}명 · 최대{" "}
          {MAX_WEALTH_PARTICIPANTS}명
        </p>
        <h2 className="mt-3 font-display text-[23px] font-bold leading-[1.45]">
          함께 볼 사람의 사주를
          <br />한 명씩 추가해주세요
        </h2>
        <p className="mt-2 text-xs leading-5 text-hero-foreground">
          저장된 사주를 고르거나 새로운 사람을 입력할 수 있어요.
        </p>
      </section>
      <section className="mt-5" aria-labelledby="participant-count-title">
        <div className="flex items-center justify-between gap-3">
          <h2
            className="font-display text-[19px] font-bold text-foreground"
            id="participant-count-title"
          >
            참여자 {flow.participants.length}명
          </h2>
          <span className="rounded-full bg-brand-gold-soft/60 px-3 py-1.5 text-[10px] font-semibold text-brand-gold-foreground">
            {flow.hasMinimumParticipants
              ? "결과 확인 가능"
              : `${MIN_WEALTH_PARTICIPANTS - flow.participants.length}명 더 필요`}
          </span>
        </div>
        {flow.participants.length > 0 ? (
          <ol aria-live="polite" className="mt-3 space-y-2">
            {flow.participants.map((participant, index) => (
              <li
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5"
                key={participant.profileId}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-brand-gold-on-dark">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {participant.displayName}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {participant.birthLabel}
                  </p>
                </div>
                <button
                  aria-label={`${participant.displayName} 비교에서 제외`}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-paper hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-40"
                  disabled={flow.isBusy}
                  onClick={() => flow.removeParticipant(participant.profileId)}
                  type="button"
                >
                  <Trash2 size={17} strokeWidth={1.7} />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-brand-gold/70 bg-brand-gold-soft/15 px-4 py-5 text-center text-xs text-muted-foreground">
            아래에서 첫 번째 참여자를 추가해주세요.
          </p>
        )}
      </section>
      {!flow.hasReachedMaximum && (
        <section className="mt-5 rounded-2xl border border-border bg-surface px-4 py-4">
          <h2 className="text-sm font-bold text-foreground">
            저장된 사주에서 선택
          </h2>
          {flow.profilesQuery.isPending ? (
            <p className="mt-3 text-xs text-muted-foreground" role="status">
              저장된 사주를 불러오고 있어요.
            </p>
          ) : flow.profilesQuery.isError ? (
            <div className="mt-3 text-xs text-muted-foreground" role="alert">
              저장된 사주를 불러오지 못했어요.
              <button
                className="ml-2 min-h-11 font-semibold underline disabled:opacity-40"
                disabled={flow.isBusy || flow.profilesQuery.isFetching}
                onClick={() => void flow.profilesQuery.refetch()}
                type="button"
              >
                다시 불러오기
              </button>
            </div>
          ) : flow.availableProfiles.length > 0 ? (
            <>
              <label className="sr-only" htmlFor="saved-wealth-participant">
                추가할 사주 선택
              </label>
              <select
                className="mt-3 h-12 w-full min-w-0 rounded-xl border border-paper-border bg-paper px-3 text-sm text-foreground disabled:opacity-40"
                disabled={flow.isBusy}
                id="saved-wealth-participant"
                onChange={(event) =>
                  flow.selectSavedProfile(event.target.value)
                }
                value=""
              >
                <option value="" disabled>
                  추가할 사람을 선택해주세요
                </option>
                {flow.availableProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.displayName} · {profile.birth.date.year}.
                    {profile.birth.date.month}.{profile.birth.date.day}
                    {profile.birth.calendarType === "solar"
                      ? " (양력)"
                      : profile.birth.isLeapMonth
                        ? " (음력 윤달)"
                        : " (음력)"}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              추가할 수 있는 저장된 사주가 없어요. 새로운 참여자를 입력해주세요.
            </p>
          )}
          {!flow.isAddingParticipant && (
            <button
              aria-controls="wealth-ranking-participant-form"
              aria-expanded={flow.isAddingParticipant}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-paper-border text-sm font-semibold text-foreground disabled:opacity-40"
              disabled={flow.isBusy}
              onClick={() => flow.setIsAddingParticipant(true)}
              type="button"
            >
              <Plus size={18} />새 참여자 입력하기
            </button>
          )}
        </section>
      )}
      {flow.isAddingParticipant && !flow.hasReachedMaximum && (
        <section
          className="mt-6 border-t border-border pt-5"
          id="wealth-ranking-participant-form"
          key={flow.formSequence}
        >
          <h2 className="font-display text-[20px] font-bold text-foreground">
            새로운 참여자의 사주 정보
          </h2>
          <fieldset disabled={flow.isSaving}>
            <SajuProfileForm
              fixedRelationType="other"
              isSubmitting={flow.isSaving}
              noticeDescription="추가하면 내 계정의 사주 목록에 저장돼요. 비교에서 제외해도 저장된 사주는 유지돼요."
              noticeTitle="다음에도 선택할 수 있어요"
              onChange={flow.clearSaveError}
              onSubmit={(draft) => void flow.addParticipant(draft)}
              showRelationField={false}
              submitLabel="저장하고 참여자 추가"
            />
          </fieldset>
          {flow.saveError && (
            <p className="mt-3 text-xs leading-5 text-destructive" role="alert">
              {flow.saveError}
            </p>
          )}
          <button
            className="mt-3 h-11 w-full rounded-xl text-xs font-semibold text-muted-foreground disabled:opacity-40"
            disabled={flow.isBusy}
            onClick={() => flow.setIsAddingParticipant(false)}
            type="button"
          >
            입력 닫기
          </button>
        </section>
      )}
      {!flow.isAddingParticipant && (
        <section className="mt-5" aria-busy={flow.isGenerating}>
          <button
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-brand-gold bg-primary font-display text-[18px] font-bold text-brand-gold-on-dark disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!flow.hasMinimumParticipants || flow.isBusy}
            onClick={() => void flow.generate()}
            type="button"
          >
            {flow.isGenerating ? (
              <>
                <LoaderCircle
                  className="animate-spin motion-reduce:animate-none"
                  size={19}
                />
                풀이 요청을 접수하고 있어요
              </>
            ) : (
              <>
                {flow.readingError ? "풀이 다시 시도하기" : "재물운 순위 보기"}
                <ChevronRight size={19} />
              </>
            )}
          </button>
          {flow.isGenerating && (
            <p
              className="mt-3 text-center text-xs leading-5 text-muted-foreground"
              role="status"
            >
              요청을 저장하고 있어요. 접수 후에는 다른 화면으로 이동해도
              괜찮아요.
            </p>
          )}
          {flow.readingError && (
            <p className="mt-3 text-xs leading-5 text-destructive" role="alert">
              {flow.readingError}
            </p>
          )}
          <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
            접수한 풀이는 내 풀이에서 다시 확인할 수 있어요.
            <br />
            화면을 닫아도 풀이가 계속 진행돼요.
          </p>
        </section>
      )}
    </>
  );
}

export function WealthRankingPage() {
  const userId = useSyncExternalStore(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  return (
    <AuthGate loginHref={routes.login({ intent: "wealth-ranking" })}>
      {typeof userId === "string" ? (
        <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
          <header className="flex items-center gap-3">
            <Link
              aria-label="재물운 랭킹 소개로 돌아가기"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
              href={routes.reading("wealth-ranking")}
            >
              <ArrowLeft size={22} strokeWidth={1.7} />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-brand-gold-muted">
                무료 사주 풀이
              </p>
              <h1 className="mt-1 font-display text-[24px] font-bold leading-none text-foreground">
                재물운 랭킹
              </h1>
            </div>
          </header>
          <ReadingStartGate>
            <WealthRankingContent key={userId} userId={userId} />
          </ReadingStartGate>
        </main>
      ) : null}
    </AuthGate>
  );
}
