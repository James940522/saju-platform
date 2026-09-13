import type { Metadata } from "next";
import { TermsPage } from "@/domains/terms";
import { getSafeReturnPath } from "@/shared/lib";

export const metadata: Metadata = {
  title: "이용약관",
  description: "(주) 재영에프앤비가 운영하는 선녀 사주의 이용약관입니다.",
  robots: { index: false, follow: false },
};

type TermsRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function Page({ searchParams }: TermsRouteProps) {
  const { returnTo } = await searchParams;
  const returnHref = getSafeReturnPath(
    typeof returnTo === "string" ? returnTo : undefined,
  );

  return <TermsPage returnHref={returnHref} />;
}
