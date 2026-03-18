"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TasteRadarChart from "@/components/ui/TasteRadarChart";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import { useProfile } from "@/hooks/useProfile";
import { useKimchiDex, useUpdateKimchiDex, useDeleteKimchiDex } from "@/hooks/useKimchiDex";
import { KIMCHI_DATA } from "@/constants/kimchi";
import { ArrowLeft, Search } from "lucide-react";

// Keep STATUS_CONFIG locally since it's a UI concern
const STATUS_CONFIG = {
  tried: {
    label: "먹어봤어요",
    emoji: "😋",
    color: "bg-green-100 text-green-700",
    borderColor: "border-green-500",
  },
  made: {
    label: "담가봤어요",
    emoji: "👨‍🍳",
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-500",
  },
  want: {
    label: "도전할래요",
    emoji: "🎯",
    color: "bg-amber-100 text-amber-700",
    borderColor: "border-amber-500",
  },
} as const;

// Map local status names to API status names
const STATUS_TO_API: Record<string, "want_to_try" | "tried" | "favorite"> = {
  tried: "tried",
  made: "favorite",
  want: "want_to_try",
};

const API_TO_LOCAL: Record<string, "tried" | "made" | "want"> = {
  tried: "tried",
  favorite: "made",
  want_to_try: "want",
};

type FilterType = "all" | "collected" | "tried" | "made" | "want" | "uncollected";
type LocalStatus = "tried" | "made" | "want";

interface DexEntry {
  kimchiId: string;
  status: string;
  rating?: number | null;
  memo?: string;
}

export default function KimchiDexPage() {
  const t = useTranslations("profile.kimchiDex");
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: dexData, isLoading: dexLoading } = useKimchiDex();
  const updateDex = useUpdateKimchiDex();
  const deleteDex = useDeleteKimchiDex();

  const profile = profileData?.data;
  const entries: DexEntry[] = dexData?.data ?? [];

  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedKimchi, setSelectedKimchi] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "region" | "spicy">("name");

  const isLoading = profileLoading || dexLoading;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Build a lookup map from API entries
  const entryMap = new Map<string, DexEntry>();
  for (const entry of entries) {
    entryMap.set(entry.kimchiId, entry);
  }

  const getEntry = (kimchiId: string) => {
    const entry = entryMap.get(kimchiId);
    if (!entry) return null;
    const localStatus = API_TO_LOCAL[entry.status] ?? null;
    return { ...entry, status: localStatus, rating: entry.rating ?? null };
  };

  // Calculate stats
  const total = KIMCHI_DATA.length;
  const collectedEntries = entries.filter((e) => {
    const ls = API_TO_LOCAL[e.status];
    return ls === "tried" || ls === "made";
  });
  const collected = collectedEntries.length;
  const tried = entries.filter((e) => API_TO_LOCAL[e.status] === "tried").length;
  const made = entries.filter((e) => API_TO_LOCAL[e.status] === "made").length;
  const want = entries.filter((e) => API_TO_LOCAL[e.status] === "want").length;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  // Filter kimchi list
  const filteredKimchi = KIMCHI_DATA.filter((kimchi) => {
    const entry = getEntry(kimchi.id);
    switch (filter) {
      case "collected":
        return entry?.status === "tried" || entry?.status === "made";
      case "tried":
        return entry?.status === "tried";
      case "made":
        return entry?.status === "made";
      case "want":
        return entry?.status === "want";
      case "uncollected":
        return !entry || !entry.status;
      default:
        return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case "region":
        return a.region.localeCompare(b.region);
      case "spicy":
        return b.spicyLevel - a.spicyLevel;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const selectedKimchiData = selectedKimchi
    ? KIMCHI_DATA.find((k) => k.id === selectedKimchi)
    : null;
  const selectedEntry = selectedKimchi ? getEntry(selectedKimchi) : null;

  const handleSetStatus = (kimchiId: string, status: LocalStatus | null) => {
    if (status === null) {
      deleteDex.mutateAsync(kimchiId);
      return;
    }
    updateDex.mutateAsync({
      kimchiId,
      status: STATUS_TO_API[status],
    });
  };

  const handleSetRating = (kimchiId: string, rating: number) => {
    const entry = getEntry(kimchiId);
    const currentStatus = entry?.status ?? "tried";
    updateDex.mutateAsync({
      kimchiId,
      status: STATUS_TO_API[currentStatus] ?? "tried",
      rating,
    });
  };

  const handleQuickStatus = (kimchiId: string, status: LocalStatus) => {
    handleSetStatus(kimchiId, status);
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
              <Link href="/" className="hover:text-accent">
                {t("home")}
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-accent">
                {t("profile")}
              </Link>
              <span>/</span>
              <span className="text-foreground">{t("title")}</span>
            </nav>
          </div>
        </div>

        {/* Hero 설명 */}
        <section className="bg-gradient-to-r from-secondary to-secondary-dark text-white py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-3">🥬 나의 김치 도감</h1>
            <p className="text-white/85 max-w-xl mx-auto">
              한국의 다양한 김치를 탐험하고 기록하세요! 먹어본 김치, 직접 담근 김치, 도전하고 싶은 김치를 체크하고 나만의 김치 컬렉션을 완성해보세요.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <PageHero
              title={`📖 ${t("myDex")}`}
              description={t("subtitle")}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card padding="sm" className="text-center">
                <p className="text-3xl font-bold text-accent">{progress}%</p>
                <p className="text-sm text-muted-foreground">{t("progress")}</p>
              </Card>
              <Card padding="sm" className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  {collected}
                  <span className="text-lg text-muted-foreground">/{total}</span>
                </p>
                <p className="text-sm text-muted-foreground">{t("totalCollected")}</p>
              </Card>
              <Card padding="sm" className="text-center bg-success/5">
                <p className="text-3xl font-bold text-success">{tried}</p>
                <p className="text-sm text-success">{t("tried")}</p>
              </Card>
              <Card padding="sm" className="text-center bg-info/5">
                <p className="text-3xl font-bold text-info">{made}</p>
                <p className="text-sm text-info">{t("made")}</p>
              </Card>
              <Card padding="sm" className="text-center bg-accent/5">
                <p className="text-3xl font-bold text-accent">{want}</p>
                <p className="text-sm text-accent">{t("want")}</p>
              </Card>
            </div>

            {/* Progress Bar */}
            <Card padding="lg" className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {t("collectionProgress")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("collectionComplete", { count: collected, total })}
                </span>
              </div>
              <ProgressBar
                value={collected}
                max={total || 1}
                size="lg"
                color="accent"
              />

              {/* Milestones */}
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span className={progress >= 10 ? "text-accent font-medium" : ""}>
                  10% 🌱
                </span>
                <span className={progress >= 25 ? "text-accent font-medium" : ""}>
                  25% 🥬
                </span>
                <span className={progress >= 50 ? "text-accent font-medium" : ""}>
                  50% 🏆
                </span>
                <span className={progress >= 75 ? "text-accent font-medium" : ""}>
                  75% 👨‍🍳
                </span>
                <span className={progress >= 100 ? "text-accent font-medium" : ""}>
                  100% 🎖️
                </span>
              </div>
            </Card>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: t("filter.all"), count: total },
                  { key: "collected", label: t("filter.collected"), count: collected },
                  { key: "tried", label: t("filter.tried"), count: tried },
                  { key: "made", label: t("filter.made"), count: made },
                  { key: "want", label: t("filter.want"), count: want },
                  { key: "uncollected", label: t("filter.uncollected"), count: total - collected },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key as FilterType)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === item.key
                        ? "bg-accent text-white"
                        : "bg-card text-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-card border border-border rounded-[var(--radius)] text-sm text-foreground"
              >
                <option value="name">{t("sort.name")}</option>
                <option value="region">{t("sort.region")}</option>
                <option value="spicy">{t("sort.spicy")}</option>
              </select>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Kimchi Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredKimchi.map((kimchi) => {
                    const entry = getEntry(kimchi.id);
                    const isSelected = selectedKimchi === kimchi.id;
                    const status = entry?.status as LocalStatus | null | undefined;

                    return (
                      <Card
                        key={kimchi.id}
                        hover
                        padding="sm"
                        onClick={() => setSelectedKimchi(kimchi.id)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "ring-2 ring-accent shadow-lg"
                            : ""
                        } ${!status ? "opacity-60" : ""}`}
                      >
                        {/* Kimchi Icon */}
                        <div
                          className={`w-full aspect-square rounded-[var(--radius)] flex items-center justify-center mb-3 ${
                            status
                              ? "bg-gradient-to-br from-accent/20 to-primary/20"
                              : "bg-muted"
                          }`}
                        >
                          <span className="text-4xl">
                            {status ? "🥬" : "❓"}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {kimchi.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{kimchi.region}</p>

                        {/* Status Badge */}
                        {status && STATUS_CONFIG[status] && (
                          <div
                            className={`mt-2 text-xs px-2 py-1 rounded-full text-center ${STATUS_CONFIG[status].color}`}
                          >
                            {STATUS_CONFIG[status].emoji} {STATUS_CONFIG[status].label}
                          </div>
                        )}

                        {/* Rating */}
                        {entry?.rating && (
                          <div className="mt-1 text-center">
                            {"⭐".repeat(entry.rating)}
                          </div>
                        )}

                        {/* Quick Actions (on hover) */}
                        {!status && (
                          <div className="mt-2 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatus(kimchi.id, "tried");
                              }}
                              className="flex-1 text-xs py-1 bg-success/10 text-success rounded-[var(--radius-sm)] hover:bg-success/20"
                              title="먹어봤어요"
                            >
                              😋
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatus(kimchi.id, "made");
                              }}
                              className="flex-1 text-xs py-1 bg-info/10 text-info rounded-[var(--radius-sm)] hover:bg-info/20"
                              title="담가봤어요"
                            >
                              👨‍🍳
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatus(kimchi.id, "want");
                              }}
                              className="flex-1 text-xs py-1 bg-accent/10 text-accent rounded-[var(--radius-sm)] hover:bg-accent/20"
                              title="도전할래요"
                            >
                              🎯
                            </button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>

                {filteredKimchi.length === 0 && (
                  <Card padding="lg">
                    <EmptyState
                      icon={Search}
                      title={t("noResults")}
                    />
                  </Card>
                )}
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-1">
                {selectedKimchiData ? (
                  <Card padding="lg" className="sticky top-4">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-[var(--radius-lg)] flex items-center justify-center mb-4">
                        <span className="text-5xl">🥬</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        {selectedKimchiData.name}
                      </h2>
                      <p className="text-muted-foreground">{selectedKimchiData.nameEn}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedKimchiData.region}
                      </p>
                    </div>

                    {/* Taste Radar Chart */}
                    <div className="mb-6">
                      <TasteRadarChart
                        data={{
                          spicyLevel: selectedKimchiData.spicyLevel,
                          fermentationLevel: selectedKimchiData.fermentationLevel,
                          saltiness: selectedKimchiData.saltiness,
                          crunchiness: selectedKimchiData.crunchiness,
                        }}
                        name={selectedKimchiData.name}
                        size="sm"
                        showLabels={false}
                      />
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {t("collectionStatus")}
                      </p>
                      {(["tried", "made", "want"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleSetStatus(selectedKimchi!, status)}
                          className={`w-full p-3 rounded-[var(--radius)] border-2 transition-all ${
                            selectedEntry?.status === status
                              ? `${STATUS_CONFIG[status].borderColor} ${STATUS_CONFIG[status].color}`
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <span className="mr-2">{STATUS_CONFIG[status].emoji}</span>
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                      {selectedEntry?.status && (
                        <button
                          onClick={() => handleSetStatus(selectedKimchi!, null)}
                          className="w-full py-2 text-sm text-muted-foreground hover:text-error"
                        >
                          {t("cancelCollection")}
                        </button>
                      )}
                    </div>

                    {/* Rating */}
                    {selectedEntry?.status && selectedEntry.status !== "want" && (
                      <div className="mb-6">
                        <p className="text-sm font-medium text-foreground mb-2">
                          {t("myRating")}
                        </p>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleSetRating(selectedKimchi!, star)}
                              className={`text-3xl transition-transform hover:scale-110 ${
                                selectedEntry?.rating && star <= selectedEntry.rating
                                  ? "opacity-100"
                                  : "opacity-30"
                              }`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Detail Link */}
                    <Link
                      href={`/wiki/${selectedKimchiData.id}`}
                      className="block w-full"
                    >
                      <Button variant="primary" className="w-full">
                        {t("viewDetails")} →
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <Card padding="lg" className="text-center sticky top-4">
                    <EmptyState
                      icon={Search}
                      title={t("selectKimchi")}
                      description={t("selectKimchiHint")}
                    />
                  </Card>
                )}
              </div>
            </div>

            {/* Back to Profile */}
            <div className="mt-8 text-center">
              <Link href="/profile">
                <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
                  {t("backToProfile")}
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
