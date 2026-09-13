"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  const submissionRef = useRef<{ signature: string; key: string } | null>(null);
  const isSubmissionInFlight = useRef(false);
  const createProfileMutation = useMutation({
    mutationFn: ({
      request,
      key,
    }: {
      request: CreateSajuProfileRequestDto;
      key: string;
    }) => createSajuProfile(request, key),
    async onSuccess(data) {
      queryClient.setQueryData(sajuProfileKeys.detail(data.profile.id), data);
      await queryClient.invalidateQueries({ queryKey: sajuProfileKeys.all });
      clearDemoReadingPurchases();
      router.replace(completionHref);
    },
    onError(error) {
      isSubmissionInFlight.current = false;
      setRequestError(
        isApiClientError(error)
          ? error.message
          : "사주 정보를 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  function handleSubmit(profile: SajuProfileDraft) {
    if (isSubmissionInFlight.current) {
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
    const signature = JSON.stringify(request);
    if (submissionRef.current?.signature !== signature) {
      submissionRef.current = { signature, key: crypto.randomUUID() };
    }
    isSubmissionInFlight.current = true;
    createProfileMutation.mutate({ request, key: submissionRef.current.key });
  }

  return (
    <>
      <SajuProfileForm
        isSubmitting={createProfileMutation.isPending}
        fixedRelationType={fixedRelationType}
        onChange={() => setRequestError(undefined)}
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
