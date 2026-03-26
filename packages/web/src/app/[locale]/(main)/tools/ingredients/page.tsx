"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChefHat, Check, X, ArrowRight, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { KIMCHI_DATA } from "@/constants/kimchi";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const INGREDIENT_CATEGORIES = [
  {
    name: "주재료",
    emoji: "🥬",
    items: ["배추", "무", "오이", "파", "부추", "갓", "깻잎", "양배추", "열무", "풋배추"],
  },
  {
    name: "양념",
    emoji: "🌶️",
    items: ["고춧가루", "마늘", "생강", "소금", "설탕"],
  },
  {
    name: "젓갈",
    emoji: "🐟",
    items: ["새우젓", "멸치액젓", "까나리액젓", "굴"],
  },
  {
    name: "기타",
    emoji: "🧅",
    items: ["쪽파", "미나리", "무채", "찹쌀풀", "배/사과"],
  },
];

const KIMCHI_INGREDIENTS: Record<string, { required: string[]; optional: string[] }> = {
  baechu: {
    required: ["배추", "고춧가루", "마늘", "소금"],
    optional: ["새우젓", "멸치액젓", "생강", "쪽파", "무채", "찹쌀풀"],
  },
  kkakdugi: {
    required: ["무", "고춧가루", "마늘", "소금"],
    optional: ["새우젓", "멸치액젓", "생강", "쪽파"],
  },
  oisobagi: {
    required: ["오이", "고춧가루", "마늘", "소금"],
    optional: ["부추", "당근", "새우젓"],
  },
  pa: {
    required: ["파", "고춧가루", "마늘", "멸치액젓"],
    optional: ["소금", "설탕", "깨"],
  },
  gat: {
    required: ["갓", "고춧가루", "마늘", "소금"],
    optional: ["멸치액젓", "생강"],
  },
  kkaennip: {
    required: ["깻잎", "고춧가루", "마늘"],
    optional: ["멸치액젓", "소금", "설탕"],
  },
  yangbaechu: {
    required: ["양배추", "고춧가루", "마늘", "소금"],
    optional: ["멸치액젓", "설탕"],
  },
  yeolmu: {
    required: ["열무", "고춧가루", "마늘", "소금"],
    optional: ["멸치액젓", "찹쌀풀"],
  },
  putbaechu: {
    required: ["풋배추", "고춧가루", "마늘", "소금"],
    optional: ["멸치액젓"],
  },
  buchu: {
    required: ["부추", "고춧가루", "마늘"],
    optional: ["멸치액젓", "소금"],
  },
  gulkimchi: {
    required: ["배추", "굴", "고춧가루", "마늘", "소금"],
    optional: ["새우젓", "생강"],
  },
  baek: {
    required: ["배추", "소금", "마늘"],
    optional: ["배/사과", "생강", "쪽파"],
  },
  dongchimi: {
    required: ["무", "소금"],
    optional: ["배/사과", "마늘", "생강", "쪽파"],
  },
  nabak: {
    required: ["무", "배추", "소금", "고춧가루"],
    optional: ["마늘", "생강", "쪽파"],
  },
  chonggak: {
    required: ["무", "고춧가루", "마늘", "소금"],
    optional: ["멸치액젓", "새우젓", "생강"],
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KimchiMatch {
  id: string;
  name: string;
  nameEn: string;
  imageUrl: string;
  matchScore: number;
  missingRequired: string[];
  optionalHave: string[];
  requiredHave: string[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function IngredientsPage() {
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  };

  const resetAll = () => setSelectedIngredients(new Set());

  // Compute matches
  const matches: KimchiMatch[] = useMemo(() => {
    if (selectedIngredients.size === 0) return [];

    const results: KimchiMatch[] = [];

    for (const [kimchiId, recipe] of Object.entries(KIMCHI_INGREDIENTS)) {
      const kimchiInfo = KIMCHI_DATA.find((k) => k.id === kimchiId);
      if (!kimchiInfo) continue;

      const requiredHave = recipe.required.filter((i) => selectedIngredients.has(i));
      const missingRequired = recipe.required.filter((i) => !selectedIngredients.has(i));
      const optionalHave = recipe.optional.filter((i) => selectedIngredients.has(i));
      const matchScore = recipe.required.length > 0
        ? Math.round((requiredHave.length / recipe.required.length) * 100)
        : 0;

      if (matchScore >= 70) {
        results.push({
          id: kimchiId,
          name: kimchiInfo.name,
          nameEn: kimchiInfo.nameEn,
          imageUrl: kimchiInfo.imageUrl,
          matchScore,
          missingRequired,
          optionalHave,
          requiredHave,
        });
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedIngredients]);

  const perfectMatches = matches.filter((m) => m.matchScore === 100);
  const partialMatches = matches.filter((m) => m.matchScore < 100);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Hero */}
        <PageHero
          title="🧊 냉장고 속 재료로 김치 만들기"
          description="가진 재료를 선택하면 만들 수 있는 김치를 추천해드려요"
          className="bg-gradient-to-b from-primary/5 to-transparent"
        />

        <div className="container mx-auto px-4 pb-16 -mt-4">
          {/* Ingredient Selection */}
          <section className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">재료 선택</h2>
                {selectedIngredients.size > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {selectedIngredients.size}개 선택됨
                  </span>
                )}
              </div>
              {selectedIngredients.size > 0 && (
                <Button variant="ghost" size="sm" onClick={resetAll} icon={<RotateCcw className="w-4 h-4" />}>
                  초기화
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {INGREDIENT_CATEGORIES.map((category) => (
                <Card key={category.name} padding="lg">
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">{category.emoji}</span>
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => {
                      const isSelected = selectedIngredients.has(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleIngredient(item)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full
                            border transition-all duration-200
                            ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-sm scale-105"
                                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                            }
                          `}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Results */}
          <section className="max-w-4xl mx-auto">
            {selectedIngredients.size === 0 ? (
              <Card padding="lg" className="text-center py-16">
                <div className="text-5xl mb-4">🧊</div>
                <h3 className="text-lg font-semibold mb-2">냉장고를 열어볼까요?</h3>
                <p className="text-muted-foreground">
                  위에서 가지고 있는 재료를 선택해 주세요
                </p>
              </Card>
            ) : matches.length === 0 ? (
              <Card padding="lg" className="text-center py-16">
                <div className="text-5xl mb-4">😢</div>
                <h3 className="text-lg font-semibold mb-2">아쉽게도 매칭되는 김치가 없어요</h3>
                <p className="text-muted-foreground">
                  재료를 더 추가해 보세요. 기본 양념(고춧가루, 마늘, 소금)이 있으면 더 많은 김치를 만들 수 있어요!
                </p>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Perfect Matches */}
                {perfectMatches.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>바로 만들 수 있어요!</span>
                      <span className="text-lg">✅</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {perfectMatches.length}가지
                      </span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {perfectMatches.map((match) => (
                        <KimchiResultCard key={match.id} match={match} tier="perfect" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Partial Matches */}
                {partialMatches.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>재료 조금만 더 있으면 돼요!</span>
                      <span className="text-lg">🟡</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {partialMatches.length}가지
                      </span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {partialMatches.map((match) => (
                        <KimchiResultCard key={match.id} match={match} tier="partial" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ---------------------------------------------------------------------------
// Result Card Sub-component
// ---------------------------------------------------------------------------

function KimchiResultCard({ match, tier }: { match: KimchiMatch; tier: "perfect" | "partial" }) {
  const borderColor = tier === "perfect" ? "border-success/50" : "border-warning/50";
  const bgColor = tier === "perfect" ? "bg-success/5" : "bg-warning/5";

  return (
    <Card
      hover
      padding="none"
      className={`overflow-hidden ${borderColor} ${bgColor} transition-all duration-300`}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-28 sm:w-32 shrink-0">
          <Image
            src={match.imageUrl}
            alt={match.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, 128px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-base leading-tight">{match.name}</h3>
              <p className="text-xs text-muted-foreground">{match.nameEn}</p>
            </div>
            <span
              className={`text-sm font-bold shrink-0 ${
                match.matchScore === 100 ? "text-success" : "text-warning"
              }`}
            >
              {match.matchScore}%
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            value={match.matchScore}
            size="sm"
            color={match.matchScore === 100 ? "success" : "accent"}
            className="mb-3"
          />

          {/* Tags */}
          <div className="space-y-1.5">
            {/* Ingredients user has */}
            <div className="flex flex-wrap gap-1">
              {match.requiredHave.map((item) => (
                <Tag key={item} className="!bg-success/15 !text-success-dark text-[11px]">
                  <Check className="w-3 h-3 inline mr-0.5" />
                  {item}
                </Tag>
              ))}
              {match.optionalHave.map((item) => (
                <Tag key={item} className="!bg-success/10 !text-success-dark/70 text-[11px]">
                  {item}
                </Tag>
              ))}
            </div>

            {/* Missing ingredients */}
            {match.missingRequired.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {match.missingRequired.map((item) => (
                  <Tag key={item} className="!bg-error/10 !text-error text-[11px]">
                    <X className="w-3 h-3 inline mr-0.5" />
                    {item}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Recipe Link */}
          <Link
            href={`/wiki/${match.id}/recipe`}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark mt-3 transition-colors"
          >
            레시피 보기
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
