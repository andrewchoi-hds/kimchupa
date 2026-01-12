"use client";

import Link from "next/link";
import { useState } from "react";
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

  const levelEmojis: Record<number, string> = {
    1: "🌱",
    2: "🥬",
    3: "👨‍🍳",
    4: "🧑‍🍳",
    5: "⭐",
    6: "🏆",
    7: "👑",
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥬</span>
            <span className="text-xl font-bold text-red-600">김추페</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/recommendation"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              김치 추천
            </Link>
            <Link
              href="/wiki"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              김치피디아
            </Link>
            <Link
              href="/community"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              커뮤니티
            </Link>
            <Link
              href="/shop"
              className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 transition-colors"
            >
              구매처
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
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
                    >
                      내 프로필
                    </Link>
                    <Link
                      href="/profile/badges"
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      뱃지 & 업적
                    </Link>
                    <Link
                      href="/profile/bookmarks"
                      className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      북마크
                    </Link>
                    <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                      로그아웃
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
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
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
              >
                김치 추천
              </Link>
              <Link
                href="/wiki"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                김치피디아
              </Link>
              <Link
                href="/community"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                커뮤니티
              </Link>
              <Link
                href="/shop"
                className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                구매처
              </Link>
              <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  >
                    내 프로필
                  </Link>
                  <button className="px-4 py-2 text-left text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link
                    href="/login"
                    className="flex-1 py-2 text-center text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-600 rounded-lg"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 py-2 text-center bg-red-600 text-white rounded-lg"
                  >
                    회원가입
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
