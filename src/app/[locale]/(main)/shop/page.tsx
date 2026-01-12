"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  AFFILIATE_PRODUCTS,
  AFFILIATE_PARTNERS,
  formatPrice,
  getDiscountPercent,
  type AffiliateProduct,
} from "@/constants/affiliateProducts";
import { handleAffiliateClick } from "@/lib/affiliate";

type PartnerFilter = "all" | "coupang" | "naver" | "amazon" | "iherb";
type CategoryFilter = "all" | "kimchi" | "ingredient" | "equipment";

export default function ShopPage() {
  const { data: session } = useSession();
  const t = useTranslations("shop");
  const levels = useTranslations("levels");

  const [partnerFilter, setPartnerFilter] = useState<PartnerFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");

  const user = session?.user
    ? {
        nickname: session.user.name || "User",
        level: 1,
        levelName: levels("1"),
        xp: 0,
        profileImage: session.user.image || undefined,
      }
    : null;

  const filterProducts = (product: AffiliateProduct) => {
    if (partnerFilter !== "all" && product.partner !== partnerFilter) return false;

    if (categoryFilter !== "all") {
      const isKimchi = product.kimchiType !== undefined;
      const isIngredient = product.tags.some((tag) =>
        ["재료", "양념", "고춧가루"].includes(tag)
      );
      const isEquipment = product.tags.some((tag) =>
        ["용기", "가전", "김치냉장고", "항아리"].includes(tag)
      );

      if (categoryFilter === "kimchi" && !isKimchi) return false;
      if (categoryFilter === "ingredient" && !isIngredient) return false;
      if (categoryFilter === "equipment" && !isEquipment) return false;
    }

    return true;
  };

  const sortProducts = (a: AffiliateProduct, b: AffiliateProduct) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return b.reviewCount - a.reviewCount;
    }
  };

  const filteredProducts = AFFILIATE_PRODUCTS.filter(filterProducts).sort(sortProducts);

  const handleProductClick = (product: AffiliateProduct) => {
    handleAffiliateClick(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={user} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-lg text-white/90 mb-4">
                {t("subtitle")}
              </p>
              <p className="text-sm text-white/70">
                * {t("affiliateNotice")}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 sticky top-16 z-30">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Partner Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                <button
                  onClick={() => setPartnerFilter("all")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    partnerFilter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {t("filter.all")}
                </button>
                {Object.entries(AFFILIATE_PARTNERS).map(([key, partner]) => (
                  <button
                    key={key}
                    onClick={() => setPartnerFilter(key as PartnerFilter)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      partnerFilter === key
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span>{partner.logo}</span>
                    <span>{partner.name}</span>
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 lg:ml-auto">
                {[
                  { id: "all", label: t("filter.all") },
                  { id: "kimchi", label: t("filter.kimchi") },
                  { id: "ingredient", label: t("filter.ingredient") },
                  { id: "equipment", label: t("filter.equipment") },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as CategoryFilter)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      categoryFilter === cat.id
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-sm border-none"
              >
                <option value="popular">{t("sort.popular")}</option>
                <option value="price-low">{t("sort.priceLow")}</option>
                <option value="price-high">{t("sort.priceHigh")}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const partner = AFFILIATE_PARTNERS[product.partner];
              const discount = getDiscountPercent(product.price, product.originalPrice);

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                    <span className="text-6xl">🥬</span>

                    {/* Partner Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${partner.color}`}>
                      {partner.logo} {partner.name}
                    </div>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-400">
                        ({product.reviewCount.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-xl font-bold text-zinc-900 dark:text-white">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-zinc-400 line-through">
                          {formatPrice(product.originalPrice, product.currency)}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-500 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <span>{t("buyNow")}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                {t("noProducts")}
              </p>
            </div>
          )}

          {/* Affiliate Disclosure */}
          <div className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-3">
              {t("affiliateNotice")}
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(AFFILIATE_PARTNERS).map(([key, partner]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-700 rounded-lg"
                >
                  <span className="text-xl">{partner.logo}</span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white text-sm">
                      {partner.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {partner.commissionRate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
