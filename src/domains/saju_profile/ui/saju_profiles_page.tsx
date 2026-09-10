import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthGate } from "@/features/auth";
import { SajuProfileList } from "@/features/saju_profile_list";
import { routes } from "@/shared/config";

export function SajuProfilesPage() {
  return (
    <main className="min-h-dvh px-5 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[calc(18px+env(safe-area-inset-top))]">
      <header className="flex items-center gap-3">
        <Link
          aria-label="내 만세력으로 돌아가기"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground"
          href={routes.mySaju}
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </Link>
        <div>
          <p className="text-xs font-semibold text-primary">내 만세력</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            사주 관리
          </h1>
        </div>
      </header>

      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        등록한 사람별 출생 정보와 대표 프로필을 확인할 수 있어요.
      </p>

      <AuthGate loginHref={routes.login({ next: routes.sajuProfiles })}>
        <SajuProfileList />
      </AuthGate>
    </main>
  );
}
