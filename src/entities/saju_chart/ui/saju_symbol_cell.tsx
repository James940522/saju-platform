import { ELEMENT_THEMES } from "../config/element_theme";
import type { SymbolCellViewModel } from "../model/manseoryeok_view_model";

type SajuSymbolCellProps = {
  symbol: SymbolCellViewModel;
};

export function SajuSymbolCell({ symbol }: SajuSymbolCellProps) {
  const theme = ELEMENT_THEMES[symbol.element];

  return (
    <div
      className={`mx-auto flex min-h-[78px] w-full max-w-[68px] flex-col items-center justify-center rounded-xl border px-1 py-2 ${theme.surfaceClassName}`}
    >
      <strong className="font-display text-[27px] font-bold leading-none">
        {symbol.hanja}
      </strong>
      <span className="mt-1 text-[10px] font-semibold">
        {symbol.korean} · {symbol.elementLabel}
      </span>
      <span className="mt-0.5 text-[9px] opacity-75">
        {symbol.yinYangLabel}
      </span>
    </div>
  );
}
