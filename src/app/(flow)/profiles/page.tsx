import type { Metadata } from "next";
import { SajuProfilesPage } from "@/domains/saju_profile";

export const metadata: Metadata = {
  title: "사주 관리",
  description: "등록한 사주 프로필 목록과 대표 프로필을 확인합니다.",
};

export default function Page() {
  return <SajuProfilesPage />;
}
