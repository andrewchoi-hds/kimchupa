"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Search, Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import SearchModal from "@/components/ui/SearchModal";
import NotificationBell from "@/components/ui/NotificationBell";
import { useProfile } from "@/hooks/useProfile";
import { DesktopNav } from "./NavLinks";
import UserMenu from "./UserMenu";
import MobileDrawer, { ThemeToggle } from "./MobileDrawer";

interface HeaderProps {
  user?: {
    nickname: string;
    level: number;
    levelName: string;
    xp: number;
    profileImage?: string;
  } | null;
}

export default function Header({ user: userProp }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const common = useTranslations("common");
  const t = useTranslations("nav");

  const { data: session } = useSession();
  const { data: profileData } = useProfile();
  const profile = profileData?.success ? profileData.data : null;

  const user = userProp ?? (session?.user ? {
    nickname: profile?.nickname || session.user.name || "사용자",
    level: profile?.level ?? 1,
    levelName: profile?.level ? `Lv.${profile.level}` : "Lv.1",
    xp: profile?.xp ?? 0,
    profileImage: profile?.image ?? session.user.image ?? undefined,
  } : null);

  // Close mobile menu on route change
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsMenuOpen(false);
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <nav role="navigation" aria-label="Main navigation" className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-primary rounded-[var(--radius)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-lg">🥬</span>
            </div>
            <span className="text-xl font-bold text-primary">
              {common("siteName")}
            </span>
          </Link>

          <DesktopNav />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>
            {session?.user && <NotificationBell />}
            <ThemeToggle />
            <LanguageSwitcher />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("login")}
                </Link>
                <Link href="/signup" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-full shadow-sm hover:bg-primary-dark transition-colors">
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-1 ml-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted transition-colors"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-muted transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {isMenuOpen && <MobileDrawer user={user} onClose={() => setIsMenuOpen(false)} />}
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
