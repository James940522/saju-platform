import type { Metadata } from "next";
import { ReadingJobPage } from "@/domains/reading_job";
export const metadata: Metadata = { title: "풀이 결과" };
export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <ReadingJobPage jobId={jobId} />;
}
