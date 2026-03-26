"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import FilterBar from "@/components/ui/FilterBar";
import Card from "@/components/ui/Card";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  emoji: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: "보관",
    emoji: "🧊",
    items: [
      { q: "김치는 얼마나 오래 보관할 수 있나요?", a: "냉장 보관 시 2~3개월, 김치냉장고는 6개월까지 가능합니다. 밀폐 용기에 담아 김칫국물에 잠기도록 보관하세요." },
      { q: "김치가 너무 시어졌는데 버려야 하나요?", a: "절대 아닙니다! 신김치는 김치찌개, 김치볶음밥, 김치전에 활용하면 더 맛있습니다. 오히려 잘 익은 김치가 요리에 최고예요." },
      { q: "김치를 냉동 보관해도 되나요?", a: "가능합니다. 소분하여 냉동하면 3~6개월 보관 가능합니다. 해동 후에는 볶음이나 찌개 등 요리용으로 사용하세요." },
      { q: "김치에서 하얀 것이 생겼는데 곰팡이인가요?", a: "표면의 하얀 막은 대부분 효모(산막효모)로, 해롭지 않습니다. 걷어내고 드시면 됩니다. 단, 초록/검은 곰팡이는 버려야 합니다." },
      { q: "김치냉장고가 꼭 필요한가요?", a: "필수는 아니지만 권장합니다. 일반 냉장고(4°C)보다 김치냉장고(-1~0°C)가 발효 속도를 늦춰 더 오래 맛있게 보관됩니다." },
    ],
  },
  {
    category: "발효",
    emoji: "🫙",
    items: [
      { q: "김치가 익는 데 얼마나 걸리나요?", a: "실온(20°C)에서 1~2일, 냉장(4°C)에서 1~2주 정도 걸립니다. 온도가 높을수록 빨리 익습니다." },
      { q: "김치 발효 중 기포가 나오는데 정상인가요?", a: "완전히 정상입니다! 유산균이 활발하게 활동하며 이산화탄소를 생성하는 것입니다. 좋은 발효가 진행 중이라는 신호예요." },
      { q: "김치가 너무 빨리 시어지는 이유는?", a: "온도가 높거나, 설탕을 많이 넣었거나, 밀봉이 안 된 경우입니다. 저온 보관하고 김치가 국물에 잠기도록 눌러주세요." },
      { q: "김치에서 톡 쏘는 맛이 나는데 괜찮나요?", a: "탄산 느낌은 정상적인 발효 과정입니다. 유산균이 만든 CO2로, 신선하게 발효되고 있다는 의미입니다." },
    ],
  },
  {
    category: "재료",
    emoji: "🥬",
    items: [
      { q: "고춧가루는 어떤 것을 써야 하나요?", a: "김치용 고춧가루(굵은 고춧가루)를 사용하세요. 태양초 고춧가루가 색과 맛이 좋습니다. 중국산보다 국산이 풍미가 뛰어납니다." },
      { q: "젓갈 대신 다른 걸 넣어도 되나요?", a: "채식 김치를 원하면 간장, 된장, 표고버섯 육수로 대체 가능합니다. 맛은 다르지만 맛있는 김치를 만들 수 있어요." },
      { q: "소금은 어떤 걸 써야 하나요?", a: "천일염(굵은 소금)을 사용하세요. 정제 소금은 쓴맛이 나고 발효에 좋지 않습니다. 3년 묵은 천일염이 가장 좋습니다." },
      { q: "김치에 설탕을 넣어도 되나요?", a: "소량은 괜찮지만 많이 넣으면 빨리 시어집니다. 배, 사과 같은 과일로 단맛을 내는 것이 더 좋습니다." },
    ],
  },
  {
    category: "건강",
    emoji: "💪",
    items: [
      { q: "김치의 칼로리는 얼마나 되나요?", a: "배추김치 100g 기준 약 15~20kcal로 매우 낮습니다. 다이어트 식품으로도 훌륭합니다." },
      { q: "김치를 매일 먹어도 괜찮나요?", a: "적정량(약 100~200g)은 매일 먹어도 좋습니다. 유산균, 비타민 C, 식이섬유가 풍부합니다. 단, 나트륨이 있으므로 고혈압이 있다면 양을 조절하세요." },
      { q: "김치의 유산균은 얼마나 있나요?", a: "잘 발효된 김치에는 1g당 약 1억 마리(10^8 CFU)의 유산균이 있습니다. 요구르트와 비슷한 수준입니다." },
      { q: "임산부도 김치를 먹을 수 있나요?", a: "네, 적정량은 안전합니다. 엽산, 비타민이 풍부하여 오히려 도움이 됩니다. 단, 과도한 나트륨 섭취에만 주의하세요." },
    ],
  },
  {
    category: "담그기",
    emoji: "👨‍🍳",
    items: [
      { q: "처음 김치를 담가보는데 어떤 김치가 쉬운가요?", a: "겉절이가 가장 쉽습니다! 발효 과정이 없고 30분이면 만들 수 있어요. 그 다음은 깍두기를 추천합니다." },
      { q: "김치를 담그는 데 얼마나 걸리나요?", a: "배추김치 기준: 절이기 8~12시간, 양념 만들기 1시간, 담기 1~2시간. 총 약 1일이 소요됩니다." },
      { q: "아파트에서도 김치를 담글 수 있나요?", a: "물론입니다! 대야, 고무장갑, 밀폐 용기만 있으면 됩니다. 소량으로 시작해보세요. 배추 2~3포기가 적당합니다." },
    ],
  },
];

const ALL_CATEGORY = "전체";

const totalQuestions = FAQ_DATA.reduce((sum, cat) => sum + cat.items.length, 0);

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const filterOptions = useMemo(
    () => [
      { value: ALL_CATEGORY, label: `전체`, count: totalQuestions },
      ...FAQ_DATA.map((cat) => ({
        value: cat.category,
        label: `${cat.emoji} ${cat.category}`,
        count: cat.items.length,
      })),
    ],
    []
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_DATA.map((cat) => {
      if (activeCategory !== ALL_CATEGORY && cat.category !== activeCategory) {
        return { ...cat, items: [] };
      }

      const filtered = query
        ? cat.items.filter(
            (item) =>
              item.q.toLowerCase().includes(query) ||
              item.a.toLowerCase().includes(query)
          )
        : cat.items;

      return { ...cat, items: filtered };
    }).filter((cat) => cat.items.length > 0);
  }, [searchQuery, activeCategory]);

  const visibleCount = filteredData.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  const toggleItem = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <PageHero
          title="❓ 김치 FAQ"
          description="김치에 대해 궁금한 모든 것"
        />

        <div className="container mx-auto px-4 pb-16">
          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="질문을 검색하세요..."
                className="w-full pl-12 pr-4 py-3 rounded-[var(--radius-lg)] border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex justify-center mb-8">
            <FilterBar
              options={filterOptions}
              value={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {/* Result count */}
          <p className="text-center text-sm text-muted-foreground mb-8">
            총 <span className="font-semibold text-foreground">{visibleCount}</span>개의 질문
            {searchQuery && (
              <span>
                {" "}
                (검색: &quot;{searchQuery}&quot;)
              </span>
            )}
          </p>

          {/* FAQ accordion */}
          <div className="max-w-3xl mx-auto space-y-8">
            {filteredData.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg text-muted-foreground">
                  검색 결과가 없습니다.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(ALL_CATEGORY);
                  }}
                  className="mt-4 text-primary hover:underline text-sm"
                >
                  전체 보기
                </button>
              </div>
            ) : (
              filteredData.map((cat) => (
                <section key={cat.category}>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">{cat.emoji}</span>
                    {cat.category}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({cat.items.length})
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {cat.items.map((item, idx) => {
                      const key = `${cat.category}-${idx}`;
                      const isOpen = openIndex === key;

                      return (
                        <Card key={key} padding="none" className="overflow-hidden">
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                          >
                            <span className="font-medium text-foreground leading-relaxed">
                              {item.q}
                            </span>
                            <svg
                              className={`w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          <div
                            className={`grid transition-all duration-200 ease-in-out ${
                              isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-5 pb-4 pt-0">
                                <div className="border-t border-border pt-4">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
