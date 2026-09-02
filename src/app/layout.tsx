import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/application";
import "@/application/styles/globals.css";

export const metadata: Metadata = {
  title: "00사주",
  description: "나의 사주와 오늘의 흐름을 쉽고 따뜻하게 풀어보는 서비스",
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
