"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Tag from "@/components/ui/Tag";
import { KIMCHI_DATA } from "@/constants/kimchi";
import type { KimchiType } from "@/constants/kimchi";

// Nutrition per 100g (same source as calorie calculator)
const NUTRITION_DATA: Record<
  string,
  { calories: number; carbs: number; protein: number; fiber: number; vitaminC: number }
> = {
  baechu: { calories: 15, carbs: 2.4, protein: 1.1, fiber: 1.6, vitaminC: 18 },
  kkakdugi: { calories: 18, carbs: 3.8, protein: 0.7, fiber: 1.2, vitaminC: 14 },
  dongchimi: { calories: 8, carbs: 1.5, protein: 0.4, fiber: 0.5, vitaminC: 10 },
  chonggak: { calories: 16, carbs: 3.2, protein: 0.8, fiber: 1.4, vitaminC: 12 },
  yeolmu: { calories: 12, carbs: 2.0, protein: 0.6, fiber: 1.0, vitaminC: 15 },
  pa: { calories: 20, carbs: 3.5, protein: 1.2, fiber: 1.8, vitaminC: 16 },
  gat: { calories: 22, carbs: 3.0, protein: 1.5, fiber: 2.0, vitaminC: 20 },
  oisobagi: { calories: 10, carbs: 1.8, protein: 0.5, fiber: 0.8, vitaminC: 8 },
  baek: { calories: 12, carbs: 2.2, protein: 0.8, fiber: 1.0, vitaminC: 15 },
  nabak: { calories: 8, carbs: 1.5, protein: 0.3, fiber: 0.4, vitaminC: 10 },
};

const NUTRIENT_LABELS: Record<string, { ko: string; en: string; unit: string }> = {
  calories: { ko: "칼로리", en: "Calories", unit: "kcal" },
  carbs: { ko: "탄수화물", en: "Carbs", unit: "g" },
  protein: { ko: "단백질", en: "Protein", unit: "g" },
  fiber: { ko: "식이섬유", en: "Fiber", unit: "g" },
  vitaminC: { ko: "비타민C", en: "Vitamin C", unit: "mg" },
};

const TASTE_PROFILES = [
  { key: "spicyLevel" as const, ko: "매운맛", en: "Spiciness", colorLeft: "bg-red-500", colorRight: "bg-orange-500" },
  { key: "fermentationLevel" as const, ko: "발효도", en: "Fermentation", colorLeft: "bg-amber-600", colorRight: "bg-amber-400" },
  { key: "crunchiness" as const, ko: "식감", en: "Crunchiness", colorLeft: "bg-emerald-500", colorRight: "bg-teal-500" },
  { key: "saltiness" as const, ko: "짠맛", en: "Saltiness", colorLeft: "bg-blue-500", colorRight: "bg-sky-500" },
];

function KimchiSelect({
  value,
  onChange,
  excludeId,
  label,
  isKo,
}: {
  value: string;
  onChange: (id: string) => void;
  excludeId?: string;
  label: string;
  isKo: boolean;
}) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius)] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
      >
        <option value="">{isKo ? "-- 김치 선택 --" : "-- Select Kimchi --"}</option>
        {KIMCHI_DATA.map((k) => (
          <option key={k.id} value={k.id} disabled={k.id === excludeId}>
            {isKo ? k.name : k.nameEn}
          </option>
        ))}
      </select>
    </div>
  );
}

function TasteComparisonBar({
  label,
  leftValue,
  rightValue,
  maxValue,
  colorLeft,
  colorRight,
}: {
  label: string;
  leftValue: number;
  rightValue: number;
  maxValue: number;
  colorLeft: string;
  colorRight: string;
}) {
  const leftPercent = (leftValue / maxValue) * 100;
  const rightPercent = (rightValue / maxValue) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-primary">{leftValue}/5</span>
        <span className="text-foreground">{label}</span>
        <span className="text-secondary">{rightValue}/5</span>
      </div>
      <div className="flex gap-1 items-center">
        {/* Left bar (grows from right to left) */}
        <div className="flex-1 flex justify-end">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 right-0 h-full ${colorLeft} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${leftPercent}%` }}
            />
          </div>
        </div>
        <div className="w-px h-6 bg-border shrink-0" />
        {/* Right bar (grows from left to right) */}
        <div className="flex-1">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${colorRight} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${rightPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionComparisonBar({
  label,
  unit,
  leftValue,
  rightValue,
}: {
  label: string;
  unit: string;
  leftValue: number;
  rightValue: number;
}) {
  const maxVal = Math.max(leftValue, rightValue, 1);
  const leftPercent = (leftValue / maxVal) * 100;
  const rightPercent = (rightValue / maxVal) * 100;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground text-center">{label}</p>
      <div className="flex gap-2 items-end h-24">
        {/* Left bar */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-primary">
            {leftValue}{unit}
          </span>
          <div className="w-full bg-muted rounded-t-md overflow-hidden flex items-end" style={{ height: "60px" }}>
            <div
              className="w-full bg-primary/80 rounded-t-md transition-all duration-500 ease-out"
              style={{ height: `${leftPercent}%` }}
            />
          </div>
        </div>
        {/* Right bar */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-secondary">
            {rightValue}{unit}
          </span>
          <div className="w-full bg-muted rounded-t-md overflow-hidden flex items-end" style={{ height: "60px" }}>
            <div
              className="w-full bg-secondary/80 rounded-t-md transition-all duration-500 ease-out"
              style={{ height: `${rightPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const locale = useLocale();
  const isKo = locale === "ko";

  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");

  const leftKimchi = KIMCHI_DATA.find((k) => k.id === leftId);
  const rightKimchi = KIMCHI_DATA.find((k) => k.id === rightId);
  const bothSelected = leftKimchi && rightKimchi;

  // Find common and unique ingredients
  const ingredientAnalysis = useMemo(() => {
    if (!leftKimchi || !rightKimchi) return null;
    const leftSet = new Set(leftKimchi.mainIngredients);
    const rightSet = new Set(rightKimchi.mainIngredients);
    const common = leftKimchi.mainIngredients.filter((i) => rightSet.has(i));
    const leftOnly = leftKimchi.mainIngredients.filter((i) => !rightSet.has(i));
    const rightOnly = rightKimchi.mainIngredients.filter((i) => !leftSet.has(i));
    return { common, leftOnly, rightOnly };
  }, [leftKimchi, rightKimchi]);

  // Conclusion recommendations
  const conclusions = useMemo(() => {
    if (!leftKimchi || !rightKimchi) return [];
    const items: { label: string; winner: KimchiType }[] = [];

    if (leftKimchi.spicyLevel !== rightKimchi.spicyLevel) {
      items.push({
        label: isKo ? "매운맛을 좋아한다면" : "If you like spiciness",
        winner: leftKimchi.spicyLevel > rightKimchi.spicyLevel ? leftKimchi : rightKimchi,
      });
    }
    if (leftKimchi.fermentationLevel !== rightKimchi.fermentationLevel) {
      items.push({
        label: isKo ? "발효향을 원한다면" : "If you want fermented flavor",
        winner: leftKimchi.fermentationLevel > rightKimchi.fermentationLevel ? leftKimchi : rightKimchi,
      });
    }
    if (leftKimchi.crunchiness !== rightKimchi.crunchiness) {
      items.push({
        label: isKo ? "아삭한 식감이라면" : "If you prefer crunchiness",
        winner: leftKimchi.crunchiness > rightKimchi.crunchiness ? leftKimchi : rightKimchi,
      });
    }
    if (leftKimchi.saltiness !== rightKimchi.saltiness) {
      items.push({
        label: isKo ? "짭짤한 맛을 원한다면" : "If you want saltiness",
        winner: leftKimchi.saltiness > rightKimchi.saltiness ? leftKimchi : rightKimchi,
      });
    }
    return items;
  }, [leftKimchi, rightKimchi, isKo]);

  const leftNutrition = leftId ? NUTRITION_DATA[leftId] : null;
  const rightNutrition = rightId ? NUTRITION_DATA[rightId] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <PageHero
          title={isKo ? "김치 비교" : "Kimchi Comparison"}
          description={isKo ? "두 가지 김치를 나란히 비교해보세요" : "Compare two kimchi types side by side"}
        />

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Selection */}
            <Card padding="lg">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <KimchiSelect
                  value={leftId}
                  onChange={setLeftId}
                  excludeId={rightId}
                  label={isKo ? "첫 번째 김치" : "First Kimchi"}
                  isKo={isKo}
                />
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground text-lg font-bold shrink-0 mb-0.5">
                  VS
                </div>
                <KimchiSelect
                  value={rightId}
                  onChange={setRightId}
                  excludeId={leftId}
                  label={isKo ? "두 번째 김치" : "Second Kimchi"}
                  isKo={isKo}
                />
              </div>
            </Card>

            {!bothSelected && (
              <Card padding="lg" className="text-center">
                <div className="py-8">
                  <p className="text-4xl mb-4">&#x2696;&#xFE0F;</p>
                  <p className="text-muted-foreground">
                    {isKo
                      ? "비교할 두 가지 김치를 선택해주세요"
                      : "Select two kimchi types to compare"}
                  </p>
                </div>
              </Card>
            )}

            {bothSelected && leftKimchi && rightKimchi && (
              <>
                {/* 1. Basic Info Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[leftKimchi, rightKimchi].map((kimchi, idx) => (
                    <Card key={kimchi.id} padding="none" className="overflow-hidden">
                      <div className="relative w-full aspect-[4/3] bg-muted">
                        <Image
                          src={kimchi.imageUrl}
                          alt={isKo ? kimchi.name : kimchi.nameEn}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                          unoptimized
                        />
                        <div className={`absolute top-3 ${idx === 0 ? "left-3" : "right-3"}`}>
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white ${idx === 0 ? "bg-primary" : "bg-secondary"}`}>
                            {idx === 0 ? "A" : "B"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-xl font-bold text-foreground">
                          {isKo ? kimchi.name : kimchi.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {isKo ? kimchi.nameEn : kimchi.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Tag variant="primary">{kimchi.region}</Tag>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {kimchi.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 2. Taste Profile Comparison */}
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    {isKo ? "맛 프로필 비교" : "Taste Profile Comparison"}
                  </h2>
                  <div className="flex justify-between text-xs text-muted-foreground mb-5">
                    <span className="text-primary font-semibold">{isKo ? leftKimchi.name : leftKimchi.nameEn}</span>
                    <span className="text-secondary font-semibold">{isKo ? rightKimchi.name : rightKimchi.nameEn}</span>
                  </div>
                  <div className="space-y-5">
                    {TASTE_PROFILES.map((profile) => (
                      <TasteComparisonBar
                        key={profile.key}
                        label={isKo ? profile.ko : profile.en}
                        leftValue={leftKimchi[profile.key]}
                        rightValue={rightKimchi[profile.key]}
                        maxValue={5}
                        colorLeft={profile.colorLeft}
                        colorRight={profile.colorRight}
                      />
                    ))}
                  </div>
                </Card>

                {/* 3. Nutrition Comparison */}
                {leftNutrition && rightNutrition && (
                  <Card padding="lg">
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      {isKo ? "영양 비교 (100g 기준)" : "Nutrition Comparison (per 100g)"}
                    </h2>
                    <div className="flex justify-between text-xs text-muted-foreground mb-5">
                      <span className="text-primary font-semibold">{isKo ? leftKimchi.name : leftKimchi.nameEn}</span>
                      <span className="text-secondary font-semibold">{isKo ? rightKimchi.name : rightKimchi.nameEn}</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                      {(Object.keys(NUTRIENT_LABELS) as (keyof typeof NUTRIENT_LABELS)[]).map((key) => {
                        const info = NUTRIENT_LABELS[key];
                        const lv = leftNutrition[key as keyof typeof leftNutrition];
                        const rv = rightNutrition[key as keyof typeof rightNutrition];
                        return (
                          <NutritionComparisonBar
                            key={key}
                            label={isKo ? info.ko : info.en}
                            unit={info.unit}
                            leftValue={lv}
                            rightValue={rv}
                          />
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* 4. Ingredients Comparison */}
                {ingredientAnalysis && (
                  <Card padding="lg">
                    <h2 className="text-lg font-semibold text-foreground mb-5">
                      {isKo ? "재료 비교" : "Ingredients Comparison"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Left only */}
                      <div>
                        <p className="text-sm font-semibold text-primary mb-2">
                          {isKo ? `${leftKimchi.name}만의 재료` : `Only in ${leftKimchi.nameEn}`}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ingredientAnalysis.leftOnly.length > 0 ? (
                            ingredientAnalysis.leftOnly.map((ing) => (
                              <Tag key={ing} variant="primary">{ing}</Tag>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">{isKo ? "없음" : "None"}</span>
                          )}
                        </div>
                      </div>
                      {/* Common */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">
                          {isKo ? "공통 재료" : "Common Ingredients"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ingredientAnalysis.common.length > 0 ? (
                            ingredientAnalysis.common.map((ing) => (
                              <Tag key={ing} variant="accent">{ing}</Tag>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">{isKo ? "없음" : "None"}</span>
                          )}
                        </div>
                      </div>
                      {/* Right only */}
                      <div>
                        <p className="text-sm font-semibold text-secondary mb-2">
                          {isKo ? `${rightKimchi.name}만의 재료` : `Only in ${rightKimchi.nameEn}`}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ingredientAnalysis.rightOnly.length > 0 ? (
                            ingredientAnalysis.rightOnly.map((ing) => (
                              <Tag key={ing} variant="secondary">{ing}</Tag>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">{isKo ? "없음" : "None"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 5. Best Pairings */}
                <Card padding="lg">
                  <h2 className="text-lg font-semibold text-foreground mb-5">
                    {isKo ? "추천 용도" : "Best Pairings"}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { kimchi: leftKimchi, color: "primary" as const },
                      { kimchi: rightKimchi, color: "secondary" as const },
                    ].map(({ kimchi, color }) => (
                      <div key={kimchi.id}>
                        <p className={`text-sm font-semibold text-${color} mb-2`}>
                          {isKo ? kimchi.name : kimchi.nameEn}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {kimchi.bestWith.map((item) => (
                            <Tag key={item} variant={color === "primary" ? "primary" : "secondary"}>
                              {item}
                            </Tag>
                          ))}
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1.5">
                            {isKo ? "건강 효능" : "Health Benefits"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {kimchi.healthBenefits.map((benefit) => (
                              <span
                                key={benefit}
                                className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 6. Conclusion */}
                {conclusions.length > 0 && (
                  <Card padding="lg" className="bg-primary/5 border-primary/20">
                    <h2 className="text-lg font-semibold text-foreground mb-5">
                      {isKo ? "결론" : "Conclusion"}
                    </h2>
                    <div className="space-y-3">
                      {conclusions.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between gap-4 p-3 bg-background rounded-[var(--radius)] border border-border"
                        >
                          <span className="text-sm text-foreground font-medium">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold shrink-0">
                            <span className="text-primary">
                              &rarr; {isKo ? item.winner.name : item.winner.nameEn}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
