import {
  ArrowLeft,
  Crown,
  Medal,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { WealthRankingResult as RankingResult } from "@/entities/wealth_ranking";

type WealthRankingResultProps = {
  result: RankingResult;
  onEdit: () => void;
  onRestart: () => void;
};

export function WealthRankingResult({
  result,
  onEdit,
  onRestart,
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
              key={participant.chartId}
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
                {(participant.isPartial ||
                  participant.calculationNotes.length > 0) && (
                  <div className="mt-3 border-t border-paper-border pt-2 text-[11px] leading-5 text-muted-foreground">
                    {participant.isPartial && (
                      <p>
                        출생시간 등 일부 정보가 없어 제한된 정보로 풀이했어요.
                      </p>
                    )}
                    {participant.calculationNotes.map((note, index) => (
                      <p className="break-words" key={index}>
                        {note}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-6 rounded-2xl border border-border bg-surface px-4 py-5">
        <p className="text-[11px] font-semibold text-brand-gold-muted">
          랭킹 산출 근거
        </p>
        <h2 className="mt-1 font-display text-[20px] font-bold text-foreground">
          이렇게 비교했어요
        </h2>
        <p className="mt-3 break-words text-xs leading-6 text-muted-foreground">
          {result.rationale}
        </p>
      </section>
      <aside className="mt-4 rounded-2xl border border-paper-border bg-paper px-4 py-3 text-[11px] leading-5 text-muted-foreground">
        {result.notice}
      </aside>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="flex h-13 items-center justify-center gap-2 rounded-xl border border-paper-border bg-surface text-sm font-semibold text-foreground"
          onClick={onEdit}
          type="button"
        >
          <ArrowLeft size={17} />
          참여자 변경
        </button>
        <button
          className="flex h-13 items-center justify-center gap-2 rounded-xl border border-brand-gold bg-primary text-sm font-bold text-brand-gold-on-dark"
          onClick={onRestart}
          type="button"
        >
          <RotateCcw size={17} />
          다시 해보기
        </button>
      </div>
    </div>
  );
}
