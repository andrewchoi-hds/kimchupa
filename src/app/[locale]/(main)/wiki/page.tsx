"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { KIMCHI_DATA, type KimchiType } from "@/constants/kimchi";

type CategoryFilter = "all" | "popular" | "mild" | "spicy" | "water" | "regional";
type SortOption = "name" | "popular" | "spicy" | "fermentation";

export default function WikiPage() {
  const t = useTranslations("wiki");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const categories: { id: CategoryFilter; label: string; emoji: string }[] = [
    { id: "all", label: t("filter.all"), emoji: "📚" },
    { id: "popular", label: t("filter.popular"), emoji: "🔥" },
    { id: "mild", label: t("filter.mild"), emoji: "🥗" },
    { id: "spicy", label: t("filter.spicy"), emoji: "🌶️" },
    { id: "water", label: t("filter.water"), emoji: "💧" },
    { id: "regional", label: t("filter.region"), emoji: "🗺️" },
  ];

  const filterKimchi = (kimchi: KimchiType): boolean => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !kimchi.name.toLowerCase().includes(query) &&
        !kimchi.nameEn.toLowerCase().includes(query) &&
        !kimchi.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Category filter
    switch (categoryFilter) {
      case "mild":
        return kimchi.spicyLevel <= 1;
      case "spicy":
        return kimchi.spicyLevel >= 4;
      case "water":
        return kimchi.tags.includes("물김치") || kimchi.tags.includes("시원함");
      case "regional":
        return kimchi.region !== "전국";
      case "popular":
        return ["baechu", "kkakdugi", "dongchimi", "chonggak"].includes(kimchi.id);
      default:
        return true;
    }
  };

  const sortKimchi = (kimchiList: KimchiType[]): KimchiType[] => {
    return [...kimchiList].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          // 인기 김치를 먼저 보여줌
          const popularIds = ["baechu", "kkakdugi", "dongchimi", "chonggak"];
          const aPopular = popularIds.indexOf(a.id);
          const bPopular = popularIds.indexOf(b.id);
          if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
          if (aPopular !== -1) return -1;
          if (bPopular !== -1) return 1;
          return a.name.localeCompare(b.name, "ko");
        case "spicy":
          return b.spicyLevel - a.spicyLevel; // 매운 것부터
        case "fermentation":
          return b.fermentationLevel - a.fermentationLevel; // 발효도 높은 것부터
        case "name":
        default:
          return a.name.localeCompare(b.name, "ko");
      }
    });
  };

  const filteredKimchi = sortKimchi(KIMCHI_DATA.filter(filterKimchi));

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t("title")} 📚
              </h1>
              <p className="text-lg text-white/90 mb-8">
                {t("subtitle")}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full px-6 py-4 pr-12 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="sticky top-16 z-40 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 py-4">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    categoryFilter === category.id
                      ? "bg-red-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                  }`}
                >
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Kimchi Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("totalTypes", { count: filteredKimchi.length })}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm"
              >
                <option value="name">{t("sort.name")}</option>
                <option value="popular">{t("sort.popular")}</option>
                <option value="spicy">{t("sort.spicy")}</option>
                <option value="fermentation">{t("sort.fermentation")}</option>
              </select>
            </div>

            {filteredKimchi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKimchi.map((kimchi) => (
                  <Link
                    key={kimchi.id}
                    href={`/wiki/${kimchi.id}`}
                    className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 overflow-hidden">
                      {kimchi.imageUrl && kimchi.imageUrl.startsWith("http") ? (
                        <Image
                          src={kimchi.imageUrl}
                          alt={kimchi.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl group-hover:scale-110 transition-transform">🥬</span>
                        </div>
                      )}
                      {/* Spicy Level Indicator */}
                      <div className="absolute top-3 right-3 flex bg-white/80 dark:bg-black/50 rounded-full px-2 py-1">
                        {[...Array(Math.max(1, kimchi.spicyLevel))].map((_, i) => (
                          <span key={i} className="text-sm">🌶️</span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
                          {kimchi.name}
                        </h3>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                          {kimchi.region}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 mb-3">{kimchi.nameEn}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                        {kimchi.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {kimchi.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-xl text-zinc-600 dark:text-zinc-400">
                  {t("noResults")}
                </p>
                <p className="text-zinc-500 mt-2">
                  {t("noResultsHint")}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-12 bg-white dark:bg-zinc-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
              {t("explore.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/wiki/category/history"
                className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">📜</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {t("explore.history.title")}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t("explore.history.description")}
                </p>
              </Link>
              <Link
                href="/wiki/category/recipe"
                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">👨‍🍳</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {t("explore.recipe.title")}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t("explore.recipe.description")}
                </p>
              </Link>
              <Link
                href="/wiki/category/health"
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">💪</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {t("explore.health.title")}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t("explore.health.description")}
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
