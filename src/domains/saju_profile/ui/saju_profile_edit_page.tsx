import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { AuthGate } from "@/features/auth";
import { routes } from "@/shared/config";

import { SajuProfileEditContent } from "./saju_profile_edit_content";

type SajuProfileEditPageProps = {
  profileId: string;
};

export function SajuProfileEditPage({ profileId }: SajuProfileEditPageProps) {
  const detailHref = routes.sajuProfile(profileId);
  const editHref = routes.sajuProfileEdit(profileId);

  return (
    <main className="min-h-dvh px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          aria-label="사주 프로필로 돌아가기"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
          href={detailHref}
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </Link>
        <div>
          <p className="text-xs font-semibold text-primary">사주 관리</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            사주 프로필 수정
          </h1>
        </div>
      </header>

      <AuthGate loginHref={routes.login({ next: editHref })}>
        <SajuProfileEditContent profileId={profileId} />
      </AuthGate>
    </main>
  );
}
