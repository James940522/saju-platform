import { ReadingCheckoutPage } from "@/domains/reading_checkout";

type ReadingCheckoutRouteProps = {
  params: Promise<{
    readingCode: string;
  }>;
};

export default async function Page({ params }: ReadingCheckoutRouteProps) {
  const { readingCode } = await params;

  return <ReadingCheckoutPage readingCode={readingCode} />;
}
