"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { useProfile } from "@/hooks/useProfile";
import {
  useChallenges,
  useActiveChallenge,
  useJoinChallenge,
  useCompleteChallenge,
  useChallengeDetail,
} from "@/hooks/useChallenges";
import { useSession } from "next-auth/react";
import { ArrowLeft, Calendar, Trophy, Users, Zap, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: string;
  xpReward: number;
  startDate: string;
  endDate: string;
  active: boolean;
  _count: { participants: number };
  participantStatus?: string | null;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function getDaysRemaining(endDateStr: string) {
  const end = new Date(endDateStr);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function ChallengeTypeLabel({ type }: { type: string }) {
  const labels: Record<string, { text: string; color: string }> = {
    recipe: { text: "레시피", color: "bg-primary-50 text-primary-dark" },
    photo: { text: "사진", color: "bg-accent-50 text-accent-dark" },
    quiz: { text: "퀴즈", color: "bg-info/10 text-info" },
    explore: { text: "탐험", color: "bg-success/10 text-success" },
  };
  const label = labels[type] || { text: type, color: "bg-muted text-muted-foreground" };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${label.color}`}>
      {label.text}
    </span>
  );
}

function ActiveChallengeCard({ challenge }: { challenge: Challenge }) {
  const { data: session } = useSession();
  const { data: detailData } = useChallengeDetail(challenge.id);
  const joinMutation = useJoinChallenge();
  const completeMutation = useCompleteChallenge();
  const [actionError, setActionError] = useState<string | null>(null);

  const detail = detailData?.data;
  const participantStatus = detail?.participantStatus ?? null;
  const participantCount = challenge._count.participants;
  const daysRemaining = getDaysRemaining(challenge.endDate);
  const isJoined = participantStatus === "joined" || participantStatus === "completed";
  const isCompleted = participantStatus === "completed";

  const handleJoin = async () => {
    if (!session?.user) return;
    setActionError(null);
    try {
      await joinMutation.mutateAsync(challenge.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "참여에 실패했습니다");
    }
  };

  const handleComplete = async () => {
    if (!session?.user) return;
    setActionError(null);
    try {
      await completeMutation.mutateAsync({ challengeId: challenge.id });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "완료 처리에 실패했습니다");
    }
  };

  return (
    <Card padding="lg" className="relative overflow-hidden border-2 border-primary/20">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Emoji */}
        <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-primary-50 rounded-2xl text-5xl sm:text-6xl mx-auto sm:mx-0">
          {challenge.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ChallengeTypeLabel type={challenge.type} />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
            </span>
            {daysRemaining > 0 && (
              <span className="text-xs font-medium text-accent">
                D-{daysRemaining}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {challenge.title}
          </h2>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {challenge.description}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-medium text-foreground">{participantCount}</span>명 참여 중
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-medium text-foreground">{challenge.xpReward}</span> XP 보상
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>참여자 현황</span>
              <span>{participantCount}명</span>
            </div>
            <ProgressBar
              value={participantCount}
              max={Math.max(participantCount, 50)}
              size="md"
              color="primary"
            />
          </div>

          {/* Action buttons */}
          {actionError && (
            <p className="text-xs text-error mb-2">{actionError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {!session?.user ? (
              <Link href="/login">
                <Button variant="primary" size="lg">
                  로그인하고 참여하기
                </Button>
              </Link>
            ) : isCompleted ? (
              <Button
                variant="outline"
                size="lg"
                disabled
                icon={<CheckCircle className="h-4 w-4 text-success" />}
              >
                완료됨
              </Button>
            ) : isJoined ? (
              <Button
                variant="primary"
                size="lg"
                loading={completeMutation.isPending}
                onClick={handleComplete}
                icon={<Trophy className="h-4 w-4" />}
              >
                완료하기
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                loading={joinMutation.isPending}
                onClick={handleJoin}
              >
                참여하기
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function PastChallengeItem({ challenge }: { challenge: Challenge }) {
  const participantCount = challenge._count.participants;

  return (
    <Card hover padding="md" className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-muted rounded-xl text-2xl">
        {challenge.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <ChallengeTypeLabel type={challenge.type} />
          <span className="text-xs text-muted-foreground">
            {formatDate(challenge.startDate)} ~ {formatDate(challenge.endDate)}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-foreground truncate">
          {challenge.title}
        </h3>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" />
          {participantCount}명
        </p>
        <p className="text-xs text-accent font-medium">+{challenge.xpReward} XP</p>
      </div>
    </Card>
  );
}

export default function ChallengePage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: activeData, isLoading: activeLoading } = useActiveChallenge();
  const { data: allData, isLoading: allLoading } = useChallenges(1, 20);

  const profile = profileData?.data;
  const activeChallenge: Challenge | null = activeData?.data ?? null;
  const allChallenges: Challenge[] = allData?.data ?? [];

  const isLoading = profileLoading || activeLoading || allLoading;

  // Filter past challenges (not active or ended)
  const pastChallenges = allChallenges.filter(
    (c) => activeChallenge && c.id !== activeChallenge.id
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-6 w-full max-w-2xl px-4">
            <div className="h-10 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-5 bg-muted rounded w-2/3 mx-auto" />
            <div className="h-64 bg-muted rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        user={
          profile
            ? {
                nickname: profile.nickname,
                level: profile.level,
                levelName: profile.levelName,
                xp: profile.xp,
                profileImage: profile.profileImage ?? undefined,
              }
            : undefined
        }
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
              <Link href="/community" className="hover:text-primary">
                커뮤니티
              </Link>
              <span>/</span>
              <span className="text-foreground">주간 챌린지</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <PageHero
              title="주간 챌린지"
              description="매주 새로운 김치 챌린지에 도전하고 XP를 획득하세요!"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <span className="text-2xl">🎯</span>
                <span className="font-medium text-primary-dark">
                  도전하고 성장하기
                </span>
              </div>
            </PageHero>

            {/* Active Challenge */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                이번 주 챌린지
              </h2>

              {activeChallenge ? (
                <ActiveChallengeCard challenge={activeChallenge} />
              ) : (
                <Card padding="lg">
                  <EmptyState
                    icon={Trophy}
                    title="진행 중인 챌린지가 없습니다"
                    description="곧 새로운 챌린지가 시작됩니다. 기대해주세요!"
                  />
                </Card>
              )}
            </section>

            {/* Past Challenges */}
            {pastChallenges.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  지난 챌린지
                </h2>
                <div className="space-y-3">
                  {pastChallenges.map((challenge) => (
                    <PastChallengeItem key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </section>
            )}

            {/* Back link */}
            <div className="mt-8 text-center">
              <Link href="/community">
                <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
                  커뮤니티로 돌아가기
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
