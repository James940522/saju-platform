"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  deleteSajuProfile,
  sajuProfileKeys,
  type SajuProfileSummaryDto,
} from "@/entities/saju_chart";
import { isApiClientError } from "@/shared/api";
import { routes } from "@/shared/config";

type DeleteSajuProfileButtonProps = {
  profile: SajuProfileSummaryDto;
};

export function DeleteSajuProfileButton({
  profile,
}: DeleteSajuProfileButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const deleteProfileMutation = useMutation({
    mutationFn: () => deleteSajuProfile(profile.id),
    onSuccess() {
      queryClient.removeQueries({ queryKey: sajuProfileKeys.all });
      router.replace(routes.sajuProfiles);
    },
    onError(error) {
      setRequestError(
        isApiClientError(error)
          ? error.message
          : "사주 프로필을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  useEffect(() => {
    if (!isDialogOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleteProfileMutation.isPending) {
        setIsDialogOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteProfileMutation.isPending, isDialogOpen]);

  function openDialog() {
    setRequestError(undefined);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    if (!deleteProfileMutation.isPending) {
      setIsDialogOpen(false);
    }
  }

  return (
    <>
      <button
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-destructive/35 bg-surface text-sm font-bold text-destructive"
        onClick={openDialog}
        type="button"
      >
        <Trash2 size={17} />
        이 프로필 삭제하기
      </button>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-5 py-8">
          <section
            aria-describedby="delete-saju-profile-description"
            aria-labelledby="delete-saju-profile-title"
            aria-modal="true"
            className="w-full max-w-[390px] rounded-[24px] bg-surface p-5 shadow-2xl"
            role="alertdialog"
          >
            <span className="grid size-12 place-items-center rounded-full bg-destructive-soft text-destructive">
              <TriangleAlert size={23} strokeWidth={1.8} />
            </span>
            <h2
              className="mt-4 font-display text-xl font-bold text-foreground"
              id="delete-saju-profile-title"
            >
              정말 이 프로필을 삭제할까요?
            </h2>
            <p
              className="mt-3 text-sm leading-6 text-muted-foreground"
              id="delete-saju-profile-description"
            >
              <strong className="text-foreground">{profile.displayName}</strong>
              님의 출생 정보와 만세력, 이 프로필로 생성한 모든 사주 풀이
              결과가 영구 삭제됩니다. 삭제된 내용은 복구할 수 없습니다.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              결제 내역은 보존되며, 프로필 삭제는 환불을 의미하지 않습니다.
            </p>

            {requestError ? (
              <p
                className="mt-3 rounded-xl bg-destructive-soft px-3 py-2.5 text-xs font-semibold leading-5 text-destructive"
                role="alert"
              >
                {requestError}
              </p>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="h-12 rounded-xl bg-paper text-sm font-bold text-foreground disabled:opacity-60"
                disabled={deleteProfileMutation.isPending}
                onClick={closeDialog}
                ref={cancelButtonRef}
                type="button"
              >
                취소
              </button>
              <button
                className="h-12 rounded-xl bg-destructive text-sm font-bold text-destructive-foreground disabled:opacity-60"
                disabled={deleteProfileMutation.isPending}
                onClick={() => deleteProfileMutation.mutate()}
                type="button"
              >
                {deleteProfileMutation.isPending
                  ? "삭제하고 있어요"
                  : "프로필 삭제"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
