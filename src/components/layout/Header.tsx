"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface HeaderProps {
  user?: {
    nickname: string;
    level: number;
    levelName: string;
    xp: number;
    profileImage?: string;
  } | null;
}

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const profile = useTranslations("profile");

  const levelEmojis: Record<number, string> = {
    1: "🌱",
    2: "🥬",
    3: "👨‍🍳",
    4: "🧑‍🍳",
    5: "⭐",
    6: "🏆",
    7: "👑",
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <nav className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🥬</span>
            <span className="text-xl font-bold text-red-600">{common("siteName")}</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center gap-6 flex-1">
            <Link
              href="/recommendation"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              {t("recommendation")}
            </Link>
            <Link
              href="/wiki"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              {t("wiki")}
            </Link>
            <Link
              href="/community"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              {t("community")}
            </Link>
            <Link
              href="/shop"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              {t("shop")}
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.nickname}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span>{levelEmojis[user.level] || "🌱"}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {user.nickname}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Lv.{user.level} {user.levelName}
                    </p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t("profile")}
                    </Link>
                    <Link
                      href="/profile/badges"
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {profile("badges.title")}
                    </Link>
                    <Link
                      href="/profile/bookmarks"
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {profile("activity.bookmarks")}
                    </Link>
                    <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-zinc-700 dark:text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <Link
                href="/recommendation"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("recommendation")}
              </Link>
              <Link
                href="/wiki"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("wiki")}
              </Link>
              <Link
                href="/community"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("community")}
              </Link>
              <Link
                href="/shop"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("shop")}
              </Link>
              <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link
                    href="/login"
                    className="flex-1 py-2 text-center text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 py-2 text-center bg-red-600 text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
