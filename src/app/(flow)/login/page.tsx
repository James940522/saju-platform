import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginPage } from "@/domains/login";

export const metadata: Metadata = {
  title: "로그인 | 00사주",
  description: "서비스 화면 흐름을 확인하기 위한 데모 로그인",
};

type LoginRouteProps = {
  searchParams: Promise<{
    intent?: string | string[];
    role?: string | string[];
    target?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function Page({ searchParams }: LoginRouteProps) {
  const { intent, role, target } = await searchParams;

  if (Array.isArray(intent) || Array.isArray(role) || Array.isArray(target)) {
    notFound();
  }

  return (
    <LoginPage
      intent={getSingleValue(intent)}
      role={getSingleValue(role)}
      target={getSingleValue(target)}
    />
  );
}
