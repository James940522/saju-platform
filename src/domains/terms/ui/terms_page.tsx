import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BRAND_NAME, COMPANY_DETAILS, routes } from "@/shared/config";
import { TERMS_SECTIONS } from "../config/terms_content";

type TermsPageProps = {
  returnHref: string | null;
};

export function TermsPage({ returnHref }: TermsPageProps) {
  return (
    <main
      className="min-h-dvh px-5 pb-[calc(32px+env(safe-area-inset-bottom))] pt-[calc(18px+env(safe-area-inset-top))]"
      id="terms-top"
    >
      <header className="flex items-center gap-3">
        <Link
          aria-label={returnHref ? "이전 화면으로 돌아가기" : "홈으로 돌아가기"}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-paper-border bg-surface text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          href={returnHref ?? routes.home}
          replace={Boolean(returnHref)}
        >
          <ArrowLeft aria-hidden="true" size={21} strokeWidth={1.8} />
        </Link>
        <div>
          <p className="text-sm font-semibold text-primary">{BRAND_NAME}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            이용약관
          </h1>
        </div>
      </header>

      <aside
        aria-label="약관 시행 상태"
        className="mt-6 rounded-xl border border-paper-border bg-paper p-4 text-sm leading-6 text-foreground"
      >
        <p className="font-semibold">시행 전 초안 · 시행일 미정</p>
        <p className="mt-1">
          사업자 정보와 운영 조건을 확인 중인 초안입니다. 최종 약관과 시행일은
          확정 후 안내합니다.
        </p>
      </aside>

      <details className="mt-6 border-y border-border py-4">
        <summary className="cursor-pointer text-base font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          약관 목차
        </summary>
        <nav aria-label="이용약관 목차" className="mt-3">
          <ul className="space-y-1">
            {TERMS_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  className="block py-2 text-sm leading-6 text-foreground underline-offset-4 hover:underline focus-visible:underline"
                  href={`#${section.id}`}
                >
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a
                className="block py-2 text-sm leading-6 text-foreground underline-offset-4 hover:underline focus-visible:underline"
                href="#company-details"
              >
                사업자 및 고객문의 정보
              </a>
            </li>
          </ul>
        </nav>
      </details>

      <article aria-label="이용약관 전문" className="mt-8 space-y-9">
        {TERMS_SECTIONS.map((section) => (
          <section
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-6"
            id={section.id}
            key={section.id}
          >
            <h2
              className="text-lg font-bold leading-7 text-foreground"
              id={`${section.id}-title`}
            >
              {section.title}
            </h2>
            {section.introduction ? (
              <p className="mt-3 break-words text-base leading-8 text-foreground">
                {section.introduction}
              </p>
            ) : null}
            {section.clauses.length > 0 ? (
              <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-8 text-foreground marker:text-muted-foreground">
                {section.clauses.map((clause, index) => (
                  <li className="break-words pl-1" key={index}>
                    {clause.text}
                    {clause.items ? (
                      <ul className="mt-2 list-disc space-y-2 pl-5">
                        {clause.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}

        <section aria-labelledby="effective-date-title">
          <h2 className="text-lg font-bold" id="effective-date-title">
            부칙
          </h2>
          <p className="mt-3 text-base leading-8">
            이 약관의 시행일은 아직 정해지지 않았습니다. 확정된 시행일을 별도로
            안내합니다.
          </p>
        </section>

        <section
          aria-labelledby="company-details-title"
          className="scroll-mt-6 border-t border-border pt-7"
          id="company-details"
        >
          <h2 className="text-lg font-bold" id="company-details-title">
            사업자 및 고객문의 정보
          </h2>
          <dl className="mt-4 space-y-4 text-base leading-7">
            {COMPANY_DETAILS.map((detail) => (
              <div key={detail.label}>
                <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                <dd className="mt-0.5 break-words">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
        <a
          className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
          href="#terms-top"
        >
          맨 위로
        </a>
        {returnHref ? (
          <Link
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4"
            href={returnHref}
            replace
          >
            이전 화면으로 돌아가기
          </Link>
        ) : null}
      </footer>
    </main>
  );
}
