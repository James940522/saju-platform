import type { ReactNode } from "react";
import { TabShell } from "@/application";

type TabsLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function TabsLayout({ children }: TabsLayoutProps) {
  return <TabShell>{children}</TabShell>;
}
