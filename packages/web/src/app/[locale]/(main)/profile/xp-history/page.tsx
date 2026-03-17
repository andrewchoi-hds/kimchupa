"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import { useProfile } from "@/hooks/useProfile";
import { useXpHistory } from "@/hooks/useXpHistory";
import { XP_REWARDS } from "@/constants/levels";
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Zap } from "lucide-react";

interface XpEntry {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
  createdAt?: string;
}

export default function XpHistoryPage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: xpData, isLoading: xpLoading } = useXpHistory();

  const profile = profileData?.data;
  const history: XpEntry[] = xpData?.data ?? [];

  const isLoading = profileLoading || xpLoading;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate XP stats from history
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const todayXp = history
    .filter((e) => new Date(e.timestamp ?? e.createdAt ?? "") >= todayStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const weekXp = history
    .filter((e) => new Date(e.timestamp ?? e.createdAt ?? "") >= weekStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const xpGuide = Object.entries(XP_REWARDS).map(([action, xp]) => {
    const labels: Record<string, { label: string; icon: string }> = {
      attendance: { label: "출석 체크", icon: "📅" },
      post_created: { label: "게시글 작성", icon: "📝" },
      comment_created: { label: "댓글 작성", icon: "💬" },
      recipe_shared: { label: "레시피 공유", icon: "🍳" },
      wiki_edit: { label: "위키 편집", icon: "📖" },
      wiki_suggestion: { label: "위키 제안", icon: "💡" },
      post_liked: { label: "좋아요 받음", icon: "❤️" },
      challenge_completed: { label: "챌린지 완료", icon: "🏆" },
    };
    return { action, xp, ...labels[action] };
  });

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
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                홈
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-primary">
                프로필
              </Link>
              <span>/</span>
              <span className="text-foreground">XP 기록</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <PageHero
              title="XP 획득 기록"
              description="경험치를 쌓아 레벨업하세요!"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard
                label="오늘 획득"
                value={`+${todayXp} XP`}
                icon={Calendar}
                className="text-success"
              />
              <StatCard
                label="이번 주"
                value={`+${weekXp} XP`}
                icon={TrendingUp}
                className="text-info"
              />
              <StatCard
                label="누적 XP"
                value={`${profile.xp} XP`}
                icon={Zap}
                className="text-primary"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* XP History */}
              <div className="lg:col-span-2">
                <Card padding="lg">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    최근 기록
                  </h2>

                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-3 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                              <span className="text-success font-bold">+{entry.amount}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {entry.reason}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(entry.timestamp ?? entry.createdAt ?? "")}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-success">
                            +{entry.amount} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={BarChart3}
                      title="아직 XP 획득 기록이 없습니다"
                      description="활동을 시작하여 경험치를 쌓아보세요!"
                    />
                  )}
                </Card>
              </div>

              {/* XP Guide */}
              <div className="lg:col-span-1">
                <Card padding="lg" className="sticky top-4">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    XP 획득 방법
                  </h2>
                  <div className="space-y-3">
                    {xpGuide.map((item) => (
                      <div
                        key={item.action}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-sm text-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          +{item.xp} XP
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary-50 rounded-[var(--radius)]">
                    <p className="text-sm text-primary-dark">
                      <span className="font-bold">Tip:</span> 매일 출석 체크와 커뮤니티 활동으로
                      꾸준히 XP를 쌓아보세요!
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Back to Profile */}
            <div className="mt-8 text-center">
              <Link href="/profile">
                <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
                  프로필로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
