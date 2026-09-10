import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell, QueryProvider } from "@/application";
import { RegistrationConsentDialog } from "@/features/complete_registration";
import { BRAND_NAME } from "@/shared/config";
import "@/application/styles/globals.css";

export const metadata: Metadata = {
  applicationName: BRAND_NAME,
  title: {
    default: BRAND_NAME,
    template: `%s | ${BRAND_NAME}`,
  },
  description: "나의 사주와 오늘의 흐름을 쉽고 따뜻하게 풀어보는 서비스",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AppShell>
          <QueryProvider>
            {children}
            <RegistrationConsentDialog />
          </QueryProvider>
        </AppShell>
      </body>
    </html>
  );
}
