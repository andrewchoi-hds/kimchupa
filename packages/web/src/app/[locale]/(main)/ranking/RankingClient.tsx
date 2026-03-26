"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import LevelBadge from "@/components/ui/LevelBadge";
import FilterBar from "@/components/ui/FilterBar";
import PageHero from "@/components/ui/PageHero";
import Skeleton from "@/components/ui/Skeleton";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { getLevelByXp } from "@/constants/levels";

interface RankUser {
  id: string;
  nickname: string | null;
  name: string | null;
  image: string | null;
  level: number;
  xp?: number;
  weeklyXp?: number;
  postCount?: number;
  streak?: number;
}

type RankingType = "xp" | "weekly" | "contributors" | "attendance";

interface RankingClientProps {
  initialData: RankUser[] | null;
}

const RANKING_TABS: { value: RankingType; labelKey: string }[] = [
  { value: "xp", labelKey: "allXp" },
  { value: "weekly", labelKey: "weekly" },
  { value: "contributors", labelKey: "topContributors" },
  { value: "attendance", labelKey: "attendanceKings" },
];

function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1: return "\u{1F947}";
    case 2: return "\u{1F948}";
    case 3: return "\u{1F949}";
    default: return "";
  }
}

function getScore(user: RankUser, type: RankingType): number {
  switch (type) {
    case "weekly": return user.weeklyXp ?? 0;
    case "contributors": return user.postCount ?? 0;
    case "attendance": return user.streak ?? 0;
    default: return user.xp ?? 0;
  }
}

function getScoreLabel(type: RankingType, t: (key: string) => string): string {
  switch (type) {
    case "weekly": return t("weeklyXpLabel");
    case "contributors": return t("postCountLabel");
    case "attendance": return t("streakLabel");
    default: return t("xpLabel");
  }
}

function formatScore(score: number, type: RankingType, t: (key: string) => string): string {
  switch (type) {
    case "weekly": return `+${score.toLocaleString()} XP`;
    case "contributors": return t("postCountUnit").replace("{count}", score.toLocaleString());
    case "attendance": return t("streakUnit").replace("{count}", score.toLocaleString());
    default: return `${score.toLocaleString()} XP`;
  }
}

export default function RankingClient({ initialData }: RankingClientProps) {
  const t = useTranslations("ranking");
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<RankingType>("xp");
  const [rankings, setRankings] = useState<RankUser[]>(initialData ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "xp" && initialData) {
      setRankings(initialData);
      return;
    }

    async function fetchRankings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ranking?type=${activeTab}&limit=20`);
        if (res.ok) {
          const json = await res.json();
          setRankings(json.data ?? []);
        }
      } catch {
        // Keep existing data on error
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, [activeTab, initialData]);

  const filterOptions = RANKING_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const currentUserId = session?.user?.id;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHero title={t("title")} description={t("description")} className="bg-gradient-to-r from-accent to-primary text-white" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">

        {/* Tab Filters */}
        <FilterBar
          options={filterOptions}
          value={activeTab}
          onChange={(v) => setActiveTab(v as RankingType)}
          className="mb-6"
        />

        {/* Score Type Label */}
        <div className="flex justify-between items-center mb-3 px-2">
          <span className="text-sm font-medium text-muted-foreground">
            {t("rank")}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {getScoreLabel(activeTab, t)}
          </span>
        </div>

        {/* Rankings List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} padding="md">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </Card>
            ))}
          </div>
        ) : rankings.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {rankings.map((user, index) => {
              const rank = index + 1;
              const medal = getMedalEmoji(rank);
              const isMe = currentUserId === user.id;
              const score = getScore(user, activeTab);
              const displayName = user.nickname || user.name || "Anonymous";
              const levelInfo = getLevelByXp((user.xp ?? 0));

              return (
                <Card
                  key={user.id}
                  padding="md"
                  className={`transition-all ${
                    isMe
                      ? "ring-2 ring-primary bg-primary-50/50"
                      : rank <= 3
                      ? "bg-accent-50/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {medal ? (
                        <span className="text-2xl">{medal}</span>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar
                      src={user.image}
                      name={displayName}
                      size="md"
                    />

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                          {displayName}
                        </span>
                        {isMe && (
                          <span className="text-xs px-2 py-0.5 bg-primary text-white rounded-full flex-shrink-0">
                            {t("me")}
                          </span>
                        )}
                      </div>
                      <LevelBadge
                        level={user.level}
                        levelName={levelInfo.name}
                        size="sm"
                        showName={false}
                      />
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <span className={`font-bold ${rank <= 3 ? "text-primary text-lg" : "text-foreground"}`}>
                        {formatScore(score, activeTab, t)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
