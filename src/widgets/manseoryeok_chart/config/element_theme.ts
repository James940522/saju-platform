import type { FiveElementCode } from "@/entities/saju_chart";

export type ElementTheme = {
  label: string;
  hanja: string;
  textClassName: string;
  surfaceClassName: string;
  fillClassName: string;
};

export const ELEMENT_THEMES: Record<FiveElementCode, ElementTheme> = {
  wood: {
    label: "목",
    hanja: "木",
    textClassName: "text-element-wood",
    surfaceClassName:
      "border-element-wood/30 bg-element-wood-soft text-element-wood",
    fillClassName: "bg-element-wood",
  },
  fire: {
    label: "화",
    hanja: "火",
    textClassName: "text-element-fire",
    surfaceClassName:
      "border-element-fire/30 bg-element-fire-soft text-element-fire",
    fillClassName: "bg-element-fire",
  },
  earth: {
    label: "토",
    hanja: "土",
    textClassName: "text-element-earth",
    surfaceClassName:
      "border-element-earth/30 bg-element-earth-soft text-element-earth",
    fillClassName: "bg-element-earth",
  },
  metal: {
    label: "금",
    hanja: "金",
    textClassName: "text-element-metal",
    surfaceClassName:
      "border-element-metal/30 bg-element-metal-soft text-element-metal",
    fillClassName: "bg-element-metal",
  },
  water: {
    label: "수",
    hanja: "水",
    textClassName: "text-element-water",
    surfaceClassName:
      "border-element-water/30 bg-element-water-soft text-element-water",
    fillClassName: "bg-element-water",
  },
};
