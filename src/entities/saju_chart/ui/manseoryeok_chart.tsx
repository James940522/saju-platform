import { useId } from "react";

import type { SajuChartSnapshot } from "../model/saju_chart";

import { ELEMENT_THEMES } from "../config/element_theme";
import { toManseoryeokViewModel } from "../lib/to_manseoryeok_view_model";
import { ElementDistribution } from "./element_distribution";
import { PillarGrid } from "./pillar_grid";

type ManseoryeokChartProps = {
  snapshot: SajuChartSnapshot;
  variant?: "full" | "preview";
};

export function ManseoryeokChart({
  snapshot,
  variant = "full",
}: ManseoryeokChartProps) {
  const dayMasterTitleId = useId();
  const isPreview = variant === "preview";
  const isDemo = snapshot.calculation.policyVersion === "demo-preview-v1";
  const chart = toManseoryeokViewModel(snapshot);
  const dayMasterTheme = ELEMENT_THEMES[chart.dayMaster.element];

  const dayMasterCard = (
    <section
      className={`rounded-2xl border p-4 ${dayMasterTheme.surfaceClassName}`}
      aria-labelledby={dayMasterTitleId}
    >
      <p className="text-xs font-semibold opacity-75">나의 일간</p>
      <div className="mt-2 flex items-center gap-3">
        <strong className="font-display text-4xl font-bold leading-none">
          {chart.dayMaster.hanja}
        </strong>
        <div>
          <h3 className="text-base font-bold" id={dayMasterTitleId}>
            {chart.dayMaster.korean} · {chart.dayMaster.elementLabel}
          </h3>
          <p className="mt-0.5 text-xs opacity-75">
            {chart.dayMaster.yinYangLabel}의 기운 ·{" "}
            {chart.dayMaster.tenGodLabel}
          </p>
        </div>
      </div>
    </section>
  );
  const chartDetails = (
    <>
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
            <span className="text-sm text-muted-foreground">
              표시할 공망이 없어요.
            </span>
          )}
        </div>
      </section>

    </>
  );

  return (
    <article className="overflow-hidden rounded-[24px] border border-paper-border bg-paper shadow-soft">
      <header className="border-b border-paper-border px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary">
            {isPreview ? "만세력 미리보기" : "만세력 원국"}
          </p>
          <span className="rounded-full border border-paper-border bg-surface px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
            {chart.qualityLabel}
          </span>
        </div>
        {!isPreview ? (
          <h2 className="mt-2 font-display text-xl font-bold text-foreground">
            나를 이루는 네 개의 기둥
          </h2>
        ) : null}
        <p className="mt-2 text-xs font-medium text-foreground">
          {chart.birthSummary}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {chart.normalizedDateSummary}
        </p>
        {chart.timeCorrectionSummary ? (
          <p className="mt-3 rounded-xl bg-brand-gold-soft/60 px-3 py-2 text-[11px] leading-5 text-foreground">
            {chart.timeCorrectionSummary}
          </p>
        ) : null}
      </header>

      <div className="space-y-5 p-3 sm:p-4">
        {isPreview ? dayMasterCard : null}
        <PillarGrid
          pillars={isPreview ? [...chart.pillars].reverse() : chart.pillars}
        />

        {!isPreview ? dayMasterCard : null}

        {isPreview ? (
          <details className="rounded-2xl border border-paper-border bg-surface p-4">
            <summary className="cursor-pointer text-center text-xs font-semibold text-primary">
              오행 · 공망 자세히 보기
            </summary>
            <div className="mt-5 space-y-5">{chartDetails}</div>
          </details>
        ) : (
          chartDetails
        )}

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
        {isDemo
          ? "화면 시연용 예시 명식이에요. 입력한 생년월일로 계산한 결과가 아니에요."
          : isPreview
          ? `${chart.timePolicyLabel}이에요. 입력 중 계산 결과는 자동 저장되지 않아요.`
          : `${chart.timePolicyLabel} · ${chart.calculationMeta}`}
      </footer>
    </article>
  );
}
