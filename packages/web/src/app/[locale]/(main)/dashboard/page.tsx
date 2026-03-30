"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Zap,
  Flame,
  FileText,
  Award,
  Bell,
  ChevronRight,
  CheckCircle,
  Sparkles,
  BookOpen,
  Users,
  Trophy,
  HelpCircle,
  Utensils,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import StatCard from "@/components/ui/StatCard";
import { useProfile } from "@/hooks/useProfile";
import { useAttendance, useCheckIn } from "@/hooks/useAttendance";
import { useNotifications } from "@/hooks/useNotifications";
import { useUserBadges } from "@/hooks/useBadges";
import { useXpHistory } from "@/hooks/useXpHistory";
import { useActiveChallenge } from "@/hooks/useChallenges";
import { usePosts } from "@/hooks/usePosts";
import { KIMCHI_DATA } from "@/constants/kimchi";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

function getRandomKimchi() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % KIMCHI_DATA.length;
  return KIMCHI_DATA[index];
}

// --- Login Prompt for unauthenticated users ---
function LoginPrompt() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🥬</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            김추페 대시보드
          </h1>
          <p className="text-muted-foreground mb-6">
            로그인하고 나만의 김치 활동을 확인하세요!
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button variant="primary" size="lg" className="w-full">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="w-full">
                회원가입
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

// --- Loading skeleton ---
function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-2/3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-[var(--radius-lg)]" />
              ))}
            </div>
            <div className="h-48 bg-muted rounded-[var(--radius-lg)]" />
            <div className="h-48 bg-muted rounded-[var(--radius-lg)]" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: attendanceData } = useAttendance();
  const { data: notificationsData } = useNotifications();
  const { data: userBadgesData } = useUserBadges();
  const { data: xpHistoryData } = useXpHistory();
  const { data: activeChallengeData } = useActiveChallenge();
  const { data: postsData } = usePosts({ limit: 100 });
  const checkIn = useCheckIn();

  const profile = profileData?.data;
  const attendance = attendanceData?.data;
  const notifications = notificationsData?.data ?? [];
  const userBadges = userBadgesData?.data ?? [];
  const xpHistory = xpHistoryData?.data ?? [];
  const activeChallenge = activeChallengeData?.data?.[0] ?? activeChallengeData?.data ?? null;
  const posts = postsData?.data ?? [];

  const todayKimchi = useMemo(() => getRandomKimchi(), []);

  // Auth check
  if (status === "loading" || profileLoading) {
    return <DashboardSkeleton />;
  }

  if (!session?.user || !profile) {
    return <LoginPrompt />;
  }

  // Derived data
  const currentStreak = attendance?.currentStreak ?? 0;
  const checkedInToday = attendance?.checkedInToday ?? false;
  const earnedBadgeCount = Array.isArray(userBadges)
    ? userBadges.filter((b: { earned?: boolean }) => b.earned !== false).length
    : 0;
  const postCount = Array.isArray(posts) ? posts.length : 0;

  // Today's XP: sum XP earned today from history
  const todayXp = Array.isArray(xpHistory)
    ? xpHistory
        .filter((entry: { createdAt?: string }) => {
          if (!entry.createdAt) return false;
          const entryDate = new Date(entry.createdAt);
          const today = new Date();
          return (
            entryDate.getFullYear() === today.getFullYear() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getDate() === today.getDate()
          );
        })
        .reduce((sum: number, entry: { xp?: number; amount?: number }) => sum + (entry.xp ?? entry.amount ?? 0), 0)
    : 0;

  // Recent XP gains (last 5)
  const recentXp = Array.isArray(xpHistory) ? xpHistory.slice(0, 5) : [];

  // Unread notifications
  const unreadNotifications = notifications.filter(
    (n: { read?: boolean; isRead?: boolean }) => !n.read && !n.isRead
  );

  // Challenge progress
  const challengeProgress = activeChallenge?.progress ?? 0;
  const challengeGoal = activeChallenge?.goal ?? activeChallenge?.targetCount ?? 1;

  const handleCheckIn = () => {
    checkIn.mutate();
  };

  const quickLinks = [
    { href: "/recommendation", icon: Sparkles, label: "김치 추천 받기", color: "text-primary" },
    { href: "/wiki", icon: BookOpen, label: "김치백과", color: "text-secondary" },
    { href: "/community", icon: Users, label: "커뮤니티", color: "text-accent-dark" },
    { href: "/ranking", icon: Trophy, label: "랭킹", color: "text-warning" },
    { href: "/kimjang", icon: Utensils, label: "김장 가이드", color: "text-success" },
    { href: "/faq", icon: HelpCircle, label: "FAQ", color: "text-info" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        user={{
          nickname: profile.nickname,
          level: profile.level,
          levelName: profile.levelName,
          xp: profile.xp,
          profileImage: profile.profileImage ?? undefined,
        }}
      />

      <main className="flex-1">
        {/* Hero Greeting */}
        <section className="bg-gradient-to-r from-primary to-accent pt-10 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={profile.profileImage}
                name={profile.nickname}
                size="xl"
              />
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  안녕하세요, {profile.nickname}님! 🥬
                </h1>
                <p className="text-white/80 mt-1">{formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="오늘 XP"
              value={`+${todayXp}`}
              icon={Zap}
            />
            <StatCard
              label="출석 연속"
              value={`${currentStreak}일`}
              icon={Flame}
            />
            <StatCard
              label="내 게시글"
              value={postCount}
              icon={FileText}
            />
            <StatCard
              label="내 뱃지"
              value={earnedBadgeCount}
              icon={Award}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* 이번 주 활동 */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">이번 주 활동</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Attendance */}
              <Card padding="md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    출석 체크
                  </CardTitle>
                </CardHeader>
                {checkedInToday ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">오늘 출석 완료!</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCheckIn}
                    loading={checkIn.isPending}
                    className="w-full"
                  >
                    출석 체크하기
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  연속 {currentStreak}일째 출석 중 🔥
                </p>
              </Card>

              {/* Active Challenge */}
              <Card padding="md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    진행 중 챌린지
                  </CardTitle>
                </CardHeader>
                {activeChallenge ? (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {activeChallenge.title ?? activeChallenge.name ?? "챌린지"}
                    </p>
                    <ProgressBar
                      value={challengeProgress}
                      max={challengeGoal}
                      size="md"
                      color="accent"
                      showLabel
                    />
                    <Link
                      href="/community/challenge"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      자세히 보기 <ChevronRight className="h-3 w-3 inline" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      진행 중인 챌린지가 없습니다.
                    </p>
                    <Link href="/community/challenge">
                      <Button variant="outline" size="sm" className="w-full">
                        챌린지 참여하기
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Recent XP */}
              <Card padding="md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    최근 XP 획득
                  </CardTitle>
                </CardHeader>
                {recentXp.length > 0 ? (
                  <div className="space-y-2">
                    {recentXp.map(
                      (
                        entry: {
                          id?: string;
                          action?: string;
                          reason?: string;
                          xp?: number;
                          amount?: number;
                          createdAt?: string;
                        },
                        idx: number
                      ) => (
                        <div
                          key={entry.id ?? idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground truncate mr-2">
                            {entry.action ?? entry.reason ?? "활동"}
                          </span>
                          <span className="font-medium text-success whitespace-nowrap">
                            +{entry.xp ?? entry.amount ?? 0} XP
                          </span>
                        </div>
                      )
                    )}
                    <Link
                      href="/profile/xp-history"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      전체 기록 보기
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 XP 기록이 없습니다.
                  </p>
                )}
              </Card>
            </div>
          </section>

          {/* 추천 김치 */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">오늘의 추천 김치</h2>
            <Card padding="none" className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                  <Image
                    src={todayKimchi.imageUrl}
                    alt={todayKimchi.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {todayKimchi.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {todayKimchi.nameEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < todayKimchi.spicyLevel
                              ? "text-error"
                              : "text-muted-foreground/30"
                          }
                        >
                          🌶️
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {todayKimchi.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {todayKimchi.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/wiki/${todayKimchi.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>

          {/* 읽지 않은 알림 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                읽지 않은 알림
                {unreadNotifications.length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium bg-error text-white rounded-full">
                    {unreadNotifications.length}
                  </span>
                )}
              </h2>
              <Link
                href="/profile"
                className="text-sm text-primary hover:underline"
              >
                전체 보기
              </Link>
            </div>
            {unreadNotifications.length > 0 ? (
              <div className="space-y-2">
                {unreadNotifications
                  .slice(0, 3)
                  .map(
                    (
                      notification: {
                        id: string;
                        message?: string;
                        title?: string;
                        content?: string;
                        createdAt?: string;
                      },
                    ) => (
                      <Card key={notification.id} padding="sm" hover>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">
                              {notification.message ??
                                notification.title ??
                                notification.content ??
                                "새 알림"}
                            </p>
                            {notification.createdAt && (
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleDateString("ko-KR")}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Card>
                    )
                  )}
              </div>
            ) : (
              <Card padding="md" className="text-center">
                <p className="text-sm text-muted-foreground">
                  읽지 않은 알림이 없습니다. ✨
                </p>
              </Card>
            )}
          </section>

          {/* 빠른 링크 */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">빠른 링크</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickLinks.map((link) => {
                const IconComp = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Card hover padding="md" className="flex items-center gap-3 h-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted ${link.color}`}
                      >
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {link.label}
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
