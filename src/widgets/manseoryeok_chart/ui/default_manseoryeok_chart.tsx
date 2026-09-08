"use client";

import { useSyncExternalStore } from "react";
import {
  getAuthenticatedUserId,
  getAuthServerSnapshot,
  subscribeToAuth,
} from "@/entities/auth";
import {
  getDemoSajuProfileSnapshot,
  parseDemoSajuProfileSnapshot,
  subscribeToDemoSajuProfiles,
} from "@/entities/saju_profile";
import { DEMO_SAJU_CHART_SNAPSHOT } from "@/entities/saju_chart";

import { ManseoryeokChart } from "./manseoryeok_chart";

export function DefaultManseoryeokChart() {
  const userId = useSyncExternalStore<string | null | undefined>(
    subscribeToAuth,
    getAuthenticatedUserId,
    getAuthServerSnapshot,
  );
  const profileSnapshot = useSyncExternalStore<string | null | undefined>(
    subscribeToDemoSajuProfiles,
    () => getDemoSajuProfileSnapshot("default"),
    () => undefined,
  );

  if (!userId || !profileSnapshot) {
    return null;
  }

  const profile = parseDemoSajuProfileSnapshot(profileSnapshot);

  if (!profile) {
    return null;
  }

  return (
    <section className="mt-7" aria-labelledby="manseoryeok-preview-title">
      <div className="mb-4 px-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-primary">UI PREVIEW</p>
          <span className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-[9px] font-semibold text-foreground">
            서버 연결 전 예시
          </span>
        </div>
        <h2
          className="mt-2 font-display text-xl font-bold text-foreground"
          id="manseoryeok-preview-title"
        >
          만세력은 이렇게 보여드릴게요
        </h2>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {profile.displayName}님의 실제 입력값을 계산한 결과가 아닙니다. 서버
          계산이 연결되면 아래 예시 Snapshot 대신 저장된 현재 명식을
          표시합니다.
        </p>
      </div>

      <ManseoryeokChart snapshot={DEMO_SAJU_CHART_SNAPSHOT} />
    </section>
  );
}
