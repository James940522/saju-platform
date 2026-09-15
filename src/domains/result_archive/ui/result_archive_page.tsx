import { ChevronRight, UserRound } from "lucide-react";
import Link from "next/link";
import { routes } from "@/shared/config";
import { ResultArchiveList } from "./result_archive_list";

export function ResultArchivePage() {
  return (
    <main className="px-5 pb-6 pt-[calc(24px+env(safe-area-inset-top))]">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight">결과 보관함</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">나의 풀이를 한곳에 모아두었어요.</p>
        </div>
        <Link className="flex min-h-11 shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground" href={routes.mySaju}>
          <UserRound aria-hidden="true" size={15} />
          내 만세력
          <ChevronRight aria-hidden="true" size={14} />
        </Link>
      </header>
      <ResultArchiveList />
    </main>
  );
}
