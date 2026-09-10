import Image from "next/image";
import { BRAND_CHARACTER_IMAGES } from "@/shared/config";
import { ReadingProductsApiDebug } from "./reading_products_api_debug";
import { ReadingProductsList } from "./reading_products_list";

export function ReadingsPage() {
  return (
    <main className="min-h-dvh px-5 pt-[calc(22px+env(safe-area-inset-top))]">
      <section className="grid grid-cols-[minmax(0,1fr)_92px] items-end gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            궁금한 주제별 콘텐츠
          </p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight text-foreground">
            풀이
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            오늘의 흐름부터 관계, 일, 돈, 타고난 성향까지 원하는 풀이를
            골라보세요.
          </p>
        </div>
        <Image
          alt=""
          className="h-auto w-[96px] object-contain"
          height={192}
          src={BRAND_CHARACTER_IMAGES.reading}
          width={192}
        />
      </section>

      {process.env.NODE_ENV === "development" ? (
        <ReadingProductsApiDebug />
      ) : null}

      <ReadingProductsList />
    </main>
  );
}
