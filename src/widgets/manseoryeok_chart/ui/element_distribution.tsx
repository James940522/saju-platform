import { ELEMENT_THEMES } from "../config/element_theme";
import type { ManseoryeokChartViewModel } from "../model/manseoryeok_view_model";

type ElementDistributionProps = {
  distribution: ManseoryeokChartViewModel["elementDistribution"];
};

export function ElementDistribution({
  distribution,
}: ElementDistributionProps) {
  return (
    <section aria-labelledby="element-distribution-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-primary">오행 구성</p>
          <h3
            className="mt-1 font-display text-lg font-bold text-foreground"
            id="element-distribution-title"
          >
            목·화·토·금·수
          </h3>
        </div>
        <p className="text-[10px] text-muted-foreground">{distribution.methodLabel}</p>
      </div>

      <dl className="mt-4 space-y-3">
        {distribution.items.map((item) => {
          const theme = ELEMENT_THEMES[item.code];

          return (
            <div className="grid grid-cols-[46px_1fr_30px] items-center gap-3" key={item.code}>
              <dt className={`text-sm font-bold ${theme.textClassName}`}>
                {item.label} {item.hanja}
              </dt>
              <dd
                aria-label={`${item.label} ${item.count}개`}
                className="flex gap-1"
              >
                {Array.from({ length: distribution.totalSymbols }, (_, index) => (
                  <span
                    aria-hidden="true"
                    className={`h-2 flex-1 rounded-full ${index < item.count ? theme.fillClassName : "bg-border/55"}`}
                    key={index}
                  />
                ))}
              </dd>
              <dd className="text-right text-sm font-semibold text-foreground">
                {item.count}
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        오행 구성은 원국의 글자 수를 센 값이며, 오행의 강약이나 좋고 나쁨을
        뜻하지 않아요.
      </p>
    </section>
  );
}
