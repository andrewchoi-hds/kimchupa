"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Heart, Award, UserPlus, BellOff } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllRead,
} from "@/hooks/useNotifications";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function notificationIcon(type: string) {
  switch (type) {
    case "COMMENT":
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case "LIKE":
      return <Heart className="w-4 h-4 text-red-500" />;
    case "BADGE":
      return <Award className="w-4 h-4 text-yellow-500" />;
    case "FOLLOW":
      return <UserPlus className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const notifications: Notification[] = data?.data?.notifications ?? [];
  const unreadCount: number = data?.data?.unreadCount ?? 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function handleNotificationClick(n: Notification) {
    if (!n.read) {
      markRead.mutate(n.id);
    }
    setOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
        aria-label="알림"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-card border border-border rounded-[var(--radius)] shadow-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">알림</span>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs text-primary hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[320px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <BellOff className="w-8 h-8 mb-2" />
                <span className="text-sm">알림이 없습니다</span>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
