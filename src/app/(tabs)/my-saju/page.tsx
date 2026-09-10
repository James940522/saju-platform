import type { Metadata } from "next";
import { MySajuPage } from "@/domains/my_saju";

export const metadata: Metadata = {
  title: "내 만세력",
  description: "등록한 출생 정보를 바탕으로 내 만세력을 확인합니다.",
};

export default function Page() {
  return <MySajuPage />;
}
