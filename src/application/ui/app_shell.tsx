import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-app-outer text-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[var(--app-max-width)] bg-background shadow-[0_0_0_1px_rgba(71,57,37,0.06)]">
        {children}
      </div>
    </div>
  );
}
