"use client";

import type { LucideIcon } from "lucide-react";
import { BookOpenText, Home, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { label: "홈", href: "/", icon: Home },
  { label: "풀이", href: "/readings", icon: BookOpenText },
  { label: "운세", href: "/fortune", icon: Sparkles },
  { label: "내 사주", href: "/my-saju", icon: UserRound },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[var(--app-max-width)] border-t border-border bg-background/95 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      aria-label="주요 메뉴"
    >
      <div className="grid grid-cols-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              className={`flex min-h-14 flex-col items-center justify-center text-[11px] font-semibold leading-none ${
                isActive ? "text-primary" : "text-muted"
              }`}
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={21} strokeWidth={isActive ? 2 : 1.6} />
              <span className="mt-1.5 whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
