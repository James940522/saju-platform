import { ArrowLeft, Crown, Medal, Sparkles, Trophy } from "lucide-react";
import type { PublicWealthRankingResult as RankingResult } from "@/entities/wealth_ranking";
import { ShareReadingResultButton } from "@/features/share_reading_result";

type WealthRankingResultProps = {
  jobId: string;
  result: RankingResult;
  onEdit: () => void;
};

export function WealthRankingResult({
  jobId,
  result,
  onEdit,
}: WealthRankingResultProps) {
  const winner = result.ranking[0];
  if (!winner) return null;

  return (
    <div className="animate-in fade-in duration-500 motion-reduce:animate-none">
      <section className="mt-6 overflow-hidden rounded-[24px] bg-hero px-5 py-7 text-primary-foreground shadow-soft">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold text-hero-accent">
          <Sparkles size={15} />
          우리들의 재물운
          <Sparkles size={15} />
        </p>
        <div className="mt-5 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-brand-gold bg-[#223f68] text-[#f0cc72]">
            <Crown size={31} strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-xs text-hero-foreground">재물운 랭킹 1위</p>
          <h2 className="mt-2 break-words font-display text-[28px] font-bold text-[#f2d17b]">
            {winner.displayName}
          </h2>
          <p className="mx-auto mt-3 max-w-[280px] break-words text-[12px] leading-6 text-hero-foreground">
            {winner.fortune}
          </p>
        </div>
      </section>
      <section className="mt-6" aria-labelledby="wealth-ranking-result-title">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-brand-gold-muted">
              전체 순위
            </p>
            <h2
              className="mt-1 font-display text-[21px] font-bold text-foreground"
              id="wealth-ranking-result-title"
            >
              우리들의 재물 흐름
            </h2>
          </div>
          <span className="rounded-full bg-brand-gold-soft/55 px-3 py-1.5 text-[10px] font-semibold text-brand-gold-foreground">
            {result.ranking.length}명 참여
          </span>
        </div>
        <ol className="mt-3 space-y-2.5">
          {result.ranking.map((participant) => (
            <li
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${participant.rank === 1 ? "border-brand-gold bg-brand-gold-soft/25" : "border-border bg-surface"}`}
              key={participant.rank}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full ${participant.rank === 1 ? "bg-primary text-brand-gold-on-dark" : "bg-paper text-brand-gold-foreground"}`}
              >
                {participant.rank === 1 ? (
                  <Trophy size={19} strokeWidth={1.7} />
                ) : (
                  <Medal size={19} strokeWidth={1.7} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 font-display text-base font-bold text-foreground">
                    {participant.rank}위
                  </span>
                  <span className="break-words text-sm font-semibold text-foreground">
                    {participant.displayName}
                  </span>
                </div>
                <p className="mt-1.5 break-words text-xs leading-6 text-muted-foreground">
                  {participant.fortune}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-6 rounded-[24px] border border-paper-border bg-paper px-5 py-5">
        <p className="text-[11px] font-semibold text-brand-gold-muted">
          재물운 비교 풀이
        </p>
        <h2 className="mt-1 break-words font-display text-[20px] font-bold leading-snug text-foreground">
          {result.comparisonTitle}
        </h2>
        <p className="mt-3 break-words text-xs leading-6 text-muted-foreground">
          {result.rationale}
        </p>
      </section>
      <aside className="mt-4 rounded-2xl border border-paper-border bg-paper px-4 py-3 text-[11px] leading-5 text-muted-foreground">
        {result.notice}
      </aside>
      <div className="mt-5 grid gap-2">
        <ShareReadingResultButton jobId={jobId} />
        <button
          className="flex h-13 items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface text-sm font-semibold text-foreground"
          onClick={onEdit}
          type="button"
        >
          <ArrowLeft size={17} />
          참여자 변경
        </button>
      </div>
    </div>
  );
}
