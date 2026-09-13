"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getAuthenticatedUserId, subscribeToAuth } from "@/entities/auth";
import {
  createSajuProfile,
  getSajuProfiles,
  sajuProfileKeys,
  type CreateSajuProfileRequestDto,
  type SajuProfileSummaryDto,
} from "@/entities/saju_chart";
import type { SajuProfileDraft } from "@/entities/saju_profile";
import {
  createWealthRanking,
  MAX_WEALTH_PARTICIPANTS,
  MIN_WEALTH_PARTICIPANTS,
  type WealthRankingResult,
} from "@/entities/wealth_ranking";
import { isApiClientError } from "@/shared/api";

type Participant = {
  profileId: string;
  chartId: string;
  displayName: string;
  birthLabel: string;
};

function toParticipant(
  profile: SajuProfileSummaryDto,
  chartId: string,
): Participant {
  const { year, month, day } = profile.birth.date;
  const calendar =
    profile.birth.calendarType === "solar"
      ? "양력"
      : profile.birth.isLeapMonth
        ? "음력·윤달"
        : "음력";
  return {
    profileId: profile.id,
    chartId,
    displayName: profile.displayName,
    birthLabel: `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} · ${calendar}`,
  };
}

function readingErrorMessage(error: unknown): string {
  if (!isApiClientError(error))
    return "풀이를 만들지 못했어요. 잠시 후 다시 시도해주세요.";
  if (error.code === 401)
    return "로그인이 만료되었어요. 다시 로그인한 뒤 이용해주세요.";
  if (error.code === 404)
    return "참여자 정보가 변경되거나 삭제되었어요. 저장된 사주에서 다시 선택해주세요.";
  if (error.code === 429) return "요청이 많아요. 1분 뒤 다시 시도해주세요.";
  if (error.code === 502)
    return "풀이 결과를 완성하지 못했어요. 잠시 후 다시 시도해주세요.";
  if (error.code === 503)
    return "지금은 풀이를 생성하기 어려워요. 잠시 후 다시 시도해주세요.";
  if (error.code === 504 || error.data?.reason === "REQUEST_TIMEOUT")
    return "풀이 생성 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요.";
  return error.message;
}

export function useWealthRanking(userId: string) {
  const queryClient = useQueryClient();
  const profilesQuery = useQuery({
    queryKey: [...sajuProfileKeys.list(), userId],
    queryFn: ({ signal }) => getSajuProfiles(signal),
    staleTime: 60_000,
    retry: false,
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [result, setResult] = useState<WealthRankingResult | null>(null);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [formSequence, setFormSequence] = useState(0);
  const [pending, setPending] = useState<"saving" | "generating" | null>(null);
  const [saveError, setSaveError] = useState<string>();
  const [readingError, setReadingError] = useState<string>();
  const controllerRef = useRef<AbortController | null>(null);
  const submissionRef = useRef<{ signature: string; key: string } | null>(null);

  // Abort browser work on navigation/logout. The backend may still finish a
  // request already accepted; don't send another automatically or retain its result.
  useEffect(() => {
    const unsubscribe = subscribeToAuth(() => {
      if (getAuthenticatedUserId() !== userId) controllerRef.current?.abort();
    });
    return () => {
      unsubscribe();
      controllerRef.current?.abort();
    };
  }, [userId]);

  const isCurrentSession = () => getAuthenticatedUserId() === userId;
  const hasMinimumParticipants = participants.length >= MIN_WEALTH_PARTICIPANTS;
  const hasReachedMaximum = participants.length >= MAX_WEALTH_PARTICIPANTS;
  const availableProfiles = (profilesQuery.data?.profiles ?? []).filter(
    (profile) =>
      profile.currentChartId &&
      !participants.some((participant) => participant.profileId === profile.id),
  );

  function selectSavedProfile(profileId: string) {
    if (controllerRef.current || hasReachedMaximum || !isCurrentSession())
      return;
    const profile = availableProfiles.find(
      (profile) => profile.id === profileId,
    );
    if (!profile?.currentChartId) return;
    const chartId = profile.currentChartId;
    setParticipants((current) =>
      current.length >= MAX_WEALTH_PARTICIPANTS ||
      current.some((participant) => participant.profileId === profile.id)
        ? current
        : [...current, toParticipant(profile, chartId)],
    );
    setIsAddingParticipant(false);
    setReadingError(undefined);
    setResult(null);
  }

  async function addParticipant(draft: SajuProfileDraft) {
    if (controllerRef.current || hasReachedMaximum || !isCurrentSession())
      return;
    const request: CreateSajuProfileRequestDto = {
      displayName: draft.displayName,
      relationType: draft.relationType,
      birth: {
        calendarType: draft.calendarType,
        isLeapMonth: draft.isLeapMonth,
        date: draft.birthDate,
        time:
          draft.birthTime.type === "known"
            ? {
                precision: "exact",
                hour: draft.birthTime.hour,
                minute: draft.birthTime.minute,
              }
            : { precision: "unknown" },
        luckCycleGender: draft.gender,
      },
    };
    const signature = JSON.stringify(request);
    if (submissionRef.current?.signature !== signature)
      submissionRef.current = { signature, key: crypto.randomUUID() };
    const controller = new AbortController();
    controllerRef.current = controller;
    setPending("saving");
    setSaveError(undefined);
    try {
      const data = await createSajuProfile(
        request,
        submissionRef.current.key,
        controller.signal,
      );
      if (controller.signal.aborted || !isCurrentSession()) return;
      // A saved profile may have been selected after a timed-out save was
      // confirmed by a later list refresh. An idempotent replay must not add it twice.
      setParticipants((current) =>
        current.length >= MAX_WEALTH_PARTICIPANTS ||
        current.some((participant) => participant.profileId === data.profile.id)
          ? current
          : [...current, toParticipant(data.profile, data.chart.id)],
      );
      submissionRef.current = null;
      setFormSequence((value) => value + 1);
      setIsAddingParticipant(false);
      setReadingError(undefined);
      setResult(null);
      queryClient.setQueryData(sajuProfileKeys.detail(data.profile.id), data);
      void queryClient.invalidateQueries({ queryKey: sajuProfileKeys.all });
    } catch (error) {
      if (!controller.signal.aborted && isCurrentSession())
        setSaveError(
          isApiClientError(error)
            ? error.message
            : "사주 정보를 저장하지 못했어요. 다시 시도해주세요.",
        );
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      if (!controller.signal.aborted && isCurrentSession()) setPending(null);
    }
  }

  function removeParticipant(profileId: string) {
    if (controllerRef.current) return;
    // Removing someone from this comparison does not delete their stored profile.
    setParticipants((current) =>
      current.filter((participant) => participant.profileId !== profileId),
    );
    setResult(null);
    setReadingError(undefined);
  }

  async function generate() {
    if (controllerRef.current || !hasMinimumParticipants || !isCurrentSession())
      return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setPending("generating");
    setReadingError(undefined);
    setResult(null);
    try {
      const result = await createWealthRanking(
        participants.map(({ chartId }) => chartId),
        controller.signal,
      );
      if (controller.signal.aborted || !isCurrentSession()) return;
      setResult(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (!controller.signal.aborted && isCurrentSession()) {
        setReadingError(readingErrorMessage(error));
        if (isApiClientError(error) && error.code === 404)
          void profilesQuery.refetch();
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
      if (!controller.signal.aborted && isCurrentSession()) setPending(null);
    }
  }

  function restart() {
    if (controllerRef.current) return;
    setParticipants([]);
    setResult(null);
    setIsAddingParticipant(false);
    setReadingError(undefined);
    setSaveError(undefined);
    submissionRef.current = null;
    setFormSequence((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return {
    participants,
    availableProfiles,
    profilesQuery,
    result,
    setResult,
    isAddingParticipant,
    setIsAddingParticipant,
    formSequence,
    isSaving: pending === "saving",
    isGenerating: pending === "generating",
    isBusy: pending !== null,
    saveError,
    clearSaveError: () => setSaveError(undefined),
    readingError,
    hasMinimumParticipants,
    hasReachedMaximum,
    selectSavedProfile,
    addParticipant,
    removeParticipant,
    generate,
    restart,
  };
}
