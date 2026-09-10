import type { ImageProps } from "next/image";
import Image from "next/image";
import type { ReactNode } from "react";

type StatusPageProps = {
  actions: ReactNode;
  description: string;
  imageSrc: ImageProps["src"];
  statusCode: number;
  title: string;
};

export function StatusPage({
  actions,
  description,
  imageSrc,
  statusCode,
  title,
}: StatusPageProps) {
  return (
    <main
      className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto] px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(36px+env(safe-area-inset-top))] text-center"
      aria-labelledby="status-page-title"
    >
      <header>
        <p className="font-display text-[13px] font-bold tracking-[0.22em] text-brand-gold-muted">
          ERROR {statusCode}
        </p>
        <h1
          className="mt-3 font-display text-[28px] font-bold leading-[1.35] text-foreground"
          id="status-page-title"
        >
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-[310px] text-[14px] leading-6 text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="flex min-h-0 items-center justify-center py-4">
        <Image
          alt=""
          className="h-auto max-h-[46dvh] w-[min(84vw,340px)] object-contain"
          height={380}
          preload
          src={imageSrc}
          width={380}
        />
      </div>

      <div className="grid w-full gap-2.5">{actions}</div>
    </main>
  );
}
