"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Circle,
  ShoppingCart,
  Wrench,
  Clock,
  Flame,
  Snowflake,
  MapPin,
  Calculator,
  ClipboardList,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card, { CardTitle, CardDescription } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";

// ─── Types ──────────────────────────────────────────────────────────────────

interface TimelineStep {
  day: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  category: "ingredient" | "tool";
}

interface RegionInfo {
  name: string;
  description: string;
  color: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const RATIO_PER_HEAD = {
  gochugaru: 50, // g
  jeotgal: 20, // ml
  garlic: 5, // cloves
  ginger: 10, // g
  greenOnion: 5, // stalks
  salt: 200, // g
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    day: "D-30",
    title: "재료 준비",
    description: "배추, 무, 고춧가루, 젓갈 주문. 좋은 재료를 미리 확보하세요.",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  {
    day: "D-7",
    title: "도구 준비",
    description: "대야, 고무장갑, 김치통, 비닐 등 도구를 점검하고 준비합니다.",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  {
    day: "D-2",
    title: "배추 절이기",
    description: "배추를 반으로 갈라 천일염으로 8~12시간 절입니다.",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-yellow-500",
  },
  {
    day: "D-1",
    title: "양념 만들기",
    description: "고춧가루, 젓갈, 마늘, 생강, 파를 섞어 양념소를 만듭니다.",
    icon: <Flame className="w-5 h-5" />,
    color: "bg-red-500",
  },
  {
    day: "D-Day",
    title: "김치 담기",
    description: "절인 배추 잎 사이사이에 양념소를 골고루 넣습니다.",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "bg-green-500",
  },
  {
    day: "D+1",
    title: "숙성 시작",
    description: "실온에서 1~2일 발효 후 냉장 보관으로 옮깁니다.",
    icon: <Snowflake className="w-5 h-5" />,
    color: "bg-cyan-500",
  },
];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "baechu", label: "배추 (10포기 기준)", category: "ingredient" },
  { id: "mu", label: "무 (3~4개)", category: "ingredient" },
  { id: "gochugaru", label: "고춧가루 (500g)", category: "ingredient" },
  { id: "jeotgal", label: "젓갈 (새우젓/멸치액젓)", category: "ingredient" },
  { id: "garlic", label: "마늘 (50쪽)", category: "ingredient" },
  { id: "ginger", label: "생강 (100g)", category: "ingredient" },
  { id: "greenOnion", label: "쪽파 (50줄기)", category: "ingredient" },
  { id: "salt", label: "천일염 (2kg)", category: "ingredient" },
  { id: "sugar", label: "설탕 (약간)", category: "ingredient" },
  { id: "fishSauce", label: "까나리액젓 (선택)", category: "ingredient" },
  { id: "basin", label: "대야 (큰 것 2개 이상)", category: "tool" },
  { id: "gloves", label: "고무장갑 (두꺼운 것)", category: "tool" },
  { id: "container", label: "김치통 (10L 이상)", category: "tool" },
  { id: "knife", label: "김치칼 / 큰 칼", category: "tool" },
  { id: "cuttingBoard", label: "도마 (큰 것)", category: "tool" },
  { id: "apron", label: "앞치마 / 비닐", category: "tool" },
  { id: "mat", label: "비닐 깔개 (바닥용)", category: "tool" },
  { id: "scale", label: "저울", category: "tool" },
];

const REGIONS: RegionInfo[] = [
  {
    name: "서울/경기",
    description: "담백한 맛이 특징. 젓갈을 적게 사용하고 깔끔한 맛을 추구합니다.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
  },
  {
    name: "전라도",
    description: "풍부한 젓갈 사용으로 깊은 감칠맛. 다양한 부재료를 넣어 풍성합니다.",
    color: "bg-amber-50 border-amber-200 text-amber-800",
  },
  {
    name: "경상도",
    description: "멸치젓 위주로 담그며 매운맛이 강합니다. 시원한 맛이 특징입니다.",
    color: "bg-red-50 border-red-200 text-red-800",
  },
  {
    name: "강원도",
    description: "명태 등 생선을 사용하는 것이 특징. 해산물의 풍미가 깊습니다.",
    color: "bg-teal-50 border-teal-200 text-teal-800",
  },
  {
    name: "충청도",
    description: "중간 간에 균형 잡힌 맛. 소박하면서도 깔끔한 김치를 담급니다.",
    color: "bg-green-50 border-green-200 text-green-800",
  },
];

const BAECHU_TIPS = [
  { icon: "⚖️", title: "무게", desc: "2.5~3kg이 적당합니다." },
  { icon: "💛", title: "속 색깔", desc: "속이 노란 배추가 좋습니다." },
  { icon: "🍃", title: "잎과 줄기", desc: "잎이 얇고 줄기가 흰 것이 좋습니다." },
  { icon: "❄️", title: "서리 배추", desc: "11월 서리 맞은 배추가 최고입니다." },
];

// ─── Sub-Components ─────────────────────────────────────────────────────────

function SeasoningCalculator() {
  const [heads, setHeads] = useState(10);

  const calculated = {
    gochugaru: heads * RATIO_PER_HEAD.gochugaru,
    jeotgal: heads * RATIO_PER_HEAD.jeotgal,
    garlic: heads * RATIO_PER_HEAD.garlic,
    ginger: heads * RATIO_PER_HEAD.ginger,
    greenOnion: heads * RATIO_PER_HEAD.greenOnion,
    salt: heads * RATIO_PER_HEAD.salt,
  };

  const items = [
    { label: "고춧가루", value: calculated.gochugaru, unit: "g", color: "text-red-500", bg: "bg-red-50" },
    { label: "젓갈", value: calculated.jeotgal, unit: "ml", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "마늘", value: calculated.garlic, unit: "쪽", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "생강", value: calculated.ginger, unit: "g", color: "text-green-600", bg: "bg-green-50" },
    { label: "쪽파", value: calculated.greenOnion, unit: "줄기", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "천일염", value: calculated.salt, unit: "g", color: "text-gray-600", bg: "bg-gray-50" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <label className="text-lg font-medium text-foreground whitespace-nowrap">
          배추 포기 수:
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHeads(Math.max(1, heads - 1))}
            disabled={heads <= 1}
          >
            -
          </Button>
          <input
            type="number"
            min={1}
            max={200}
            value={heads}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1 && v <= 200) setHeads(v);
            }}
            className="w-20 text-center text-2xl font-bold border border-border rounded-[var(--radius)] py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHeads(Math.min(200, heads + 1))}
            disabled={heads >= 200}
          >
            +
          </Button>
          <span className="text-muted-foreground">포기</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-[var(--radius-lg)] p-4 text-center border border-border/50`}
          >
            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value >= 1000
                ? `${(item.value / 1000).toFixed(1)}${item.unit === "g" ? "kg" : item.unit}`
                : `${item.value}${item.unit}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KimjangChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ingredients = CHECKLIST_ITEMS.filter((i) => i.category === "ingredient");
  const tools = CHECKLIST_ITEMS.filter((i) => i.category === "tool");
  const total = CHECKLIST_ITEMS.length;
  const done = checked.size;
  const percent = Math.round((done / total) * 100);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            준비 완료: {done}/{total}
          </span>
          <span className="text-sm font-bold text-primary">{percent}%</span>
        </div>
        <ProgressBar value={percent} color="primary" size="md" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            재료 체크리스트
          </h4>
          <ul className="space-y-2">
            {ingredients.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-[var(--radius)] hover:bg-muted transition-colors"
                >
                  {checked.has(item.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <span
                    className={
                      checked.has(item.id)
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-secondary" />
            도구 체크리스트
          </h4>
          <ul className="space-y-2">
            {tools.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 w-full text-left p-2 rounded-[var(--radius)] hover:bg-muted transition-colors"
                >
                  {checked.has(item.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                  <span
                    className={
                      checked.has(item.id)
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {done === total && (
        <div className="mt-6 p-4 bg-success/10 border border-success/30 rounded-[var(--radius-lg)] text-center">
          <p className="text-success font-semibold text-lg">
            모든 준비가 완료되었습니다! 김장을 시작하세요!
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Section Nav ────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "about", label: "김장이란?", icon: <Info className="w-4 h-4" /> },
  { id: "timeline", label: "타임라인", icon: <Calendar className="w-4 h-4" /> },
  { id: "calculator", label: "양념 계산기", icon: <Calculator className="w-4 h-4" /> },
  { id: "baechu", label: "배추 고르기", icon: <ShoppingCart className="w-4 h-4" /> },
  { id: "regions", label: "지역별 특색", icon: <MapPin className="w-4 h-4" /> },
  { id: "checklist", label: "체크리스트", icon: <ClipboardList className="w-4 h-4" /> },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function KimjangGuidePage() {
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary text-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-6xl sm:text-7xl block mb-6 animate-bounce">
                🥬
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                김장 가이드 2026
              </h1>
              <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                한국의 가장 큰 음식 문화 행사, 김장을 완벽하게 준비하세요
              </p>
              <div className="flex items-center justify-center gap-2 mt-6 text-sm opacity-75">
                <Calendar className="w-4 h-4" />
                <span>매년 11월 ~ 12월</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Nav (sticky) ───────────────────────────────── */}
        <nav className="sticky top-16 z-40 bg-card/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors whitespace-nowrap"
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* ── 1. 김장이란? ───────────────────────────────────────── */}
        <section id="about" className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8 text-center">
                김장이란?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card padding="lg" className="text-center">
                  <span className="text-4xl block mb-4">🏛️</span>
                  <CardTitle className="mb-2">UNESCO 인류무형문화유산</CardTitle>
                  <CardDescription>
                    2013년 유네스코 인류무형문화유산으로 등재된 한국의 대표 음식 문화입니다.
                    수백 년간 이어져 온 김장 문화는 한국인의 정체성을 상징합니다.
                  </CardDescription>
                </Card>

                <Card padding="lg" className="text-center">
                  <span className="text-4xl block mb-4">👨‍👩‍👧‍👦</span>
                  <CardTitle className="mb-2">공동체 문화</CardTitle>
                  <CardDescription>
                    가족, 이웃, 친구가 함께 모여 김치를 담그는 공동체 행사입니다.
                    나눔과 협력의 정신이 담겨 있습니다.
                  </CardDescription>
                </Card>

                <Card padding="lg" className="text-center">
                  <span className="text-4xl block mb-4">🗓️</span>
                  <CardTitle className="mb-2">11월 말 ~ 12월 초</CardTitle>
                  <CardDescription>
                    겨울이 오기 전, 한 해 동안 먹을 김치를 한꺼번에 담급니다.
                    기온이 0도 이하로 내려가기 전이 적기입니다.
                  </CardDescription>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. 타임라인 ────────────────────────────────────────── */}
        <section id="timeline" className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
                김장 타임라인
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                D-Day를 기준으로 단계별로 준비하세요
              </p>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

                <div className="space-y-6">
                  {TIMELINE_STEPS.map((step, idx) => (
                    <div key={step.day} className="relative">
                      <button
                        onClick={() =>
                          setExpandedTimeline(expandedTimeline === idx ? null : idx)
                        }
                        className="w-full text-left"
                      >
                        <Card
                          hover
                          padding="md"
                          className={`sm:ml-14 transition-all ${
                            expandedTimeline === idx
                              ? "ring-2 ring-primary/30 shadow-md"
                              : ""
                          }`}
                        >
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-3.5 top-6 w-6 h-6 rounded-full ${step.color} text-white flex items-center justify-center hidden sm:flex shadow-sm`}
                          >
                            {step.icon}
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={`${step.color} text-white px-2.5 py-1 rounded-full text-xs font-bold`}
                              >
                                {step.day}
                              </span>
                              <h3 className="text-lg font-semibold text-foreground">
                                {step.title}
                              </h3>
                            </div>
                            {expandedTimeline === idx ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                            )}
                          </div>

                          {expandedTimeline === idx && (
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </Card>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. 양념 비율 계산기 ────────────────────────────────── */}
        <section id="calculator" className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  양념 비율 계산기
                </h2>
                <p className="text-muted-foreground">
                  배추 포기 수를 입력하면 필요한 양념 양을 자동으로 계산합니다
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  * 배추 1포기 기준: 고춧가루 50g, 젓갈 20ml, 마늘 5쪽, 생강 10g, 쪽파 5줄기, 천일염 200g
                </p>
              </div>

              <Card padding="lg">
                <SeasoningCalculator />
              </Card>
            </div>
          </div>
        </section>

        {/* ── 4. 배추 고르는 법 ──────────────────────────────────── */}
        <section id="baechu" className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
                배추 고르는 법
              </h2>
              <p className="text-center text-muted-foreground mb-10">
                좋은 배추가 좋은 김치의 시작입니다
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {BAECHU_TIPS.map((tip) => (
                  <Card key={tip.title} padding="lg" hover>
                    <div className="flex items-start gap-4">
                      <span className="text-3xl shrink-0">{tip.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {tip.desc}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. 지역별 김장 특색 ────────────────────────────────── */}
        <section id="regions" className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
                지역별 김장 특색
              </h2>
              <p className="text-center text-muted-foreground mb-10">
                같은 김장이라도 지역마다 맛과 방법이 다릅니다
              </p>

              <div className="space-y-4">
                {REGIONS.map((region) => (
                  <div
                    key={region.name}
                    className={`p-5 rounded-[var(--radius-lg)] border ${region.color} transition-all hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-base mb-1">{region.name}</h3>
                        <p className="text-sm opacity-80">{region.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. 김장 체크리스트 ──────────────────────────────────── */}
        <section id="checklist" className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  김장 체크리스트
                </h2>
                <p className="text-muted-foreground">
                  하나씩 체크하며 빠짐없이 준비하세요
                </p>
              </div>

              <Card padding="lg">
                <KimjangChecklist />
              </Card>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              김장 준비가 되셨나요?
            </h2>
            <p className="opacity-90 mb-8 max-w-lg mx-auto">
              김추페에서 다양한 김치 레시피와 정보를 확인하고, 커뮤니티에서 김장 팁을 나눠보세요!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/wiki" className="inline-flex items-center justify-center h-12 px-6 bg-white/10 border border-white/30 text-white font-medium rounded-[var(--radius)] hover:bg-white/20 transition-colors">
                김치 백과사전
              </Link>
              <Link href="/community" className="inline-flex items-center justify-center h-12 px-6 bg-white/10 border border-white/30 text-white font-medium rounded-[var(--radius)] hover:bg-white/20 transition-colors">
                커뮤니티
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
