"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import KimchiCard from "@/components/ui/KimchiCard";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import { KIMCHI_DATA, type KimchiType } from "@/constants/kimchi";

type CategoryFilter = "all" | "popular" | "mild" | "spicy" | "water" | "regional";
type SortOption = "name" | "popular" | "spicy" | "fermentation";

export default function WikiPage() {
  const t = useTranslations("wiki");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const categories = [
    { value: "all", label: t("filter.all") },
    { value: "popular", label: t("filter.popular") },
    { value: "mild", label: t("filter.mild") },
    { value: "spicy", label: t("filter.spicy") },
    { value: "water", label: t("filter.water") },
    { value: "regional", label: t("filter.region") },
  ];

  const filterKimchi = (kimchi: KimchiType): boolean => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !kimchi.name.toLowerCase().includes(query) &&
        !kimchi.nameEn.toLowerCase().includes(query) &&
        !kimchi.description.toLowerCase().includes(query)
      ) return false;
    }
    switch (categoryFilter) {
      case "mild": return kimchi.spicyLevel <= 1;
      case "spicy": return kimchi.spicyLevel >= 4;
      case "water": return kimchi.tags.includes("물김치") || kimchi.tags.includes("시원함");
      case "regional": return kimchi.region !== "전국";
      case "popular": return ["baechu", "kkakdugi", "dongchimi", "chonggak"].includes(kimchi.id);
      default: return true;
    }
  };

  const sortKimchi = (list: KimchiType[]): KimchiType[] => {
    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "popular": {
          const popular = ["baechu", "kkakdugi", "dongchimi", "chonggak"];
          const ai = popular.indexOf(a.id), bi = popular.indexOf(b.id);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return a.name.localeCompare(b.name, "ko");
        }
        case "spicy": return b.spicyLevel - a.spicyLevel;
        case "fermentation": return b.fermentationLevel - a.fermentationLevel;
        default: return a.name.localeCompare(b.name, "ko");
      }
    });
  };

  const filteredKimchi = sortKimchi(KIMCHI_DATA.filter(filterKimchi));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero + Search */}
        <section className="bg-gradient-to-br from-primary to-accent text-white py-16">
          <div className="container mx-auto px-4">
            <PageHero title={t("title")} description={t("subtitle")} />
            <div className="relative max-w-xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-12 pr-4 py-4 rounded-[var(--radius-lg)] text-foreground bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-40 bg-card border-b border-border py-4">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <FilterBar
              options={categories}
              value={categoryFilter}
              onChange={(v) => setCategoryFilter(v as CategoryFilter)}
              className="flex-1"
            />
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-muted border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none"
              >
                <option value="name">{t("sort.name")}</option>
                <option value="popular">{t("sort.popular")}</option>
                <option value="spicy">{t("sort.spicy")}</option>
                <option value="fermentation">{t("sort.fermentation")}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <p className="text-sm text-muted-foreground mb-6">
              {t("totalTypes", { count: filteredKimchi.length })}
            </p>

            {filteredKimchi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKimchi.map((kimchi) => (
                  <Link key={kimchi.id} href={`/wiki/${kimchi.id}`}>
                    <KimchiCard
                      name={kimchi.name}
                      nameEn={kimchi.nameEn}
                      description={kimchi.description}
                      imageUrl={kimchi.imageUrl}
                      region={kimchi.region}
                      spicyLevel={kimchi.spicyLevel}
                      fermentationLevel={kimchi.fermentationLevel}
                      tags={kimchi.tags}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t("noResults")}
                description={t("noResultsHint")}
              />
            )}
          </div>
        </section>

        {/* Explore */}
        <section className="py-12 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">{t("explore.title")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { href: "/wiki/category/history", bg: "bg-accent/10", title: t("explore.history.title"), desc: t("explore.history.description"), icon: "📜" },
                { href: "/wiki/category/recipe", bg: "bg-secondary-50", title: t("explore.recipe.title"), desc: t("explore.recipe.description"), icon: "👨‍🍳" },
                { href: "/wiki/category/health", bg: "bg-info/10", title: t("explore.health.title"), desc: t("explore.health.description"), icon: "💪" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-6 ${item.bg} rounded-[var(--radius-lg)] hover:shadow-md transition-shadow`}
                >
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
