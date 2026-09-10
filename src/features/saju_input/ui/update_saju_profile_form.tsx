"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  sajuProfileKeys,
  type SajuProfileSummaryDto,
  updateSajuProfile,
  type UpdateSajuProfileRequestDto,
} from "@/entities/saju_chart";
import type { SajuProfileDraft } from "@/entities/saju_profile";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";

import { SajuProfileForm } from "./saju_profile_form";

type UpdateSajuProfileFormProps = {
  profile: SajuProfileSummaryDto;
};

function toInitialProfile(profile: SajuProfileSummaryDto): SajuProfileDraft {
  return {
    displayName: profile.displayName,
    relationType: profile.relationType,
    gender: profile.birth.luckCycleGender,
    calendarType: profile.birth.calendarType,
    isLeapMonth: profile.birth.isLeapMonth,
    birthDate: profile.birth.date,
    birthTime:
      profile.birth.time.precision === "exact"
        ? {
            type: "known",
            hour: profile.birth.time.hour,
            minute: profile.birth.time.minute,
          }
        : { type: "unknown" },
  };
}

function toUpdateRequest(
  profile: SajuProfileDraft,
): UpdateSajuProfileRequestDto {
  return {
    displayName: profile.displayName,
    relationType: profile.relationType,
    birth: {
      calendarType: profile.calendarType,
      isLeapMonth: profile.isLeapMonth,
      date: profile.birthDate,
      time:
        profile.birthTime.type === "known"
          ? {
              precision: "exact",
              hour: profile.birthTime.hour,
              minute: profile.birthTime.minute,
            }
          : { precision: "unknown" },
      luckCycleGender: profile.gender,
    },
  };
}

export function UpdateSajuProfileForm({
  profile,
}: UpdateSajuProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [requestError, setRequestError] = useState<string>();
  const updateProfileMutation = useMutation({
    mutationFn: (request: UpdateSajuProfileRequestDto) =>
      updateSajuProfile(profile.id, request),
    async onSuccess(data) {
      queryClient.setQueryData(sajuProfileKeys.detail(profile.id), data);
      await queryClient.invalidateQueries({ queryKey: sajuProfileKeys.list() });
      router.replace(routes.sajuProfile(profile.id));
    },
    onError(error) {
      setRequestError(
        isApiClientError(error)
          ? error.message
          : "사주 프로필을 수정하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  function handleSubmit(draft: SajuProfileDraft) {
    if (updateProfileMutation.isPending) {
      return;
    }

    setRequestError(undefined);
    updateProfileMutation.mutate(toUpdateRequest(draft));
  }

  return (
    <>
      <SajuProfileForm
        initialProfile={toInitialProfile(profile)}
        isSubmitting={updateProfileMutation.isPending}
        onSubmit={handleSubmit}
        submitLabel="변경사항 저장하기"
      />
      {requestError ? (
        <p
          className="mt-3 text-center text-xs font-semibold text-destructive"
          role="alert"
        >
          {requestError}
        </p>
      ) : null}
    </>
  );
}
