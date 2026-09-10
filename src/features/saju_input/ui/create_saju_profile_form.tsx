"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import {
  type SajuProfileDraft,
  type SajuRelationType,
} from "@/entities/saju_profile";
import {
  createSajuProfile,
  sajuProfileKeys,
  type CreateSajuProfileRequestDto,
} from "@/entities/saju_chart";
import { isApiClientError } from "@/shared/api";
import { SajuProfileForm } from "./saju_profile_form";

type CreateSajuProfileFormProps = {
  completionHref: string;
  fixedRelationType?: SajuRelationType;
  submitLabel?: string;
};

export function CreateSajuProfileForm({
  completionHref,
  fixedRelationType,
  submitLabel,
}: CreateSajuProfileFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [requestError, setRequestError] = useState<string>();
  const createProfileMutation = useMutation({
    mutationFn: createSajuProfile,
    async onSuccess(data) {
      queryClient.setQueryData(
        sajuProfileKeys.detail(data.profile.id),
        data,
      );
      await queryClient.invalidateQueries({ queryKey: sajuProfileKeys.all });
      clearDemoReadingPurchases();
      router.replace(completionHref);
    },
    onError(error) {
      setRequestError(
        isApiClientError(error)
          ? error.message
          : "사주 정보를 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  function handleSubmit(profile: SajuProfileDraft) {
    if (createProfileMutation.isPending) {
      return;
    }

    const request: CreateSajuProfileRequestDto = {
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

    setRequestError(undefined);
    createProfileMutation.mutate(request);
  }

  return (
    <>
      <SajuProfileForm
        isSubmitting={createProfileMutation.isPending}
        fixedRelationType={fixedRelationType}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
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
