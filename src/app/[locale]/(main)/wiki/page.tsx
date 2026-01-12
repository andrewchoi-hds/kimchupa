"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { KIMCHI_DATA, type KimchiType } from "@/constants/kimchi";

type CategoryFilter = "all" | "popular" | "mild" | "spicy" | "water" | "regional";

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const categories: { id: CategoryFilter; label: string; emoji: string }[] = [
    { id: "all", label: "전체", emoji: "📚" },
    { id: "popular", label: "인기", emoji: "🔥" },
    { id: "mild", label: "순한맛", emoji: "🥗" },
    { id: "spicy", label: "매운맛", emoji: "🌶️" },
    { id: "water", label: "물김치", emoji: "💧" },
    { id: "regional", label: "지역별", emoji: "🗺️" },
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

  const filteredKimchi = KIMCHI_DATA.filter(filterKimchi);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                김치피디아 📚
              </h1>
              <p className="text-lg text-white/90 mb-8">
                200종 이상의 김치 정보를 한눈에. 역사, 레시피, 영양 정보까지!
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="김치 이름이나 재료로 검색..."
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
                총 <span className="font-semibold text-zinc-900 dark:text-white">{filteredKimchi.length}</span>개의 김치
              </p>
              <select className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm">
                <option>이름순</option>
                <option>인기순</option>
                <option>매운맛순</option>
                <option>발효도순</option>
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
                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform">🥬</span>
                      {/* Spicy Level Indicator */}
                      <div className="absolute top-3 right-3 flex">
                        {[...Array(kimchi.spicyLevel)].map((_, i) => (
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
                  검색 결과가 없습니다
                </p>
                <p className="text-zinc-500 mt-2">
                  다른 검색어나 카테고리를 선택해보세요
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-12 bg-white dark:bg-zinc-800">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
              김치 탐험하기
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/wiki/category/history"
                className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">📜</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  김치의 역사
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  삼국시대부터 현대까지, 김치의 발전 과정을 알아보세요
                </p>
              </Link>
              <Link
                href="/wiki/category/recipe"
                className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">👨‍🍳</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  김치 담그기
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  초보자도 따라할 수 있는 단계별 레시피
                </p>
              </Link>
              <Link
                href="/wiki/category/health"
                className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">💪</span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  김치와 건강
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  과학적으로 증명된 김치의 건강 효능
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
