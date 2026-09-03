import {
  CreditCard,
  ScrollText,
  Settings,
  UserRound,
} from "lucide-react";

import { DefaultSajuProfilePanel } from "@/features/saju_profile_status";

const accountItems = [
  { title: "내 사주 정보", description: "생년월일과 출생 시간", icon: UserRound },
  { title: "저장한 풀이", description: "구매하거나 저장한 해석", icon: ScrollText },
  { title: "결제 내역", description: "구매 기록과 영수증", icon: CreditCard },
  { title: "계정 관리", description: "로그인, 알림, 고객센터", icon: Settings },
];

export function MySajuPage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <p className="text-sm font-medium text-muted">나와 내 기록</p>
      <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
        내 사주
      </h1>

      <DefaultSajuProfilePanel />

      <section className="mt-5 space-y-3">
        {accountItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              key={item.title}
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon size={21} strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
