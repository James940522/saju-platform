import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginPage } from "@/domains/login";

export const metadata: Metadata = {
  title: "로그인 | 00사주",
  description: "카카오 또는 네이버 계정으로 로그인",
};

type LoginRouteProps = {
  searchParams: Promise<{
    authError?: string | string[];
    intent?: string | string[];
    role?: string | string[];
    target?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function Page({ searchParams }: LoginRouteProps) {
  const { authError, intent, role, target } = await searchParams;

  if (
    Array.isArray(authError) ||
    Array.isArray(intent) ||
    Array.isArray(role) ||
    Array.isArray(target)
  ) {
    notFound();
  }

  return (
    <LoginPage
      authError={getSingleValue(authError)}
      intent={getSingleValue(intent)}
      role={getSingleValue(role)}
      target={getSingleValue(target)}
    />
  );
}
