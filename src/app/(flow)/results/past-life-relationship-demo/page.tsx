import type { Metadata } from "next";
import { PastLifeRelationshipPage } from "@/domains/past_life_relationship";

export const metadata: Metadata = {
  title: "전생 관계도 | 00사주",
  description: "두 사람의 사주에서 나타나는 인연의 특징을 살펴보는 풀이",
};

export default function Page() {
  return <PastLifeRelationshipPage />;
}
