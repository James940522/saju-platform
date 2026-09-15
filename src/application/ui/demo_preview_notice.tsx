"use client";

import { useSyncExternalStore } from "react";
import { isDemoActive, subscribeToDemo } from "@/shared/api";

export function DemoPreviewNotice() {
  const isPreview = useSyncExternalStore(subscribeToDemo, isDemoActive, () => false);
  if (!isPreview) return null;
  return (
    <p className="bg-paper px-4 py-2 text-center text-[11px] text-muted-foreground" role="status">
      화면 미리보기 · 예시 데이터로 둘러보고 있어요
    </p>
  );
}
