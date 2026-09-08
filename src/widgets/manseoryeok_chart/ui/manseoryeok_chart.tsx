import type { SajuChartSnapshot } from "@/entities/saju_chart";

import { ELEMENT_THEMES } from "../config/element_theme";
import { toManseoryeokViewModel } from "../lib/to_manseoryeok_view_model";
import { ElementDistribution } from "./element_distribution";
import { PillarGrid } from "./pillar_grid";

type ManseoryeokChartProps = {
  snapshot: SajuChartSnapshot;
};

export function ManseoryeokChart({ snapshot }: ManseoryeokChartProps) {
  const chart = toManseoryeokViewModel(snapshot);
  const dayMasterTheme = ELEMENT_THEMES[chart.dayMaster.element];

  return (
    <article className="overflow-hidden rounded-[24px] border border-paper-border bg-paper shadow-soft">
      <header className="border-b border-paper-border px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary">만세력 원국</p>
          <span className="rounded-full border border-paper-border bg-surface px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
            {chart.qualityLabel}
          </span>
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          나를 이루는 네 개의 기둥
        </h2>
        <p className="mt-2 text-xs font-medium text-foreground">
          {chart.birthSummary}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {chart.normalizedDateSummary}
        </p>
      </header>

      <div className="space-y-5 p-3 sm:p-4">
        <PillarGrid pillars={chart.pillars} />

        <section
          className={`rounded-2xl border p-4 ${dayMasterTheme.surfaceClassName}`}
          aria-labelledby="day-master-title"
        >
          <p className="text-xs font-semibold opacity-75">나의 일간</p>
          <div className="mt-2 flex items-center gap-3">
            <strong className="font-display text-4xl font-bold leading-none">
              {chart.dayMaster.hanja}
            </strong>
            <div>
              <h3 className="text-base font-bold" id="day-master-title">
                {chart.dayMaster.korean} · {chart.dayMaster.elementLabel}
              </h3>
              <p className="mt-0.5 text-xs opacity-75">
                {chart.dayMaster.yinYangLabel}의 기운 · {chart.dayMaster.tenGodLabel}
              </p>
            </div>
          </div>
        </section>

        <ElementDistribution distribution={chart.elementDistribution} />

        <section className="rounded-2xl border border-paper-border bg-surface p-4">
          <p className="text-xs font-semibold text-primary">공망</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {chart.voidBranches.length > 0 ? (
              chart.voidBranches.map((branch) => (
                <span
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
                  key={branch}
                >
                  {branch}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">표시할 공망이 없어요.</span>
            )}
          </div>
        </section>

        <details className="rounded-2xl border border-paper-border bg-surface p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            대운 흐름
          </summary>
          {chart.luckCycle ? (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                {chart.luckCycle.directionLabel} · {chart.luckCycle.startLabel}
              </p>
              <ol className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {chart.luckCycle.items.map((item) => (
                  <li
                    className="min-w-16 rounded-xl border border-paper-border bg-paper px-3 py-2 text-center"
                    key={item.sequence}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {item.startAge}세
                    </span>
                    <strong className="mt-1 block font-display text-base">
                      {item.hanja}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">{item.ganji}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              현재 응답에는 대운 정보가 없어요. 성별 기준값과 서버 계산 결과가
              있으면 이 영역에 대운을 표시합니다.
            </p>
          )}
        </details>

        {chart.warnings.length > 0 ? (
          <aside
            aria-label="만세력 계산 안내"
            className="rounded-2xl border border-brand-gold/35 bg-brand-gold-soft/45 p-4"
          >
            <p className="text-xs font-semibold text-foreground">계산 안내</p>
            <ul className="mt-2 space-y-1 text-[11px] leading-5 text-muted-foreground">
              {chart.warnings.map((warning) => (
                <li key={warning}>• {warning}</li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      <footer className="border-t border-paper-border px-4 py-3 text-[9px] leading-4 text-muted-foreground">
        {chart.calculationMeta}
      </footer>
    </article>
  );
}
