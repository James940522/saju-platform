import type { Metadata } from "next";
import { ResultArchivePage } from "@/domains/result_archive";

export const metadata: Metadata = {
  title: "결과 보관함",
  description: "상품별로 보관된 사주 풀이와 운세 결과를 다시 확인하세요.",
};

export default function Page() {
  return <ResultArchivePage />;
}
