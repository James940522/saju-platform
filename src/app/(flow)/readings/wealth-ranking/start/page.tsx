import type { Metadata } from "next";
import { WealthRankingPage } from "@/domains/wealth_ranking";

export const metadata: Metadata = {
  title: "재물운 랭킹 참여자 입력",
  description: "두 명부터 함께 확인하는 무료 재물운 랭킹",
};

export default function Page() {
  return <WealthRankingPage />;
}
