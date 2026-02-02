"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import SearchModal from "@/components/ui/SearchModal";
import { useUserStore } from "@/stores/userStore";

interface HeaderProps {
  user?: {
    nickname: string;
    level: number;
    levelName: string;
    xp: number;
    profileImage?: string;
  } | null;
}

// Navigation items with icons
const navItems = [
  { href: "/recommendation", icon: "sparkles", key: "recommendation" },
  { href: "/wiki", icon: "book", key: "wiki" },
  { href: "/community", icon: "users", key: "community" },
  { href: "/shop", icon: "shopping", key: "shop" },
] as const;

// Icon components
function NavIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkles: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    book: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    shopping: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    badge: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    bookmark: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    ),
    collection: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
    search: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}

export default function Header({ user: userProp }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const profileT = useTranslations("profile");

  // Get user from session/store if not passed as prop
  const { data: session } = useSession();
  const { profile: storeProfile } = useUserStore();

  // Use prop if provided, otherwise get from store/session
  const user = userProp ?? (session?.user ? {
    nickname: storeProfile.nickname || session.user.name || "사용자",
    level: storeProfile.level,
    levelName: storeProfile.levelName,
    xp: storeProfile.xp,
    profileImage: storeProfile.profileImage ?? session.user.image ?? undefined,
  } : null);

  const levelEmojis: Record<number, string> = {
    1: "🌱",
    2: "🥬",
    3: "👨‍🍳",
    4: "🧑‍🍳",
    5: "⭐",
    6: "🏆",
    7: "👑",
  };

  // Check if current path matches nav item
  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const cleanPath = pathname.replace(/^\/(ko|en)/, "") || "/";
    return cleanPath === href || cleanPath.startsWith(href + "/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    // Only close if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Defer state update to avoid cascading renders
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Calculate XP progress percentage (assuming 100 XP per level)
  const xpProgress = user ? (user.xp % 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <nav className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-shadow">
              <span className="text-lg">🥬</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {common("siteName")}
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center gap-1 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    active
                      ? "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/50"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <NavIcon name={item.icon} className="w-5 h-5" />
                  <span>{t(item.key)}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="검색"
            >
              <NavIcon name="search" className="w-5 h-5" />
            </button>

            <LanguageSwitcher />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border-2 transition-all ${
                    isProfileOpen
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.nickname}
                          className="w-8 h-8 object-cover"
                        />
                      ) : (
                        <span className="text-sm">{levelEmojis[user.level] || "🌱"}</span>
                      )}
                    </div>
                    {/* Level badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {user.level}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                      {user.nickname}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                          style={{ width: `${xpProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {user.xp % 100}/100
                      </span>
                    </div>
                  </div>

                  {/* Dropdown arrow */}
                  <svg
                    className={`w-4 h-4 text-zinc-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User summary */}
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Lv.{user.level} {user.levelName}
                      </p>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white mt-0.5">
                        {user.xp} XP
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <NavIcon name="user" className="w-4 h-4" />
                        {t("profile")}
                      </Link>
                      <Link
                        href="/profile/badges"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <NavIcon name="badge" className="w-4 h-4" />
                        {profileT("badges.title")}
                      </Link>
                      <Link
                        href="/profile/bookmarks"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <NavIcon name="bookmark" className="w-4 h-4" />
                        {profileT("activity.bookmarks")}
                      </Link>
                      <Link
                        href="/profile/kimchi-dex"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <NavIcon name="collection" className="w-4 h-4" />
                        김치 도감
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-zinc-100 dark:border-zinc-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <NavIcon name="logout" className="w-4 h-4" />
                        {t("logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search & Menu Button */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="검색"
            >
              <NavIcon name="search" className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top duration-200">
            {/* User Card (if logged in) */}
            {user && (
              <div className="px-4 py-3 mb-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl mx-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.nickname} className="w-12 h-12 object-cover" />
                      ) : (
                        <span className="text-xl">{levelEmojis[user.level] || "🌱"}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {user.level}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 dark:text-white">{user.nickname}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Lv.{user.level} {user.levelName} · {user.xp} XP
                    </p>
                    <div className="mt-1.5 w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col gap-1 px-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      active
                        ? "text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/50"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <NavIcon name={item.icon} className="w-5 h-5" />
                    {t(item.key)}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <hr className="my-3 mx-4 border-zinc-200 dark:border-zinc-700" />

            {/* Language & Auth */}
            <div className="px-4">
              <div className="mb-3">
                <LanguageSwitcher />
              </div>

              {user ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                  >
                    <NavIcon name="user" className="w-5 h-5" />
                    {t("profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                  >
                    <NavIcon name="logout" className="w-5 h-5" />
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex-1 py-3 text-center font-medium text-zinc-700 dark:text-zinc-300 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 py-3 text-center font-medium bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-lg shadow-red-500/25"
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
