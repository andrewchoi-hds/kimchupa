"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { useProfile } from "@/hooks/useProfile";
import { useBadges, useUserBadges } from "@/hooks/useBadges";
import { ArrowLeft, Target } from "lucide-react";

type Rarity = "common" | "rare" | "epic" | "legendary";

function formatRequirement(req?: string): string {
  if (!req) return "";
  try {
    const parsed = JSON.parse(req);
    const labels: Record<string, string> = {
      post_count: "게시글 작성",
      recipe_post_count: "레시피 게시글 작성",
      qna_answer_count: "Q&A 답변",
      attendance_streak: "연속 출석",
      dex_count: "김치 도감 등록",
    };
    const label = labels[parsed.type] || parsed.type;
    return `${label} ${parsed.value}회`;
  } catch {
    return req;
  }
}

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  category?: string;
  requirement?: string;
  rarity?: Rarity;
  earnedAt?: string | null;
}

export default function BadgesPage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: badgesData, isLoading: badgesLoading } = useBadges();
  const { data: userBadgesData, isLoading: userBadgesLoading } = useUserBadges();

  const profile = profileData?.data;
  const allBadges: BadgeItem[] = badgesData?.data ?? [];
  const userBadgeIds = new Set(
    (userBadgesData?.data ?? []).map((ub: { badgeId?: string; id?: string }) => ub.badgeId ?? ub.id)
  );

  const isLoading = profileLoading || badgesLoading || userBadgesLoading;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Build badges with earned status by cross-referencing user badges
  const badgesWithStatus = allBadges.map((badge) => ({
    ...badge,
    earned: userBadgeIds.has(badge.id),
    earnedAt: (userBadgesData?.data ?? []).find(
      (ub: { badgeId?: string; id?: string; earnedAt?: string }) =>
        (ub.badgeId ?? ub.id) === badge.id
    )?.earnedAt ?? null,
  }));

  const earnedBadges = badgesWithStatus.filter((b) => b.earned);
  const lockedBadges = badgesWithStatus.filter((b) => !b.earned);
  const earnedCount = earnedBadges.length;

  const rarityOrder: Rarity[] = ["legendary", "epic", "rare", "common"];
  const getRarity = (badge: BadgeItem): Rarity => {
    if (badge.rarity && rarityOrder.includes(badge.rarity)) return badge.rarity;
    // Map category to rarity as fallback
    const categoryMap: Record<string, Rarity> = { activity: "common", community: "rare", kimchi: "epic" };
    return categoryMap[badge.category ?? ""] ?? "common";
  };
  const sortByRarity = (badges: typeof badgesWithStatus) =>
    [...badges].sort(
      (a, b) => rarityOrder.indexOf(getRarity(a)) - rarityOrder.indexOf(getRarity(b))
    );

  const rarityLabels = {
    common: { name: "일반", color: "text-muted-foreground" },
    rare: { name: "레어", color: "text-info" },
    epic: { name: "에픽", color: "text-primary" },
    legendary: { name: "전설", color: "text-accent" },
  };

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
              <span className="text-foreground">뱃지</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <PageHero
              title="뱃지 컬렉션"
              description="활동을 통해 뱃지를 수집하세요!"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                <span className="text-2xl">🏆</span>
                <span className="font-medium text-primary-dark">
                  {earnedCount} / {allBadges.length} 획득
                </span>
              </div>
            </PageHero>

            {/* Progress Bar */}
            <Card padding="lg" className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  컬렉션 진행도
                </span>
                <span className="text-sm text-muted-foreground">
                  {allBadges.length > 0
                    ? Math.round((earnedCount / allBadges.length) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                value={earnedCount}
                max={allBadges.length || 1}
                size="lg"
                color="primary"
              />
              <div className="flex justify-between mt-4 text-sm">
                {Object.entries(rarityLabels).map(([rarity, info]) => {
                  const count = allBadges.filter((b) => getRarity(b) === rarity).length;
                  const earned = earnedBadges.filter((b) => getRarity(b) === rarity).length;
                  return (
                    <div key={rarity} className="text-center">
                      <span className={`font-medium ${info.color}`}>
                        {info.name}
                      </span>
                      <p className="text-muted-foreground text-xs">
                        {earned}/{count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Earned Badges */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span>✨</span> 획득한 뱃지 ({earnedBadges.length})
              </h2>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {sortByRarity(earnedBadges).map((badge) => (
                    <Card
                      key={badge.id}
                      hover
                      padding="sm"
                      className="flex flex-col items-center"
                    >
                      <Badge
                        name={badge.name}
                        icon={badge.icon}
                        rarity={getRarity(badge)}
                        earned={true}
                        size="lg"
                      />
                      <p className="mt-3 text-xs text-muted-foreground text-center">
                        {badge.description}
                      </p>
                      {badge.earnedAt && (
                        <p className="mt-1 text-xs text-success">
                          {new Date(badge.earnedAt).toLocaleDateString("ko-KR")} 획득
                        </p>
                      )}
                      <Tag
                        variant={
                          getRarity(badge) === "legendary"
                            ? "accent"
                            : getRarity(badge) === "epic"
                            ? "primary"
                            : getRarity(badge) === "rare"
                            ? "secondary"
                            : "default"
                        }
                        className="mt-2"
                      >
                        {rarityLabels[getRarity(badge)].name}
                      </Tag>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card padding="lg">
                  <EmptyState
                    icon={Target}
                    title="아직 획득한 뱃지가 없습니다"
                    description="활동을 시작하여 첫 번째 뱃지를 획득해보세요!"
                  />
                </Card>
              )}
            </section>

            {/* Locked Badges */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span>🔒</span> 미획득 뱃지 ({lockedBadges.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortByRarity(lockedBadges).map((badge) => (
                  <Card
                    key={badge.id}
                    padding="sm"
                    className="flex flex-col items-center opacity-60"
                  >
                    <Badge
                      name={badge.name}
                      icon={badge.icon}
                      rarity={getRarity(badge)}
                      earned={false}
                      size="lg"
                    />
                    <p className="mt-3 text-xs text-muted-foreground text-center">
                      {badge.description}
                    </p>
                    <div className="mt-2 p-2 bg-muted rounded-[var(--radius)] w-full">
                      <p className="text-xs text-muted-foreground text-center">
                        <span className="font-medium">획득 조건:</span>
                        <br />
                        {formatRequirement(badge.requirement)}
                      </p>
                    </div>
                    <Tag
                      variant={
                        getRarity(badge) === "legendary"
                          ? "accent"
                          : getRarity(badge) === "epic"
                          ? "primary"
                          : getRarity(badge) === "rare"
                          ? "secondary"
                          : "default"
                      }
                      className="mt-2"
                    >
                      {rarityLabels[getRarity(badge)].name}
                    </Tag>
                  </Card>
                ))}
              </div>
            </section>

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
