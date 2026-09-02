import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/application";
import "@/application/styles/globals.css";

export const metadata: Metadata = {
  title: "사주 운세 서비스",
  description: "생년월일과 출생 시간을 바탕으로 사주와 운세 흐름을 확인하는 모바일 중심 서비스입니다.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
