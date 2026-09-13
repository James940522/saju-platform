import type { Metadata } from "next";
import { PrivacyPage } from "@/domains/privacy";
import { getSafeReturnPath } from "@/shared/lib";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "선녀 사주의 개인정보 처리 항목, 보유기간 및 권리 행사 방법을 안내합니다.",
  robots: { index: false, follow: false },
};

type PrivacyRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function Page({ searchParams }: PrivacyRouteProps) {
  const { returnTo } = await searchParams;
  const returnHref = getSafeReturnPath(
    typeof returnTo === "string" ? returnTo : undefined,
  );

  return <PrivacyPage returnHref={returnHref} />;
}
