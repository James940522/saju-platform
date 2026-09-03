"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearDemoReadingPurchases } from "@/entities/reading_purchase";
import {
  saveDemoSajuProfile,
  type SajuProfileDraft,
  type SajuProfileSlot,
} from "@/entities/saju_profile";
import { SajuProfileForm } from "./saju_profile_form";

type CreateSajuProfileFormProps = {
  completionHref: string;
  slot: SajuProfileSlot;
  submitLabel?: string;
};

export function CreateSajuProfileForm({
  completionHref,
  slot,
  submitLabel,
}: CreateSajuProfileFormProps) {
  const router = useRouter();
  const [storageError, setStorageError] = useState<string>();

  function handleSubmit(profile: SajuProfileDraft) {
    if (!clearDemoReadingPurchases()) {
      setStorageError(
        "이전 데모 결제 상태를 정리하지 못했어요. 다시 시도해주세요.",
      );
      return;
    }

    if (!saveDemoSajuProfile(slot, profile)) {
      setStorageError(
        "현재 브라우저에 데모 사주 정보를 저장하지 못했어요. 다시 시도해주세요.",
      );
      return;
    }

    setStorageError(undefined);
    router.replace(completionHref);
  }

  return (
    <>
      <SajuProfileForm onSubmit={handleSubmit} submitLabel={submitLabel} />
      {storageError ? (
        <p
          className="mt-3 text-center text-xs font-semibold text-[#a24646]"
          role="alert"
        >
          {storageError}
        </p>
      ) : null}
    </>
  );
}
