"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";

// Nutrition per 100g
const NUTRITION_DATA: Record<
  string,
  {
    nameKo: string;
    nameEn: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    vitaminC: number;
  }
> = {
  baechu: { nameKo: "배추김치", nameEn: "Napa Cabbage Kimchi", calories: 15, carbs: 2.4, protein: 1.1, fat: 0.3, fiber: 1.6, vitaminC: 18 },
  kkakdugi: { nameKo: "깍두기", nameEn: "Cubed Radish Kimchi", calories: 18, carbs: 3.8, protein: 0.7, fat: 0.1, fiber: 1.2, vitaminC: 14 },
  dongchimi: { nameKo: "동치미", nameEn: "Radish Water Kimchi", calories: 8, carbs: 1.5, protein: 0.4, fat: 0.1, fiber: 0.5, vitaminC: 10 },
  chonggak: { nameKo: "총각김치", nameEn: "Ponytail Radish Kimchi", calories: 16, carbs: 3.2, protein: 0.8, fat: 0.2, fiber: 1.4, vitaminC: 12 },
  yeolmu: { nameKo: "열무김치", nameEn: "Young Radish Kimchi", calories: 12, carbs: 2.0, protein: 0.6, fat: 0.1, fiber: 1.0, vitaminC: 15 },
  pa: { nameKo: "파김치", nameEn: "Green Onion Kimchi", calories: 20, carbs: 3.5, protein: 1.2, fat: 0.3, fiber: 1.8, vitaminC: 16 },
  gat: { nameKo: "갓김치", nameEn: "Mustard Leaf Kimchi", calories: 22, carbs: 3.0, protein: 1.5, fat: 0.4, fiber: 2.0, vitaminC: 20 },
  oisobagi: { nameKo: "오이소박이", nameEn: "Stuffed Cucumber Kimchi", calories: 10, carbs: 1.8, protein: 0.5, fat: 0.1, fiber: 0.8, vitaminC: 8 },
  baek: { nameKo: "백김치", nameEn: "White Kimchi", calories: 12, carbs: 2.2, protein: 0.8, fat: 0.1, fiber: 1.0, vitaminC: 15 },
  nabak: { nameKo: "나박김치", nameEn: "Nabak Kimchi", calories: 8, carbs: 1.5, protein: 0.3, fat: 0.1, fiber: 0.4, vitaminC: 10 },
};

// Daily recommended values
const DAILY_VALUES = {
  calories: 2000,
  carbs: 300, // g
  protein: 50, // g
  fat: 65, // g
  fiber: 25, // g
  vitaminC: 90, // mg
};

// Comparison items per 100g
const COMPARE_ITEMS = [
  { nameKo: "콜라 (100ml)", nameEn: "Cola (100ml)", calories: 42 },
  { nameKo: "밥 한 공기 (210g)", nameEn: "Rice Bowl (210g)", calories: 300 },
  { nameKo: "사과 (100g)", nameEn: "Apple (100g)", calories: 52 },
  { nameKo: "치킨 (100g)", nameEn: "Fried Chicken (100g)", calories: 250 },
  { nameKo: "라면 (1봉지)", nameEn: "Ramen (1 pack)", calories: 500 },
];

const NUTRIENT_COLORS: Record<string, string> = {
  carbs: "bg-blue-500",
  protein: "bg-red-500",
  fat: "bg-yellow-500",
  fiber: "bg-green-500",
  vitaminC: "bg-orange-500",
};

const NUTRIENT_BG_COLORS: Record<string, string> = {
  carbs: "bg-blue-100 dark:bg-blue-950",
  protein: "bg-red-100 dark:bg-red-950",
  fat: "bg-yellow-100 dark:bg-yellow-950",
  fiber: "bg-green-100 dark:bg-green-950",
  vitaminC: "bg-orange-100 dark:bg-orange-950",
};

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const decimals = value < 10 ? 1 : 0;
  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function NutrientBar({
  label,
  value,
  dailyValue,
  unit,
  nutrientKey,
}: {
  label: string;
  value: number;
  dailyValue: number;
  unit: string;
  nutrientKey: string;
}) {
  const percent = Math.min((value / dailyValue) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {value.toFixed(1)}
          {unit} ({percent.toFixed(1)}%)
        </span>
      </div>
      <div className={`w-full h-3 rounded-full overflow-hidden ${NUTRIENT_BG_COLORS[nutrientKey]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${NUTRIENT_COLORS[nutrientKey]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function CaloriePage() {
  const locale = useLocale();
  const isKo = locale === "ko";

  const [selectedKimchi, setSelectedKimchi] = useState("baechu");
  const [amount, setAmount] = useState(100);

  const kimchi = NUTRITION_DATA[selectedKimchi];
  const ratio = amount / 100;

  const cal = kimchi.calories * ratio;
  const carbs = kimchi.carbs * ratio;
  const protein = kimchi.protein * ratio;
  const fat = kimchi.fat * ratio;
  const fiber = kimchi.fiber * ratio;
  const vitaminC = kimchi.vitaminC * ratio;

  const nutrientLabels: Record<string, { ko: string; en: string; unit: string }> = {
    carbs: { ko: "탄수화물", en: "Carbs", unit: "g" },
    protein: { ko: "단백질", en: "Protein", unit: "g" },
    fat: { ko: "지방", en: "Fat", unit: "g" },
    fiber: { ko: "식이섬유", en: "Fiber", unit: "g" },
    vitaminC: { ko: "비타민C", en: "Vitamin C", unit: "mg" },
  };

  const nutrients = [
    { key: "carbs", value: carbs, daily: DAILY_VALUES.carbs },
    { key: "protein", value: protein, daily: DAILY_VALUES.protein },
    { key: "fat", value: fat, daily: DAILY_VALUES.fat },
    { key: "fiber", value: fiber, daily: DAILY_VALUES.fiber },
    { key: "vitaminC", value: vitaminC, daily: DAILY_VALUES.vitaminC },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <PageHero
          title={isKo ? "김치 칼로리 계산기" : "Kimchi Calorie Calculator"}
          description={isKo ? "김치의 영양 성분을 한눈에" : "Kimchi nutrition at a glance"}
        />

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Calculator Controls */}
            <Card padding="lg">
              <div className="space-y-6">
                {/* Kimchi Type Selector */}
                <div>
                  <label
                    htmlFor="kimchi-type"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    {isKo ? "김치 종류" : "Kimchi Type"}
                  </label>
                  <select
                    id="kimchi-type"
                    value={selectedKimchi}
                    onChange={(e) => setSelectedKimchi(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-[var(--radius)] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    {Object.entries(NUTRITION_DATA).map(([key, data]) => (
                      <option key={key} value={key}>
                        {isKo ? data.nameKo : data.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    {isKo ? "양 (g)" : "Amount (g)"}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id="amount"
                      type="range"
                      min={10}
                      max={500}
                      step={10}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="flex-1 accent-primary h-2 cursor-pointer"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={amount}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v >= 1 && v <= 1000) setAmount(v);
                        }}
                        className="w-24 px-3 py-2 bg-background border border-border rounded-[var(--radius-sm)] text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                        g
                      </span>
                    </div>
                  </div>
                  {/* Quick amount buttons */}
                  <div className="flex gap-2 mt-3">
                    {[50, 100, 150, 200, 300].map((g) => (
                      <button
                        key={g}
                        onClick={() => setAmount(g)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          amount === g
                            ? "bg-primary text-white border-primary"
                            : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {g}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Calorie Result */}
            <Card padding="lg" className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {isKo ? kimchi.nameKo : kimchi.nameEn} {amount}g
              </p>
              <div className="text-6xl sm:text-7xl font-extrabold text-primary leading-tight">
                <AnimatedNumber value={cal} />
                <span className="text-2xl sm:text-3xl font-semibold text-muted-foreground ml-1">
                  kcal
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isKo
                  ? `일일 권장 칼로리(2,000kcal)의 ${((cal / DAILY_VALUES.calories) * 100).toFixed(1)}%`
                  : `${((cal / DAILY_VALUES.calories) * 100).toFixed(1)}% of daily recommended (2,000kcal)`}
              </p>
            </Card>

            {/* Nutrient Bars */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-foreground mb-5">
                {isKo ? "영양소 상세" : "Nutrition Details"}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {isKo ? "일일 권장량 대비 %" : "% of daily recommended value"}
              </p>
              <div className="space-y-4">
                {nutrients.map((n) => {
                  const info = nutrientLabels[n.key];
                  return (
                    <NutrientBar
                      key={n.key}
                      label={isKo ? info.ko : info.en}
                      value={n.value}
                      dailyValue={n.daily}
                      unit={info.unit}
                      nutrientKey={n.key}
                    />
                  );
                })}
              </div>
            </Card>

            {/* Diet Tip */}
            <Card padding="lg" className="bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0" role="img" aria-label="lightbulb">
                  💡
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {isKo ? "다이어트 팁" : "Diet Tip"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isKo
                      ? `배추김치 100g은 밥 한 공기(300kcal)의 5%밖에 안 돼요! 김치는 낮은 칼로리에 식이섬유와 비타민이 풍부해 다이어트에 아주 좋은 음식이에요.`
                      : `100g of napa cabbage kimchi is only 5% of a bowl of rice (300kcal)! Kimchi is a great diet food — low in calories, rich in fiber and vitamins.`}
                  </p>
                </div>
              </div>
            </Card>

            {/* Comparison Section */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-foreground mb-5">
                {isKo
                  ? `${kimchi.nameKo} ${amount}g vs ...`
                  : `${kimchi.nameEn} ${amount}g vs ...`}
              </h2>
              <div className="space-y-3">
                {COMPARE_ITEMS.map((item) => {
                  const kimchiPercent = Math.min((cal / item.calories) * 100, 100);
                  return (
                    <div key={item.nameKo} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground">
                          {isKo ? item.nameKo : item.nameEn}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          {item.calories} kcal
                        </span>
                      </div>
                      <div className="relative w-full h-6 bg-muted rounded-full overflow-hidden">
                        {/* Comparison item (full bar = its calories) */}
                        <div className="absolute inset-0 bg-muted-foreground/10 rounded-full" />
                        {/* Kimchi portion */}
                        <div
                          className="absolute top-0 left-0 h-full bg-primary/80 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                          style={{ width: `${kimchiPercent}%` }}
                        >
                          {kimchiPercent > 15 && (
                            <span className="text-[10px] font-bold text-white whitespace-nowrap">
                              {cal.toFixed(0)} kcal
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isKo
                          ? `김치가 ${kimchiPercent.toFixed(0)}% 수준`
                          : `Kimchi is ${kimchiPercent.toFixed(0)}% of this`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Summary Nutrient Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nutrients.map((n) => {
                const info = nutrientLabels[n.key];
                return (
                  <Card key={n.key} padding="sm" className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      {isKo ? info.ko : info.en}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedNumber value={n.value} suffix={info.unit} />
                    </p>
                  </Card>
                );
              })}
              <Card padding="sm" className="text-center bg-primary/5">
                <p className="text-xs text-muted-foreground mb-1">
                  {isKo ? "칼로리" : "Calories"}
                </p>
                <p className="text-xl font-bold text-primary">
                  <AnimatedNumber value={cal} suffix="kcal" />
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
