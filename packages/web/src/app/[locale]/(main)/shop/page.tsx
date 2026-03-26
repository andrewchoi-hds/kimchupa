"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import FilterBar from "@/components/ui/FilterBar";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

/* ─── Types ─── */
interface StorePrice {
  store: string;
  price: number;
  originalPrice?: number;
  url: string;
  logo: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  prices: StorePrice[];
  rating: number;
  reviewCount: number;
  type: string;
  weight: string;
  tags: string[];
}

/* ─── Data ─── */
const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "종가집 포기김치 1.9kg",
    brand: "종가집",
    prices: [
      { store: "쿠팡", price: 18900, originalPrice: 22000, url: "#", logo: "🛒" },
      { store: "네이버", price: 19500, url: "#", logo: "🟢" },
      { store: "마켓컬리", price: 20900, url: "#", logo: "🟣" },
    ],
    rating: 4.7,
    reviewCount: 3842,
    type: "배추김치",
    weight: "1.9kg",
    tags: ["베스트셀러", "국내산"],
  },
  {
    id: "p2",
    name: "비비고 썰은김치 1.5kg",
    brand: "비비고",
    prices: [
      { store: "쿠팡", price: 15900, url: "#", logo: "🛒" },
      { store: "네이버", price: 16200, url: "#", logo: "🟢" },
    ],
    rating: 4.5,
    reviewCount: 2156,
    type: "배추김치",
    weight: "1.5kg",
    tags: ["간편식"],
  },
  {
    id: "p3",
    name: "하선정 총각김치 1.2kg",
    brand: "하선정",
    prices: [
      { store: "네이버", price: 16500, originalPrice: 19000, url: "#", logo: "🟢" },
      { store: "쿠팡", price: 17200, url: "#", logo: "🛒" },
    ],
    rating: 4.6,
    reviewCount: 892,
    type: "총각김치",
    weight: "1.2kg",
    tags: ["할인"],
  },
  {
    id: "p4",
    name: "풀무원 깍두기 1kg",
    brand: "풀무원",
    prices: [
      { store: "쿠팡", price: 12900, url: "#", logo: "🛒" },
      { store: "마켓컬리", price: 13500, url: "#", logo: "🟣" },
    ],
    rating: 4.4,
    reviewCount: 1245,
    type: "깍두기",
    weight: "1kg",
    tags: [],
  },
  {
    id: "p5",
    name: "김치명가 동치미 1L",
    brand: "김치명가",
    prices: [{ store: "네이버", price: 8900, url: "#", logo: "🟢" }],
    rating: 4.3,
    reviewCount: 567,
    type: "동치미",
    weight: "1L",
    tags: ["시원함"],
  },
  {
    id: "p6",
    name: "종가집 맛김치 1kg",
    brand: "종가집",
    prices: [
      { store: "쿠팡", price: 14500, url: "#", logo: "🛒" },
      { store: "네이버", price: 14900, url: "#", logo: "🟢" },
      { store: "마켓컬리", price: 15500, url: "#", logo: "🟣" },
    ],
    rating: 4.6,
    reviewCount: 2891,
    type: "배추김치",
    weight: "1kg",
    tags: ["인기"],
  },
];

const TYPE_FILTERS = [
  { value: "all", label: "전체" },
  { value: "배추김치", label: "배추김치" },
  { value: "깍두기", label: "깍두기" },
  { value: "총각김치", label: "총각김치" },
  { value: "동치미", label: "동치미" },
  { value: "맛김치", label: "맛김치" },
];

type SortOption = "price-low" | "price-high" | "popular" | "rating";

/* ─── Helpers ─── */
function formatWon(price: number): string {
  return price.toLocaleString("ko-KR") + "원";
}

function getLowestPrice(product: Product): number {
  return Math.min(...product.prices.map((p) => p.price));
}

function getDiscountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

/* ─── Component ─── */
export default function ShopPage() {
  const { data: session } = useSession();
  const levels = useTranslations("levels");

  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("price-low");

  const user = session?.user
    ? {
        nickname: session.user.name || "User",
        level: 1,
        levelName: levels("1"),
        xp: 0,
        profileImage: session.user.image || undefined,
      }
    : null;

  const filtered = useMemo(() => {
    let list =
      typeFilter === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.type === typeFilter);

    switch (sortBy) {
      case "price-low":
        list = [...list].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case "price-high":
        list = [...list].sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case "popular":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [typeFilter, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
          <PageHero
            title="🛒 김치 구매 가이드"
            description="최고의 김치를 최저가로 만나보세요"
            className="py-14 sm:py-20"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Filter + Sort Bar */}
          <Card padding="md" className="mb-8 sticky top-16 z-30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <FilterBar
                  options={TYPE_FILTERS}
                  value={typeFilter}
                  onChange={setTypeFilter}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-muted text-foreground text-sm rounded-[var(--radius-sm)] border-none outline-none cursor-pointer"
              >
                <option value="price-low">낮은가격순</option>
                <option value="price-high">높은가격순</option>
                <option value="popular">인기순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </Card>

          {/* Product Count */}
          <p className="text-sm text-muted-foreground mb-4">
            총 <span className="font-semibold text-foreground">{filtered.length}</span>개 상품
          </p>

          {/* Product Cards */}
          <div className="flex flex-col gap-6">
            {filtered.map((product) => {
              const lowestPrice = getLowestPrice(product);

              return (
                <Card key={product.id} hover padding="none" className="overflow-hidden">
                  <div className="p-5 sm:p-6">
                    {/* Top: Name, brand, weight, rating, tags */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg sm:text-xl font-bold text-foreground">
                            {product.name}
                          </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.brand} · {product.weight}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Tags */}
                        <div className="flex gap-1.5 flex-wrap">
                          {product.tags.map((tag) => (
                            <Tag
                              key={tag}
                              variant={
                                tag === "베스트셀러"
                                  ? "primary"
                                  : tag === "할인"
                                    ? "accent"
                                    : tag === "인기"
                                      ? "secondary"
                                      : "default"
                              }
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-amber-500 tracking-tight">
                            {renderStars(product.rating)}
                          </span>
                          <span className="font-semibold text-foreground">{product.rating}</span>
                          <span className="text-muted-foreground">
                            ({product.reviewCount.toLocaleString("ko-KR")})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left py-2 pr-4 font-medium">스토어</th>
                            <th className="text-right py-2 pr-4 font-medium">정가</th>
                            <th className="text-right py-2 pr-4 font-medium">판매가</th>
                            <th className="text-right py-2 pr-4 font-medium">할인율</th>
                            <th className="text-right py-2 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.prices.map((sp) => {
                            const isLowest = sp.price === lowestPrice;
                            const discount = sp.originalPrice
                              ? getDiscountPercent(sp.originalPrice, sp.price)
                              : null;

                            return (
                              <tr
                                key={sp.store}
                                className={`border-b last:border-b-0 border-border/50 ${
                                  isLowest ? "bg-secondary-50" : ""
                                }`}
                              >
                                {/* Store */}
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{sp.logo}</span>
                                    <span className="font-medium text-foreground">
                                      {sp.store}
                                    </span>
                                    {isLowest && (
                                      <span className="text-xs font-bold text-secondary px-1.5 py-0.5 bg-secondary-50 rounded-full border border-secondary/20">
                                        최저가
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Original Price */}
                                <td className="py-3 pr-4 text-right text-muted-foreground">
                                  {sp.originalPrice ? (
                                    <span className="line-through">
                                      {formatWon(sp.originalPrice)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground/50">-</span>
                                  )}
                                </td>

                                {/* Sale Price */}
                                <td className="py-3 pr-4 text-right">
                                  <span
                                    className={`font-bold text-base ${
                                      isLowest ? "text-secondary-dark" : "text-foreground"
                                    }`}
                                  >
                                    {formatWon(sp.price)}
                                  </span>
                                </td>

                                {/* Discount % */}
                                <td className="py-3 pr-4 text-right">
                                  {discount ? (
                                    <span className="font-semibold text-primary">
                                      -{discount}%
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground/50">-</span>
                                  )}
                                </td>

                                {/* Buy Button */}
                                <td className="py-3 text-right">
                                  <a href={sp.url} target="_blank" rel="noopener noreferrer">
                                    <Button
                                      size="sm"
                                      variant={isLowest ? "primary" : "outline"}
                                    >
                                      구매하기
                                    </Button>
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">🔍</span>
              <p className="text-xl text-muted-foreground">
                해당 종류의 김치 상품이 없습니다
              </p>
            </div>
          )}

          {/* Affiliate Disclaimer */}
          <Card padding="lg" className="mt-12 bg-muted/50">
            <h3 className="font-semibold text-foreground mb-2 text-sm">
              제휴 안내
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              본 페이지의 상품 링크는 제휴(어필리에이트) 링크를 포함하고 있습니다.
              링크를 통해 구매하시면 김추페에 소정의 수수료가 지급되며,
              구매자에게 추가 비용은 발생하지 않습니다.
              가격 정보는 최종 업데이트 시점 기준이며, 실제 판매 가격과 다를 수 있습니다.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
