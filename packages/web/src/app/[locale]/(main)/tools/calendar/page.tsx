"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";

interface MonthData {
  month: number;
  name: string;
  emoji: string;
  kimchi: string[];
  tip: string;
  seasonal: string[];
  color: string;
}

const MONTHLY_KIMCHI: MonthData[] = [
  { month: 1, name: "1월", emoji: "❄️", kimchi: ["동치미", "깍두기"], tip: "겨울철 시원한 동치미가 제격", seasonal: ["무", "배추"], color: "bg-blue-50 dark:bg-blue-950/30" },
  { month: 2, name: "2월", emoji: "🌨️", kimchi: ["백김치", "나박김치"], tip: "입춘을 앞두고 산뜻한 김치 준비", seasonal: ["무", "쪽파"], color: "bg-blue-50 dark:bg-blue-950/30" },
  { month: 3, name: "3월", emoji: "🌸", kimchi: ["달래김치", "냉이김치"], tip: "봄나물로 향긋한 김치 담그기", seasonal: ["달래", "냉이", "부추"], color: "bg-pink-50 dark:bg-pink-950/30" },
  { month: 4, name: "4월", emoji: "🌷", kimchi: ["부추김치", "파김치"], tip: "봄 파와 부추가 가장 연한 시기", seasonal: ["부추", "파", "쪽파"], color: "bg-pink-50 dark:bg-pink-950/30" },
  { month: 5, name: "5월", emoji: "🌿", kimchi: ["열무김치", "풋배추김치"], tip: "열무가 나오기 시작하는 계절", seasonal: ["열무", "풋배추", "상추"], color: "bg-green-50 dark:bg-green-950/30" },
  { month: 6, name: "6월", emoji: "☀️", kimchi: ["오이소박이", "열무김치"], tip: "여름 오이소박이 시즌 시작!", seasonal: ["오이", "열무", "깻잎"], color: "bg-green-50 dark:bg-green-950/30" },
  { month: 7, name: "7월", emoji: "🌊", kimchi: ["오이소박이", "양배추김치"], tip: "시원한 물김치와 오이소박이", seasonal: ["오이", "양배추"], color: "bg-cyan-50 dark:bg-cyan-950/30" },
  { month: 8, name: "8월", emoji: "🔥", kimchi: ["가지김치", "깻잎김치"], tip: "가지와 깻잎이 풍성한 시기", seasonal: ["가지", "깻잎", "고추"], color: "bg-orange-50 dark:bg-orange-950/30" },
  { month: 9, name: "9월", emoji: "🍂", kimchi: ["갓김치", "고들빼기김치"], tip: "가을 갓으로 담근 갓김치의 계절", seasonal: ["갓", "고들빼기"], color: "bg-amber-50 dark:bg-amber-950/30" },
  { month: 10, name: "10월", emoji: "🍁", kimchi: ["총각김치", "석박지"], tip: "김장 준비! 총각무가 나오는 시기", seasonal: ["총각무", "배추"], color: "bg-amber-50 dark:bg-amber-950/30" },
  { month: 11, name: "11월", emoji: "🥬", kimchi: ["배추김치", "보쌈김치"], tip: "김장 시즌! 배추김치를 담그는 달", seasonal: ["배추", "무", "갓"], color: "bg-red-50 dark:bg-red-950/30" },
  { month: 12, name: "12월", emoji: "⛄", kimchi: ["배추김치", "동치미"], tip: "김장 마무리와 겨울 동치미", seasonal: ["배추", "무"], color: "bg-red-50 dark:bg-red-950/30" },
];

const SEASON_LABELS: Record<string, { ko: string; en: string; emoji: string }> = {
  winter: { ko: "겨울", en: "Winter", emoji: "❄️" },
  spring: { ko: "봄", en: "Spring", emoji: "🌸" },
  summer: { ko: "여름", en: "Summer", emoji: "☀️" },
  autumn: { ko: "가을", en: "Autumn", emoji: "🍂" },
};

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export default function CalendarPage() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const currentMonth = new Date().getMonth() + 1;
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const currentData = MONTHLY_KIMCHI[currentMonth - 1];
  const currentSeason = getSeason(currentMonth);
  const seasonInfo = SEASON_LABELS[currentSeason];

  const handleMonthClick = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <PageHero
          title={isKo ? "김치 시즌 캘린더" : "Kimchi Season Calendar"}
          description={
            isKo
              ? "매달 어떤 김치를 담그면 좋을까요?"
              : "What kimchi should you make each month?"
          }
        />

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Current Month Hero Card */}
            <Card padding="lg" className={`${currentData.color} border-primary/30 ring-2 ring-primary/20`}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-6xl sm:text-7xl shrink-0" role="img" aria-label={currentData.name}>
                  {currentData.emoji}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <Tag variant="primary">
                      {seasonInfo.emoji} {isKo ? seasonInfo.ko : seasonInfo.en}
                    </Tag>
                    <Tag variant="accent">
                      {isKo ? "이번 달 추천" : "This Month"}
                    </Tag>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {currentData.name} {isKo ? "추천 김치" : "Recommended Kimchi"}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    {currentData.kimchi.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full bg-primary text-white"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentData.tip}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground mr-1">
                      {isKo ? "제철 재료:" : "Seasonal:"}
                    </span>
                    {currentData.seasonal.map((item) => (
                      <Tag key={item} variant="secondary">
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 12-Month Grid */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                {isKo ? "월별 김치 캘린더" : "Monthly Kimchi Calendar"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {MONTHLY_KIMCHI.map((data) => {
                  const isCurrent = data.month === currentMonth;
                  const isExpanded = expandedMonth === data.month;

                  return (
                    <div key={data.month} className={isExpanded ? "col-span-2 sm:col-span-3 lg:col-span-4" : ""}>
                      <Card
                        hover
                        padding="none"
                        className={`overflow-hidden transition-all duration-300 ${data.color} ${
                          isCurrent
                            ? "ring-2 ring-primary shadow-lg shadow-primary/10"
                            : ""
                        }`}
                        onClick={() => handleMonthClick(data.month)}
                      >
                        <div className="p-4 sm:p-5">
                          {/* Month Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" role="img" aria-label={data.name}>
                                {data.emoji}
                              </span>
                              <span className="text-lg font-bold text-foreground">
                                {data.name}
                              </span>
                            </div>
                            {isCurrent && (
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                              </span>
                            )}
                          </div>

                          {/* Kimchi Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {data.kimchi.map((name) => (
                              <Tag key={name} variant="primary">
                                {name}
                              </Tag>
                            ))}
                          </div>

                          {/* Seasonal Ingredients (compact) */}
                          <div className="flex flex-wrap items-center gap-1">
                            {data.seasonal.map((item) => (
                              <Tag key={item} variant="default">
                                {item}
                              </Tag>
                            ))}
                          </div>

                          {/* Tip - always visible in compact form */}
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                            {data.tip}
                          </p>

                          {/* Expanded Detail */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-slide-up">
                              {/* Recommended Kimchi Detail */}
                              <div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                  {isKo ? "추천 김치" : "Recommended Kimchi"}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {data.kimchi.map((name) => (
                                    <a
                                      key={name}
                                      href={`/${locale}/wiki?search=${encodeURIComponent(name)}`}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-[var(--radius)] bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span>📖</span>
                                      {name}
                                      <span className="text-xs opacity-60">→</span>
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Seasonal Ingredients Detail */}
                              <div>
                                <h3 className="text-sm font-semibold text-foreground mb-2">
                                  {isKo ? "제철 재료" : "Seasonal Ingredients"}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {data.seasonal.map((item) => (
                                    <span
                                      key={item}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-[var(--radius)] bg-secondary-50 text-secondary-dark dark:bg-secondary-50/10"
                                    >
                                      <span>🥬</span>
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Tip */}
                              <div className="flex items-start gap-2 p-3 rounded-[var(--radius)] bg-background/60">
                                <span className="text-lg shrink-0">💡</span>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {data.tip}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Summary */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                {isKo ? "계절별 요약" : "Seasonal Summary"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(SEASON_LABELS).map(([key, info]) => {
                  const seasonMonths = MONTHLY_KIMCHI.filter(
                    (d) => getSeason(d.month) === key
                  );
                  const allKimchi = [...new Set(seasonMonths.flatMap((m) => m.kimchi))];
                  const allSeasonal = [...new Set(seasonMonths.flatMap((m) => m.seasonal))];

                  return (
                    <Card key={key} padding="md">
                      <div className="text-center mb-3">
                        <span className="text-3xl">{info.emoji}</span>
                        <h3 className="text-base font-bold text-foreground mt-1">
                          {isKo ? info.ko : info.en}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {seasonMonths.map((m) => m.name).join(" · ")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {isKo ? "대표 김치" : "Key Kimchi"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {allKimchi.map((name) => (
                              <Tag key={name} variant="primary">
                                {name}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {isKo ? "제철 재료" : "Seasonal"}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {allSeasonal.map((item) => (
                              <Tag key={item} variant="secondary">
                                {item}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
