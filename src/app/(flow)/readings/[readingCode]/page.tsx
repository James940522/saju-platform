import { ReadingDetailPage } from "@/domains/reading_detail";

type ReadingDetailRouteProps = {
  params: Promise<{
    readingCode: string;
  }>;
};

export default async function Page({ params }: ReadingDetailRouteProps) {
  const { readingCode } = await params;

  return <ReadingDetailPage readingCode={readingCode} />;
}
