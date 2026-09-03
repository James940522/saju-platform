import { ReadingStartPage } from "@/domains/reading_start";

type ReadingStartRouteProps = {
  params: Promise<{
    readingCode: string;
  }>;
};

export default async function Page({ params }: ReadingStartRouteProps) {
  const { readingCode } = await params;

  return <ReadingStartPage readingCode={readingCode} />;
}
