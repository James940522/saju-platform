import type { Metadata } from "next";

import { SajuProfileDetailPage } from "@/domains/saju_profile";

export const metadata: Metadata = {
  title: "사주 프로필",
  description: "저장된 출생 정보와 만세력 계산 결과를 확인합니다.",
};

type PageProps = {
  params: Promise<{
    profileId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { profileId } = await params;

  return <SajuProfileDetailPage profileId={profileId} />;
}
