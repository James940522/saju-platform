import { SajuProfileCreatePage } from "@/domains/saju_profile";
import { notFound } from "next/navigation";

type SajuProfileCreateRouteProps = {
  searchParams: Promise<{
    intent?: string | string[];
    role?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function Page({
  searchParams,
}: SajuProfileCreateRouteProps) {
  const { intent, role } = await searchParams;

  if (Array.isArray(intent) || Array.isArray(role)) {
    notFound();
  }

  return (
    <SajuProfileCreatePage
      intent={getSingleValue(intent)}
      role={getSingleValue(role)}
    />
  );
}
