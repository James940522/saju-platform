import type { Metadata } from "next";

import { SajuProfileEditPage } from "@/domains/saju_profile";

export const metadata: Metadata = {
  title: "사주 프로필 수정",
  description: "저장된 사주 프로필과 출생 정보를 수정합니다.",
};

type PageProps = {
  params: Promise<{
    profileId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { profileId } = await params;

  return <SajuProfileEditPage profileId={profileId} />;
}
