"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNavigation } from "./bottom_navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isFocusedFlow =
    pathname === "/readings" ||
    pathname === "/readings/past-life-relationship";

  return (
    <div className="min-h-dvh bg-app-outer text-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[var(--app-max-width)] bg-background shadow-[0_0_0_1px_rgba(71,57,37,0.06)]">
        <div
          className={
            isFocusedFlow
              ? undefined
              : "pb-[calc(88px+env(safe-area-inset-bottom))]"
          }
        >
          {children}
        </div>
        {isFocusedFlow ? null : <BottomNavigation />}
      </div>
    </div>
  );
}
