"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Users, ChefHat, ChevronDown, ChevronUp, Lightbulb, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FilterBar from "@/components/ui/FilterBar";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";

interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  difficulty: string;
  time: string;
  servings: string;
  bestKimchi: string;
  ingredients: string[];
  steps: string[];
  tip: string;
  tags: string[];
}

const KIMCHI_RECIPES: Recipe[] = [
  {
    id: "kimchi-jjigae",
    name: "김치찌개",
    nameEn: "Kimchi Stew",
    emoji: "🍲",
    difficulty: "쉬움",
    time: "30분",
    servings: "2인분",
    bestKimchi: "묵은지 (잘 익은 배추김치)",
    ingredients: ["김치 200g", "돼지고기 150g", "두부 1/2모", "대파 1대", "고춧가루 1T", "다진마늘 1T"],
    steps: ["김치를 한입 크기로 썰어 냄비에 넣고 참기름으로 볶는다", "돼지고기를 넣고 함께 볶는다", "물 400ml를 넣고 끓인다", "두부를 넣고 5분 더 끓인다", "대파를 넣고 마무리"],
    tip: "김치가 시어질수록 찌개가 맛있어요!",
    tags: ["메인요리", "국물", "초보추천"],
  },
  {
    id: "kimchi-bokkeumbap",
    name: "김치볶음밥",
    nameEn: "Kimchi Fried Rice",
    emoji: "🍚",
    difficulty: "쉬움",
    time: "15분",
    servings: "1인분",
    bestKimchi: "신김치 (약간 신 배추김치)",
    ingredients: ["밥 1공기", "김치 100g", "계란 1개", "참기름 1T", "김가루"],
    steps: ["김치를 잘게 썰어 팬에 볶는다", "밥을 넣고 함께 볶는다", "참기름을 두르고 계란 프라이를 올린다", "김가루를 뿌려 완성"],
    tip: "찬밥을 사용하면 더 맛있어요!",
    tags: ["간편식", "혼밥", "초보추천"],
  },
  {
    id: "kimchi-jeon",
    name: "김치전",
    nameEn: "Kimchi Pancake",
    emoji: "🥞",
    difficulty: "쉬움",
    time: "20분",
    servings: "2인분",
    bestKimchi: "신김치",
    ingredients: ["김치 200g", "부침가루 1컵", "물 3/4컵", "대파", "식용유"],
    steps: ["김치를 잘게 썬다", "부침가루와 물을 섞어 반죽을 만든다", "김치와 대파를 반죽에 넣는다", "팬에 기름을 두르고 노릇하게 부친다"],
    tip: "김치 국물을 반죽에 넣으면 풍미가 올라가요!",
    tags: ["간식", "안주", "비오는날"],
  },
  {
    id: "kimchi-mandu",
    name: "김치만두",
    nameEn: "Kimchi Dumplings",
    emoji: "🥟",
    difficulty: "보통",
    time: "60분",
    servings: "4인분",
    bestKimchi: "잘 익은 배추김치",
    ingredients: ["김치 300g", "돼지고기 200g", "두부 1/2모", "만두피 30장", "부추 50g", "당면 50g"],
    steps: ["김치를 잘게 다져 물기를 짠다", "돼지고기, 으깬 두부, 불린 당면, 부추를 섞는다", "양념(간장, 참기름, 후추)을 넣고 버무린다", "만두피에 소를 넣고 빚는다", "찜기에 15분 찌거나 끓는 물에 삶는다"],
    tip: "남은 만두는 냉동하면 한 달까지 보관 가능!",
    tags: ["메인요리", "겨울", "가족"],
  },
  {
    id: "kimchi-guksu",
    name: "김치말이국수",
    nameEn: "Kimchi Cold Noodles",
    emoji: "🍜",
    difficulty: "쉬움",
    time: "15분",
    servings: "1인분",
    bestKimchi: "동치미 국물 + 배추김치",
    ingredients: ["소면 1인분", "동치미 국물 2컵", "김치 100g", "오이 1/4개", "삶은 계란 1/2개", "식초 1T"],
    steps: ["소면을 삶아 찬물에 헹군다", "그릇에 면을 담고 차가운 동치미 국물을 붓는다", "썬 김치, 오이, 계란을 올린다", "식초와 겨자를 곁들인다"],
    tip: "여름에 시원하게 먹으면 최고!",
    tags: ["간편식", "여름", "시원함"],
  },
  {
    id: "kimchi-cheese",
    name: "김치치즈볶음밥",
    nameEn: "Kimchi Cheese Rice",
    emoji: "🧀",
    difficulty: "쉬움",
    time: "15분",
    servings: "1인분",
    bestKimchi: "신김치",
    ingredients: ["밥 1공기", "김치 100g", "모짜렐라 치즈 50g", "베이컨 2줄", "버터 1T"],
    steps: ["버터에 베이컨과 김치를 볶는다", "밥을 넣고 함께 볶는다", "치즈를 올리고 뚜껑을 덮어 녹인다"],
    tip: "치즈가 쭉~ 늘어나면 성공!",
    tags: ["간편식", "혼밥", "퓨전"],
  },
];

const ALL_TAGS = ["전체", "초보추천", "간편식", "메인요리", "여름", "겨울"] as const;

const difficultyColor: Record<string, string> = {
  "쉬움": "bg-green-100 text-green-700",
  "보통": "bg-yellow-100 text-yellow-700",
  "어려움": "bg-red-100 text-red-700",
};

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card hover className="flex flex-col" onClick={() => setExpanded(!expanded)}>
      {/* Card Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-4xl">{recipe.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold">{recipe.name}</h3>
          <p className="text-sm text-muted-foreground">{recipe.nameEn}</p>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColor[recipe.difficulty] || "bg-muted text-muted-foreground"}`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {recipe.time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {recipe.servings}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {recipe.tags.map((tag) => (
          <Tag key={tag} variant="primary">{tag}</Tag>
        ))}
      </div>

      {/* Expand Toggle */}
      <button
        className="flex items-center justify-center gap-1 text-sm text-primary font-medium mt-auto pt-2 border-t border-border"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? (
          <>레시피 접기 <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>레시피 보기 <ChevronDown className="w-4 h-4" /></>
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
          {/* Best Kimchi */}
          <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-[var(--radius)]">
            <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary mb-0.5">추천 김치</p>
              <p className="text-sm">{recipe.bestKimchi}</p>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              재료
            </h4>
            <ul className="grid grid-cols-2 gap-1">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-sm font-bold mb-2">만드는 법</h4>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-[var(--radius)]">
            <Lightbulb className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-warning mb-0.5">꿀팁</p>
              <p className="text-sm">{recipe.tip}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function RecipesPage() {
  const [activeTag, setActiveTag] = useState("전체");

  const filterOptions = ALL_TAGS.map((tag) => ({
    value: tag,
    label: tag,
    count: tag === "전체" ? KIMCHI_RECIPES.length : KIMCHI_RECIPES.filter((r) => r.tags.includes(tag)).length,
  }));

  const filteredRecipes =
    activeTag === "전체"
      ? KIMCHI_RECIPES
      : KIMCHI_RECIPES.filter((r) => r.tags.includes(activeTag));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4">
            <PageHero
              title="🍳 김치 요리 활용법"
              description="김치로 만드는 맛있는 요리들"
            />
          </div>
        </section>

        {/* Back link + Filter */}
        <section className="sticky top-16 z-40 bg-card border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <Link
                href="/wiki"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                김치 백과로 돌아가기
              </Link>
              <span className="text-sm text-muted-foreground">
                {filteredRecipes.length}개 레시피
              </span>
            </div>
            <FilterBar
              options={filterOptions}
              value={activeTag}
              onChange={setActiveTag}
            />
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🍽️</p>
                <p className="text-lg font-semibold mb-2">해당 태그의 레시피가 없어요</p>
                <p className="text-muted-foreground mb-4">다른 태그를 선택해보세요</p>
                <Button variant="outline" onClick={() => setActiveTag("전체")}>
                  전체 보기
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
