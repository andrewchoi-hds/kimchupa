"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, BookOpen, Users, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  icon: LucideIcon;
  key: string;
}

const navItems: NavItem[] = [
  { href: "/recommendation", icon: Sparkles, key: "recommendation" },
  { href: "/wiki", icon: BookOpen, key: "wiki" },
  { href: "/community", icon: Users, key: "community" },
  { href: "/shop", icon: ShoppingBag, key: "shop" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    const cleanPath = pathname.replace(/^\/(ko|en)/, "") || "/";
    return cleanPath === href || cleanPath.startsWith(href + "/");
  };
}

export function DesktopNav() {
  const t = useTranslations("nav");
  const isActive = useIsActive();

  return (
    <div className="hidden md:flex items-center justify-center gap-1 flex-1">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] font-medium transition-all ${
              active
                ? "text-primary bg-primary-50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
            <span>{t(item.key)}</span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const isActive = useIsActive();

  return (
    <div className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius)] font-medium transition-all ${
              active
                ? "text-primary bg-primary-50"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-5 h-5" />
            {t(item.key)}
            {active && (
              <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
