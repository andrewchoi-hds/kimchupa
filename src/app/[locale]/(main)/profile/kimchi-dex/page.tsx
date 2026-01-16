"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TasteRadarChart from "@/components/ui/TasteRadarChart";
import { useUserStore } from "@/stores/userStore";
import {
  useKimchiDexStore,
  STATUS_CONFIG,
  CollectionStatus,
} from "@/stores/kimchiDexStore";
import { KIMCHI_DATA } from "@/constants/kimchi";

type FilterType = "all" | "collected" | "tried" | "made" | "want" | "uncollected";

export default function KimchiDexPage() {
  const t = useTranslations("profile.kimchiDex");
  const { profile } = useUserStore();
  const {
    getEntry,
    setStatus,
    setRating,
    getProgress,
    getCollectedCount,
    getTriedCount,
    getMadeCount,
    getWantCount,
    getTotalKimchiCount,
  } = useKimchiDexStore();

  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedKimchi, setSelectedKimchi] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "region" | "spicy">("name");

  const progress = getProgress();
  const collected = getCollectedCount();
  const tried = getTriedCount();
  const made = getMadeCount();
  const want = getWantCount();
  const total = getTotalKimchiCount();

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

  const handleQuickStatus = (kimchiId: string, status: CollectionStatus) => {
    setStatus(kimchiId, status);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
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
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-amber-600">
                {t("home")}
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-amber-600">
                {t("profile")}
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">{t("title")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">📖</span>
                {t("myDex")}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("subtitle")}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{progress}%</p>
                <p className="text-sm text-zinc-500">{t("progress")}</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {collected}
                  <span className="text-lg text-zinc-400">/{total}</span>
                </p>
                <p className="text-sm text-zinc-500">{t("totalCollected")}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{tried}</p>
                <p className="text-sm text-green-600">{t("tried")}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{made}</p>
                <p className="text-sm text-blue-600">{t("made")}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{want}</p>
                <p className="text-sm text-amber-600">{t("want")}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t("collectionProgress")}
                </span>
                <span className="text-sm text-zinc-500">
                  {t("collectionComplete", { count: collected, total })}
                </span>
              </div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                      {progress}%
                    </span>
                  )}
                </div>
              </div>

              {/* Milestones */}
              <div className="flex justify-between mt-4 text-xs text-zinc-500">
                <span className={progress >= 10 ? "text-amber-600 font-medium" : ""}>
                  10% 🌱
                </span>
                <span className={progress >= 25 ? "text-amber-600 font-medium" : ""}>
                  25% 🥬
                </span>
                <span className={progress >= 50 ? "text-amber-600 font-medium" : ""}>
                  50% 🏆
                </span>
                <span className={progress >= 75 ? "text-amber-600 font-medium" : ""}>
                  75% 👨‍🍳
                </span>
                <span className={progress >= 100 ? "text-amber-600 font-medium" : ""}>
                  100% 🎖️
                </span>
              </div>
            </div>

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
                        ? "bg-amber-500 text-white"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
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
                    const status = entry?.status;

                    return (
                      <div
                        key={kimchi.id}
                        onClick={() => setSelectedKimchi(kimchi.id)}
                        className={`bg-white dark:bg-zinc-800 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                          isSelected
                            ? "ring-2 ring-amber-500 shadow-lg"
                            : ""
                        } ${!status ? "opacity-60" : ""}`}
                      >
                        {/* Kimchi Icon */}
                        <div
                          className={`w-full aspect-square rounded-lg flex items-center justify-center mb-3 ${
                            status
                              ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
                              : "bg-zinc-100 dark:bg-zinc-700"
                          }`}
                        >
                          <span className="text-4xl">
                            {status ? "🥬" : "❓"}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-medium text-zinc-900 dark:text-white text-sm truncate">
                          {kimchi.name}
                        </h3>
                        <p className="text-xs text-zinc-500">{kimchi.region}</p>

                        {/* Status Badge */}
                        {status && (
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
                              className="flex-1 text-xs py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                              title="먹어봤어요"
                            >
                              😋
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatus(kimchi.id, "made");
                              }}
                              className="flex-1 text-xs py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              title="담가봤어요"
                            >
                              👨‍🍳
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickStatus(kimchi.id, "want");
                              }}
                              className="flex-1 text-xs py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                              title="도전할래요"
                            >
                              🎯
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredKimchi.length === 0 && (
                  <div className="bg-white dark:bg-zinc-800 rounded-xl p-12 text-center">
                    <span className="text-5xl block mb-4">🔍</span>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t("noResults")}
                    </p>
                  </div>
                )}
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-1">
                {selectedKimchiData ? (
                  <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 sticky top-4">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-5xl">🥬</span>
                      </div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {selectedKimchiData.name}
                      </h2>
                      <p className="text-zinc-500">{selectedKimchiData.nameEn}</p>
                      <p className="text-sm text-zinc-400 mt-1">
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
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        {t("collectionStatus")}
                      </p>
                      {(["tried", "made", "want"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatus(selectedKimchi!, status)}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            selectedEntry?.status === status
                              ? `${STATUS_CONFIG[status].borderColor} ${STATUS_CONFIG[status].color}`
                              : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                          }`}
                        >
                          <span className="mr-2">{STATUS_CONFIG[status].emoji}</span>
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                      {selectedEntry?.status && (
                        <button
                          onClick={() => setStatus(selectedKimchi!, null)}
                          className="w-full py-2 text-sm text-zinc-500 hover:text-red-500"
                        >
                          {t("cancelCollection")}
                        </button>
                      )}
                    </div>

                    {/* Rating */}
                    {selectedEntry?.status && selectedEntry.status !== "want" && (
                      <div className="mb-6">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          {t("myRating")}
                        </p>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(selectedKimchi!, star)}
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
                      className="block w-full py-3 text-center bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-medium"
                    >
                      {t("viewDetails")} →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-800 rounded-xl p-12 text-center sticky top-4">
                    <span className="text-5xl block mb-4">👆</span>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {t("selectKimchi")}
                      <br />
                      {t("selectKimchiHint")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Back to Profile */}
            <div className="mt-8 text-center">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
              >
                ← {t("backToProfile")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
