"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { User, Award, Bookmark, BookOpen, LogOut, ChevronDown } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";

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

export default function UserMenu({ user }: { user: UserInfo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");
  const profileT = useTranslations("profile");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const xpProgress = user.xp % 100;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border-2 transition-all ${
          open
            ? "border-primary bg-primary-50"
            : "border-border hover:border-primary-200 hover:bg-muted"
        }`}
      >
        <div className="relative">
          <Avatar
            src={user.profileImage}
            name={user.nickname}
            size="sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            {user.level}
          </div>
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">{user.nickname}</p>
          <div className="flex items-center gap-1.5">
            <ProgressBar value={xpProgress} max={100} size="sm" className="w-12" />
            <span className="text-[10px] text-muted-foreground">{xpProgress}/100</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-[var(--radius-lg)] shadow-lg border border-border py-2 animate-scale-in z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs text-muted-foreground">
              {LEVEL_EMOJIS[user.level]} Lv.{user.level} {user.levelName}
            </p>
            <p className="text-sm font-medium mt-0.5">{user.xp} XP</p>
          </div>

          <div className="py-1">
            {[
              { href: "/profile", icon: User, label: t("profile") },
              { href: "/profile/badges", icon: Award, label: profileT("badges.title") },
              { href: "/profile/bookmarks", icon: Bookmark, label: profileT("activity.bookmarks") },
              { href: "/profile/kimchi-dex", icon: BookOpen, label: "김치 도감" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-primary-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
