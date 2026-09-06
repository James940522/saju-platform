import type { PillarColumnViewModel } from "../model/manseoryeok_view_model";
import { SajuSymbolCell } from "./saju_symbol_cell";

type PillarGridProps = {
  pillars: readonly PillarColumnViewModel[];
};

function UnknownSymbolCell() {
  return (
    <div className="mx-auto grid min-h-[78px] w-full max-w-[68px] place-items-center rounded-xl border border-dashed border-border bg-background px-1 text-center text-[10px] leading-4 text-muted">
      시간
      <br />
      미상
    </div>
  );
}

export function PillarGrid({ pillars }: PillarGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-paper-border bg-surface">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          년주, 월주, 일주, 시주의 천간과 지지, 십성
        </caption>
        <thead className="bg-paper">
          <tr>
            <th className="w-10 px-1 py-3 text-[9px] font-medium text-muted" scope="col">
              구분
            </th>
            {pillars.map((pillar) => (
              <th
                className="px-1 py-3 text-[11px] font-semibold text-foreground"
                key={pillar.position}
                scope="col"
              >
                {pillar.title}
                {pillar.isDayMaster ? (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[8px] text-primary-foreground">
                    나
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-paper-border">
            <th className="px-1 py-2 text-[9px] font-medium leading-3 text-muted" scope="row">
              천간
              <br />
              십성
            </th>
            {pillars.map((pillar) => (
              <td
                className="px-1 py-2 text-center text-[10px] font-semibold text-muted"
                key={pillar.position}
              >
                {pillar.stem?.tenGodLabel ?? "—"}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-1 py-2 text-[9px] font-medium text-muted" scope="row">
              천간
            </th>
            {pillars.map((pillar) => (
              <td className="px-1 py-1" key={pillar.position}>
                {pillar.stem ? (
                  <SajuSymbolCell symbol={pillar.stem} />
                ) : (
                  <UnknownSymbolCell />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-1 py-2 text-[9px] font-medium text-muted" scope="row">
              지지
            </th>
            {pillars.map((pillar) => (
              <td className="px-1 py-1" key={pillar.position}>
                {pillar.branch ? (
                  <SajuSymbolCell symbol={pillar.branch} />
                ) : (
                  <UnknownSymbolCell />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-1 py-2 text-[9px] font-medium leading-3 text-muted" scope="row">
              지지
              <br />
              십성
            </th>
            {pillars.map((pillar) => (
              <td
                className="px-1 py-2 text-center text-[10px] font-semibold text-muted"
                key={pillar.position}
              >
                {pillar.branch?.tenGodLabel ?? "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
