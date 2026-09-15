"use client";

import { Share2 } from "lucide-react";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { isDemoActive, subscribeToDemo } from "@/shared/api";
import { routes } from "@/shared/config";

type ShareReadingResultButtonProps = {
  jobId: string;
};

export function ShareReadingResultButton({
  jobId,
}: ShareReadingResultButtonProps) {
  const isPreview = useSyncExternalStore(subscribeToDemo, isDemoActive, () => false);
  const linkInputId = useId();
  const isSharingRef = useRef(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [manualCopyUrl, setManualCopyUrl] = useState<string | null>(null);

  async function handleShare() {
    if (isSharingRef.current || isDemoActive()) return;
    isSharingRef.current = true;
    setIsSharing(true);
    setIsCopied(false);
    setManualCopyUrl(null);

    // Build the public result route explicitly, excluding query/hash/auth data.
    const url = new URL(routes.readingJob(jobId), window.location.origin).href;
    const shareData = { title: "선녀 사주 · 재물운 랭킹", url };
    try {
      try {
        if (
          typeof navigator.share === "function" &&
          (typeof navigator.canShare !== "function" ||
            navigator.canShare(shareData))
        ) {
          await navigator.share(shareData);
          return;
        }
      } catch (error: unknown) {
        // Closing the share sheet is intentional; do not copy after cancellation.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }

      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
      } catch {
        // Browsers that block both APIs can still share via manual selection.
        setManualCopyUrl(url);
      }
    } finally {
      isSharingRef.current = false;
      setIsSharing(false);
    }
  }

  return (
    <div>
      <button
        className="flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-brand-gold bg-primary text-sm font-semibold text-brand-gold-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
        disabled={isSharing || isPreview}
        onClick={() => void handleShare()}
        type="button"
      >
        <Share2 aria-hidden="true" size={17} />
        {isSharing ? "공유 중이에요" : "결과 링크 공유"}
      </button>
      <p
        aria-live="polite"
        className="mt-2 text-center text-xs leading-5 text-muted-foreground"
        role="status"
      >
        {isPreview
          ? "예시 결과는 현재 탭에서만 볼 수 있어요."
          : isCopied ? "링크를 복사했어요." : "로그인 없이 결과를 볼 수 있어요."}
      </p>
      {manualCopyUrl && (
        <div className="mt-3 rounded-xl border border-paper-border bg-paper p-3">
          <label className="text-xs text-muted-foreground" htmlFor={linkInputId}>
            자동 복사가 어려워요. 아래 링크를 선택해 복사해주세요.
          </label>
          <input
            className="mt-2 h-11 w-full min-w-0 rounded-lg border border-paper-border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            id={linkInputId}
            onClick={(event) => event.currentTarget.select()}
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            type="text"
            value={manualCopyUrl}
          />
        </div>
      )}
    </div>
  );
}
