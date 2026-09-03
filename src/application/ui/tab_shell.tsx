import type { ReactNode } from "react";
import { BottomNavigation } from "./bottom_navigation";

type TabShellProps = {
  children: ReactNode;
};

export function TabShell({ children }: TabShellProps) {
  return (
    <>
      <div className="pb-[calc(88px+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomNavigation />
    </>
  );
}
