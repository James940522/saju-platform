"use client";

import { Archive, ChevronRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { getAuthenticatedUserId, getAuthServerSnapshot, subscribeToAuth } from "@/entities/auth";
import type { ReadingTheme } from "@/entities/reading";
import { useReadingJobs } from "@/entities/reading_job";
import { getSavedDemoResult, setDemoResultSaved, subscribeToSavedDemoResult } from "@/entities/saved_result";
import { routes } from "@/shared/config";
import { filterArchivedResults, formatArchiveDate, getArchiveProducts, toArchivedResults, type ArchivedResult } from "../model/result_archive";

const BADGE_COLORS: Record<ReadingTheme, string> = {
  self: "bg-[#6b50ad] text-white",
  relationship: "bg-primary text-primary-foreground",
  fortune: "bg-[#a36d0b] text-white",
  wealth: "bg-[#46715a] text-white",
  career: "bg-[#506887] text-white",
  question: "bg-[#87664d] text-white",
};

function ResultCard({ result, isLatest, onRemoveDemo }: {
  result: ArchivedResult;
  isLatest: boolean;
  onRemoveDemo: () => void;
}) {
  const isPending = result.status === "queued" || result.status === "running";
  return (
    <li className={`flex min-w-0 items-center rounded-[20px] border bg-surface shadow-soft ${isLatest ? "border-brand-gold" : "border-transparent"}`}>
      {result.isDemo && (
        <button
          aria-label={`${result.title} 예시 결과 보관 해제`}
          className="ml-2 min-h-11 shrink-0 border-r border-border px-3 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onRemoveDemo}
          type="button"
        >해제</button>
      )}
      <Link className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] px-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={result.href}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${BADGE_COLORS[result.theme]}`}>{result.productTitle}</span>
            <time className="text-[11px] text-muted-foreground" dateTime={result.createdAt}>{formatArchiveDate(result.createdAt)}</time>
            {isLatest && <span className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-[10px] text-accent-foreground">최근 결과</span>}
            {result.isDemo && <span className="text-[10px] text-muted-foreground">예시</span>}
          </div>
          <h3 className="mt-2 break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere]">{result.title}</h3>
          <p className={`mt-0.5 flex items-start gap-1.5 text-xs leading-5 ${result.status === "failed" ? "text-destructive" : "text-muted-foreground"}`}>
            {isPending && <LoaderCircle aria-hidden="true" className="mt-0.5 shrink-0 animate-spin motion-reduce:animate-none" size={14} />}
            {result.description}
          </p>
        </div>
        <ChevronRight aria-hidden="true" className="shrink-0 text-muted-foreground" size={17} />
      </Link>
    </li>
  );
}

function ArchiveContent({ userId }: { userId: string | null | undefined }) {
  return typeof userId === "string" ? <SavedResults key={userId} userId={userId} /> : (
    <ArchiveView results={[]} isLoading={userId === undefined} isGuest={userId === null} />
  );
}

function SavedResults({ userId }: { userId: string }) {
  const query = useReadingJobs(userId);
  const demoSavedAt = useSyncExternalStore(subscribeToSavedDemoResult, () => getSavedDemoResult(userId), () => null);
  const [saveError, setSaveError] = useState(false);
  const results = toArchivedResults(query.data?.pages.flatMap((page) => page.jobs) ?? [], demoSavedAt);
  return (
    <>
      <ArchiveView
        results={results}
        isLoading={query.isPending}
        hasError={query.isError}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onRetry={() => void (query.isFetchNextPageError ? query.fetchNextPage() : query.refetch())}
        onLoadMore={() => void query.fetchNextPage()}
        onRemoveDemo={() => setSaveError(!setDemoResultSaved(userId, false))}
      />
      {saveError && <p className="mt-3 text-xs text-destructive" role="alert">보관을 해제하지 못했어요. 브라우저 저장 설정을 확인해주세요.</p>}
    </>
  );
}

// Kept separate from auth and fetching so every archive state uses the same UI.
export function ArchiveView({ results, isLoading = false, isGuest = false, hasError = false, hasNextPage = false, isFetchingNextPage = false, onRetry, onLoadMore, onRemoveDemo = () => {} }: {
  results: readonly ArchivedResult[];
  isLoading?: boolean;
  isGuest?: boolean;
  hasError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onRetry?: () => void;
  onLoadMore?: () => void;
  onRemoveDemo?: () => void;
}) {
  const [productCode, setProductCode] = useState("all");
  const products = getArchiveProducts(results);
  const filteredResults = filterArchivedResults(results, productCode);
  const selectedTitle = products.find((product) => product.code === productCode)?.title;
  const latestId = results.find((result) => result.status === "succeeded" && !result.isDemo)?.id;

  return (
    <section className="mt-7" aria-labelledby="archive-title">
      <div className="sticky top-0 z-[1] bg-background pb-3 pt-2">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold" id="archive-title">사주 결과</h2>
          {!isLoading && !isGuest && !hasError && <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">{filteredResults.length}개{hasNextPage ? "+" : ""}</p>}
        </div>
        <div aria-label="상품별 결과 필터" className="flex max-w-full gap-1.5 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-color:var(--paper-border)_transparent] [scrollbar-width:thin]" role="group">
          {[{ code: "all", title: "전체" }, ...products].map((product) => (
            <button
              aria-controls="archive-results"
              aria-pressed={productCode === product.code}
              className={`min-h-11 shrink-0 rounded-full px-3.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-gold ${productCode === product.code ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:bg-paper"}`}
              key={product.code}
              onClick={(event) => {
                setProductCode(product.code);
                event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
              }}
              type="button"
            >{product.title}</button>
          ))}
        </div>
      </div>

      <div aria-busy={isLoading || isFetchingNextPage} id="archive-results">
        {isLoading && <p className="py-10 text-center text-sm text-muted-foreground" role="status">보관한 결과를 불러오고 있어요.</p>}
        {hasError && (
          <div className="mb-3 rounded-2xl border border-border bg-surface p-4 text-sm" role="alert">
            <p>결과를 불러오지 못했어요. 잠시 후 다시 확인해주세요.</p>
            <button className="mt-1 min-h-11 font-semibold text-primary underline" onClick={onRetry} type="button">다시 불러오기</button>
          </div>
        )}
        {isGuest ? (
          <div className="rounded-[20px] bg-surface px-5 py-10 text-center">
            <Archive aria-hidden="true" className="mx-auto text-brand-gold-muted" size={30} strokeWidth={1.5} />
            <h3 className="mt-4 text-base font-semibold">나의 풀이를 오래 간직하세요</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">로그인하면 보관한 결과를<br />상품별로 다시 볼 수 있어요.</p>
            <Link className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground" href={routes.login({ next: routes.resultArchive })}>로그인하고 보관함 보기</Link>
          </div>
        ) : (
          <>
            <ul className="space-y-2.5">
              {filteredResults.map((result) => <ResultCard key={result.id} result={result} isLatest={result.id === latestId} onRemoveDemo={onRemoveDemo} />)}
            </ul>
            {!isLoading && !hasError && filteredResults.length === 0 && (
              <div className="rounded-[20px] bg-surface px-5 py-10 text-center">
                <Archive aria-hidden="true" className="mx-auto text-brand-gold-muted" size={30} strokeWidth={1.5} />
                <h3 className="mt-4 text-sm font-semibold">{hasNextPage ? "불러온 내역에 해당 결과가 없어요" : selectedTitle ? `아직 ${selectedTitle} 결과가 없어요` : "아직 보관한 결과가 없어요"}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{hasNextPage ? "이전 결과를 더 불러와 확인해보세요." : "풀이를 마치면 이곳에서 다시 확인할 수 있어요."}</p>
                {!hasNextPage && <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4" href={routes.readings}>풀이 둘러보기</Link>}
              </div>
            )}
            {hasNextPage && <button className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface text-sm font-semibold disabled:opacity-50" disabled={isFetchingNextPage} onClick={onLoadMore} type="button">{isFetchingNextPage ? <><LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" size={16} />불러오는 중</> : "이전 결과 더 보기"}</button>}
            {filteredResults.length > 0 && <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">최근 요청한 풀이부터 보여드려요.</p>}
          </>
        )}
      </div>
    </section>
  );
}

export function ResultArchiveList() {
  const userId = useSyncExternalStore(subscribeToAuth, getAuthenticatedUserId, getAuthServerSnapshot);
  return <ArchiveContent userId={userId} />;
}
