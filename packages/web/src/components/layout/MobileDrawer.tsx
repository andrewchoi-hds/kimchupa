"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { MobileNav } from "./NavLinks";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Monitor } from "lucide-react";

interface UserInfo {
  nickname: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage?: string;
}

const LEVEL_EMOJIS: Record<number, string> = {
  1: "\u{1F331}", 2: "\u{1F96C}", 3: "\u{1F468}\u200D\u{1F373}",
  4: "\u{1F9D1}\u200D\u{1F373}", 5: "\u2B50", 6: "\u{1F3C6}", 7: "\u{1F451}",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = [
    { value: "light" as const, icon: Sun },
    { value: "system" as const, icon: Monitor },
    { value: "dark" as const, icon: Moon },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-[var(--radius)]">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-[var(--radius-sm)] transition-colors ${
            theme === value ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

export default function MobileDrawer({
  user,
  onClose,
}: {
  user: UserInfo | null;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const xpProgress = user ? user.xp % 100 : 0;

  return (
    <div className="md:hidden py-4 border-t border-border animate-slide-up">
      {user && (
        <div className="px-4 py-3 mb-3 bg-primary-50 rounded-[var(--radius-lg)] mx-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src={user.profileImage} name={user.nickname} size="lg" />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.level}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.nickname}</p>
              <p className="text-xs text-muted-foreground">
                {LEVEL_EMOJIS[user.level]} Lv.{user.level} {user.levelName} · {user.xp} XP
              </p>
              <ProgressBar value={xpProgress} max={100} size="sm" className="mt-1.5" />
            </div>
          </div>
        </div>
      )}

      <MobileNav onNavigate={onClose} />

      <hr className="my-3 mx-4 border-border" />

      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {user ? (
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-[var(--radius)]"
            >
              <LayoutDashboard className="w-5 h-5" />
              {locale === "ko" ? "대시보드" : "Dashboard"}
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-[var(--radius)]"
            >
              <User className="w-5 h-5" />
              {t("profile")}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 text-error hover:bg-primary-50 rounded-[var(--radius)]"
            >
              <LogOut className="w-5 h-5" />
              {t("logout")}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="flex-1 py-3 text-center font-medium border-2 border-border rounded-[var(--radius)] hover:bg-muted transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="flex-1 py-3 text-center font-medium bg-primary text-white rounded-[var(--radius)] shadow-sm"
            >
              {t("signup")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export { ThemeToggle };
