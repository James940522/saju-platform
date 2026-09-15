"use client";

import { Bookmark, Check } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { getAuthenticatedUserId, getAuthServerSnapshot, subscribeToAuth } from "@/entities/auth";
import { getSavedDemoResult, setDemoResultSaved, subscribeToSavedDemoResult } from "@/entities/saved_result";
import { routes } from "@/shared/config";

export function SaveResultButton() {
  const userId = useSyncExternalStore(subscribeToAuth, getAuthenticatedUserId, getAuthServerSnapshot);
  const savedAt = useSyncExternalStore(subscribeToSavedDemoResult, () => userId ? getSavedDemoResult(userId) : null, () => null);
  const [hasError, setHasError] = useState(false);
  const isSaved = savedAt !== null;

  function handleSave() {
    if (userId) setHasError(!setDemoResultSaved(userId, !isSaved));
  }

  return (
    <div className="min-w-0 flex-1">
    <button
      className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      disabled={!userId}
      onClick={handleSave}
      type="button"
      aria-pressed={isSaved}
    >
      {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
      {isSaved ? "보관됨" : "결과 보관하기"}
    </button>
    <p className="mt-2 text-center text-[11px] leading-5 text-muted-foreground">예시 결과 · 현재 브라우저 탭에 보관</p>
    {isSaved && <Link className="flex min-h-11 items-center justify-center text-xs font-semibold text-primary underline" href={routes.resultArchive}>결과 보관함 보기</Link>}
    {hasError && <p className="mt-2 text-xs text-destructive" role="alert">보관 상태를 변경하지 못했어요. 브라우저 저장 설정을 확인해주세요.</p>}
    </div>
  );
}
