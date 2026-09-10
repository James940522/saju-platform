"use client";

import { AppShell } from "@/application";
import { StatusPage } from "@/domains/status_error";
import {
  BRAND_CHARACTER_IMAGES,
  BRAND_NAME,
  routes,
} from "@/shared/config";
import { Button } from "@/shared/ui";
import "@/application/styles/globals.css";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalErrorPage({ retry }: GlobalErrorPageProps) {
  return (
    <html lang="ko">
      <head>
        <title>{`오류 | ${BRAND_NAME}`}</title>
      </head>
      <body>
        <AppShell>
          <StatusPage
            actions={
              <>
                <Button
                  className="h-12 w-full rounded-xl text-[15px]"
                  onClick={retry}
                  size="lg"
                  type="button"
                >
                  다시 시도하기
                </Button>
                <Button
                  asChild
                  className="h-12 w-full rounded-xl text-[15px]"
                  size="lg"
                  variant="outline"
                >
                  <a href={routes.home}>홈으로 돌아가기</a>
                </Button>
              </>
            }
            description="페이지를 불러오는 동안 문제가 생겼어요. 잠시 후 다시 시도해 주세요."
            imageSrc={BRAND_CHARACTER_IMAGES.hourglass}
            statusCode={500}
            title="잠시 길이 흐려졌어요"
          />
        </AppShell>
      </body>
    </html>
  );
}
