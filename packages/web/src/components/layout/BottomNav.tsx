"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Wrench, User } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/wiki", icon: BookOpen, label: "백과" },
  { href: "/community", icon: Users, label: "커뮤니티" },
  { href: "/tools/ingredients", icon: Wrench, label: "도구" },
  { href: "/profile", icon: User, label: "프로필" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const clean = pathname.replace(/^\/(ko|en)/, "") || "/";
    if (href === "/") return clean === "/";
    return clean.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
