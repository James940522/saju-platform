import { getDemoSajuProfiles } from "@/entities/saju_chart";
import { ApiClientError } from "@/shared/api";

const DEMO_FORTUNES = [
  "좋은 기회를 알아보는 감각이 강해요. 꾸준히 쌓은 실력이 새로운 수입으로 이어지는 흐름이에요.",
  "들어온 재물을 차분하게 지키는 힘이 있어요. 작은 저축과 계획적인 소비가 든든한 기반이 돼요.",
  "사람과 함께할 때 재물의 길이 넓어져요. 서로의 강점을 나누는 협업에서 기회를 찾아보세요.",
  "아이디어를 구체적인 결과로 만드는 힘이 있어요. 한 가지 목표에 집중하면 성과를 쌓기 좋아요.",
  "서두르기보다 자기 속도를 지킬 때 안정감이 커져요. 새로운 도전도 작은 계획부터 시작해보세요.",
];

// Fixed copy in selection order, exclusively for preview. This is not a calculation.
export function getDemoWealthRanking(chartIds: readonly string[]) {
  const { profiles } = getDemoSajuProfiles();
  if (chartIds.length < 2 || chartIds.length > 5 || new Set(chartIds).size !== chartIds.length)
    throw new Error("Choose two to five different preview profiles");
  const ranking = chartIds.map((chartId, index) => {
    const profile = profiles.find((item) => item.currentChartId === chartId);
    if (!profile) throw new ApiClientError({
      code: 404, message: "예시 사주 목록에서 참여자를 다시 선택해주세요.",
      data: { reason: "SAJU_CHART_NOT_FOUND" },
    });
    return {
      rank: index + 1, chartId, displayName: profile.displayName,
      fortune: DEMO_FORTUNES[index], quality: "complete", warnings: [],
    };
  });
  return {
    productCode: "wealth-ranking", schemaVersion: 1, ranking,
    comparisonTitle: "기회를 만드는 감각, 재물을 지키는 힘",
    rationale: `${ranking[0].displayName}님은 새로운 기회를 발견하고 실행에 옮기는 모습이 돋보여요. 꾸준히 다듬어 온 재능을 나누며 재물의 흐름을 넓혀가는 유형이에요.\n\n${ranking[1].displayName}님은 계획적으로 돈을 관리하고 안정적인 기반을 만드는 데 강점이 있어요. 빠른 성과보다 오래 이어지는 습관에 집중하면 좋아요.\n\n함께할 때는 기회를 찾는 역할과 계획을 점검하는 역할을 나누어 보세요. 서로 다른 강점이 모이면 혼자서는 놓쳤던 가능성을 발견할 수 있어요.`,
    notice: "화면 시연을 위한 예시 순위와 풀이예요. 입력한 사주를 계산하거나 AI로 생성한 결과가 아니에요.",
  };
}
