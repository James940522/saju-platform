import Link from "next/link";
import { StatusPage } from "@/domains/status_error";
import { BRAND_CHARACTER_IMAGES, routes } from "@/shared/config";
import { Button } from "@/shared/ui";

export default function NotFound() {
  return (
    <StatusPage
      actions={
        <Button asChild className="h-12 w-full rounded-xl text-[15px]" size="lg">
          <Link href={routes.home}>홈으로 돌아가기</Link>
        </Button>
      }
      description="찾으시는 페이지가 사라졌거나 주소가 바뀌었어요. 홈에서 다시 길을 찾아볼까요?"
      imageSrc={BRAND_CHARACTER_IMAGES.thinking}
      statusCode={404}
      title="앗, 이 길은 비어 있어요"
    />
  );
}
