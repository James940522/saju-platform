import {
  ChevronRight,
  CreditCard,
  ScrollText,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { AuthGate } from "@/features/auth";
import { DefaultSajuProfilePanel } from "@/features/saju_profile_status";
import { routes } from "@/shared/config";
import { DefaultManseoryeokChart } from "@/widgets/manseoryeok_chart";

const accountItems = [
  {
    title: "사주 관리",
    description: "등록한 사주 프로필 전체 보기",
    icon: UserRound,
    href: routes.sajuProfiles,
  },
  { title: "저장한 풀이", description: "구매하거나 저장한 해석", icon: ScrollText },
  { title: "결제 내역", description: "구매 기록과 영수증", icon: CreditCard },
  { title: "계정 관리", description: "로그인, 알림, 고객센터", icon: Settings },
];

export function MySajuPage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <AuthGate loginHref={routes.login({ next: routes.mySaju })}>
        <p className="text-sm font-medium text-muted-foreground">사주 보기</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
          내 만세력
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          등록한 출생 정보를 기준으로 내 사주 원국과 오행을 확인해보세요.
        </p>

        <DefaultSajuProfilePanel />

        <DefaultManseoryeokChart />

        <section className="mt-5 space-y-3">
          {accountItems.map((item) => {
            const Icon = item.icon;

            const content = (
              <>
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Icon size={21} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {item.href ? (
                  <ChevronRight
                    className="shrink-0 text-muted-foreground"
                    size={20}
                  />
                ) : null}
              </>
            );

            return item.href ? (
              <Link
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                href={item.href}
                key={item.title}
              >
                {content}
              </Link>
            ) : (
              <article
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
                key={item.title}
              >
                {content}
              </article>
            );
          })}
        </section>
      </AuthGate>
    </main>
  );
}
