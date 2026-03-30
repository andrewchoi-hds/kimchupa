"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import { KIMCHI_DATA } from "@/constants/kimchi";
import type { KimchiType } from "@/constants/kimchi";

// Region color mapping
const REGION_COLORS: Record<string, { bg: string; border: string; text: string; label: { ko: string; en: string } }> = {
  "전국": {
    bg: "bg-primary/80 hover:bg-primary",
    border: "border-primary",
    text: "text-primary",
    label: { ko: "전국", en: "Nationwide" },
  },
  "전라도": {
    bg: "bg-green-500/80 hover:bg-green-500",
    border: "border-green-500",
    text: "text-green-600 dark:text-green-400",
    label: { ko: "전라도", en: "Jeolla-do" },
  },
  "경상도": {
    bg: "bg-blue-500/80 hover:bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    label: { ko: "경상도", en: "Gyeongsang-do" },
  },
  "강원도": {
    bg: "bg-purple-500/80 hover:bg-purple-500",
    border: "border-purple-500",
    text: "text-purple-600 dark:text-purple-400",
    label: { ko: "강원도", en: "Gangwon-do" },
  },
  "서울/경기": {
    bg: "bg-orange-500/80 hover:bg-orange-500",
    border: "border-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    label: { ko: "서울/경기", en: "Seoul/Gyeonggi" },
  },
  "충청도": {
    bg: "bg-teal-500/80 hover:bg-teal-500",
    border: "border-teal-500",
    text: "text-teal-600 dark:text-teal-400",
    label: { ko: "충청도", en: "Chungcheong-do" },
  },
  "제주": {
    bg: "bg-pink-500/80 hover:bg-pink-500",
    border: "border-pink-500",
    text: "text-pink-600 dark:text-pink-400",
    label: { ko: "제주", en: "Jeju" },
  },
  "서해안": {
    bg: "bg-cyan-500/80 hover:bg-cyan-500",
    border: "border-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
    label: { ko: "서해안", en: "West Coast" },
  },
};

function getRegionColor(region: string) {
  return REGION_COLORS[region] || REGION_COLORS["전국"];
}

// Collect all unique regions from the data
function getUniqueRegions(data: KimchiType[]): string[] {
  const regions = new Set(data.map((k) => k.region));
  return Array.from(regions);
}

export default function FlavorMapPage() {
  const locale = useLocale();
  const isKo = locale === "ko";

  const [selected, setSelected] = useState<KimchiType | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeRegions, setActiveRegions] = useState<Set<string>>(new Set(getUniqueRegions(KIMCHI_DATA)));

  const toggleRegion = (region: string) => {
    setActiveRegions((prev) => {
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
      } else {
        next.add(region);
      }
      return next;
    });
  };

  const toggleAllRegions = () => {
    const allRegions = getUniqueRegions(KIMCHI_DATA);
    if (activeRegions.size === allRegions.length) {
      setActiveRegions(new Set());
    } else {
      setActiveRegions(new Set(allRegions));
    }
  };

  const filteredData = useMemo(
    () => KIMCHI_DATA.filter((k) => activeRegions.has(k.region)),
    [activeRegions]
  );

  const regions = useMemo(() => getUniqueRegions(KIMCHI_DATA), []);

  const allSelected = activeRegions.size === regions.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <PageHero
          title={isKo ? "김치 맛 지도" : "Kimchi Flavor Map"}
          description={
            isKo
              ? "25종 김치의 맛 프로필을 한눈에"
              : "Taste profiles of 25 kimchi varieties at a glance"
          }
        />

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Region Legend / Filter */}
            <Card padding="md" className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground mr-1">
                  {isKo ? "지역 필터" : "Region Filter"}
                </span>
                <button
                  onClick={toggleAllRegions}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    allSelected
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground"
                  }`}
                >
                  {isKo ? "전체" : "All"}
                </button>
                {regions.map((region) => {
                  const color = getRegionColor(region);
                  const isActive = activeRegions.has(region);
                  return (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                        isActive
                          ? `${color.bg} text-white ${color.border} shadow-sm`
                          : "bg-background text-muted-foreground border-border opacity-50 hover:opacity-75"
                      }`}
                    >
                      {isKo ? color.label.ko : color.label.en}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Main content: chart + detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Area */}
              <div className="lg:col-span-2">
                <Card padding="md">
                  <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                    <div className="absolute inset-0">
                      {/* Grid background */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 500 500"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        {/* Grid lines */}
                        {[1, 2, 3, 4].map((i) => (
                          <g key={i}>
                            <line
                              x1={i * 100}
                              y1="0"
                              x2={i * 100}
                              y2="500"
                              stroke="currentColor"
                              strokeOpacity="0.08"
                              strokeWidth="1"
                            />
                            <line
                              x1="0"
                              y1={i * 100}
                              x2="500"
                              y2={i * 100}
                              stroke="currentColor"
                              strokeOpacity="0.08"
                              strokeWidth="1"
                            />
                          </g>
                        ))}
                        {/* Border */}
                        <rect
                          x="0"
                          y="0"
                          width="500"
                          height="500"
                          fill="none"
                          stroke="currentColor"
                          strokeOpacity="0.15"
                          strokeWidth="1"
                        />
                      </svg>

                      {/* Y-axis label */}
                      <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium -rotate-0 origin-center">
                          5
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                          0
                        </span>
                      </div>
                      <div
                        className="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateX(50%)" }}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          {isKo ? "발효도 (fermentation)" : "Fermentation Level"}
                        </span>
                      </div>

                      {/* X-axis label */}
                      <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 pointer-events-none">
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                          0
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                          5
                        </span>
                      </div>
                      <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap">
                          {isKo ? "매운맛 (spicyLevel)" : "Spicy Level"}
                        </span>
                      </div>

                      {/* Quadrant labels */}
                      <div className="absolute top-2 left-2 pointer-events-none">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-medium">
                          {isKo ? "순하고 발효 깊은" : "Mild & Fermented"}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 pointer-events-none text-right">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-medium">
                          {isKo ? "매콤하고 발효 깊은" : "Spicy & Fermented"}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 pointer-events-none">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-medium">
                          {isKo ? "순하고 신선한" : "Mild & Fresh"}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 pointer-events-none text-right">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 font-medium">
                          {isKo ? "매콤하고 신선한" : "Spicy & Fresh"}
                        </span>
                      </div>

                      {/* Kimchi bubbles */}
                      {filteredData.map((kimchi) => {
                        const x = (kimchi.spicyLevel / 5) * 85 + 5; // 5-90%
                        const y = 90 - (kimchi.fermentationLevel / 5) * 85; // inverted Y
                        const size = 24 + kimchi.crunchiness * 8; // 24-64px
                        const regionColor = getRegionColor(kimchi.region);
                        const isHovered = hoveredId === kimchi.id;
                        const isSelected = selected?.id === kimchi.id;

                        return (
                          <button
                            key={kimchi.id}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              width: size,
                              height: size,
                            }}
                            className={`absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 shadow-md flex items-center justify-center text-white font-bold cursor-pointer border-2 border-white/30 ${regionColor.bg} ${
                              isSelected
                                ? "ring-4 ring-primary/40 scale-110 z-30"
                                : isHovered
                                  ? "scale-125 z-20 shadow-lg"
                                  : "z-10 hover:scale-110"
                            }`}
                            onClick={() => setSelected(kimchi)}
                            onMouseEnter={() => setHoveredId(kimchi.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            aria-label={isKo ? kimchi.name : kimchi.nameEn}
                            title={isKo ? kimchi.name : kimchi.nameEn}
                          >
                            <span className="text-[9px] sm:text-[10px] leading-none text-center drop-shadow-sm pointer-events-none select-none">
                              {kimchi.name.length > 3
                                ? kimchi.name.slice(0, 2)
                                : kimchi.name.slice(0, 3)}
                            </span>
                          </button>
                        );
                      })}

                      {/* Hover tooltip */}
                      {hoveredId && !selected && (() => {
                        const kimchi = KIMCHI_DATA.find((k) => k.id === hoveredId);
                        if (!kimchi) return null;
                        const x = (kimchi.spicyLevel / 5) * 85 + 5;
                        const y = 90 - (kimchi.fermentationLevel / 5) * 85;
                        const tooltipLeft = x > 60 ? "auto" : `${x + 3}%`;
                        const tooltipRight = x > 60 ? `${100 - x + 3}%` : "auto";
                        const tooltipTop = y > 50 ? "auto" : `${y + 5}%`;
                        const tooltipBottom = y > 50 ? `${100 - y + 5}%` : "auto";

                        return (
                          <div
                            className="absolute z-40 bg-card border border-border rounded-[var(--radius)] shadow-lg p-3 pointer-events-none min-w-[160px]"
                            style={{
                              left: tooltipLeft,
                              right: tooltipRight,
                              top: tooltipTop,
                              bottom: tooltipBottom,
                            }}
                          >
                            <p className="text-sm font-semibold text-foreground">
                              {isKo ? kimchi.name : kimchi.nameEn}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {isKo ? "매운맛" : "Spicy"}: {kimchi.spicyLevel}/5 &middot;{" "}
                              {isKo ? "발효" : "Ferm."}: {kimchi.fermentationLevel}/5
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isKo ? "아삭함" : "Crunch"}: {kimchi.crunchiness}/5 &middot;{" "}
                              {isKo ? "짠맛" : "Salt"}: {kimchi.saltiness}/5
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Bubble size legend */}
                  <div className="mt-10 pt-4 border-t border-border flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {isKo ? "버블 크기 = 아삭함 (crunchiness)" : "Bubble size = Crunchiness"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />
                      <span>{isKo ? "낮음" : "Low"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted-foreground/30" />
                      <span>{isKo ? "보통" : "Med"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted-foreground/30" />
                      <span>{isKo ? "높음" : "High"}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Detail Panel */}
              <div className="lg:col-span-1">
                {selected ? (
                  <KimchiDetailCard kimchi={selected} isKo={isKo} onClose={() => setSelected(null)} />
                ) : (
                  <Card padding="lg" className="text-center">
                    <div className="py-8">
                      <div className="text-5xl mb-4">
                        <span role="img" aria-label="map">
                          🗺️
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {isKo
                          ? "차트의 김치 버블을 클릭하면\n상세 정보를 볼 수 있어요"
                          : "Click a kimchi bubble on the chart\nto see detailed info"}
                      </p>
                    </div>
                  </Card>
                )}

                {/* Stats summary */}
                <Card padding="md" className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    {isKo ? "표시 중인 김치" : "Showing"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 rounded-[var(--radius-sm)] bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{filteredData.length}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isKo ? "종류" : "types"}
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-[var(--radius-sm)] bg-muted/50">
                      <p className="text-2xl font-bold text-foreground">{activeRegions.size}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isKo ? "지역" : "regions"}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Region breakdown */}
                <Card padding="md" className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    {isKo ? "지역별 분포" : "By Region"}
                  </h3>
                  <div className="space-y-2">
                    {regions.map((region) => {
                      const color = getRegionColor(region);
                      const count = KIMCHI_DATA.filter((k) => k.region === region).length;
                      const barWidth = (count / KIMCHI_DATA.length) * 100;
                      return (
                        <div key={region} className="flex items-center gap-2">
                          <span className={`text-xs font-medium w-16 shrink-0 ${color.text}`}>
                            {isKo ? color.label.ko : color.label.en}
                          </span>
                          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${color.bg.split(" ")[0]}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-5 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>

            {/* Kimchi List Grid (below chart) */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isKo
                  ? `전체 김치 목록 (${filteredData.length}종)`
                  : `All Kimchi (${filteredData.length} types)`}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredData.map((kimchi) => {
                  const color = getRegionColor(kimchi.region);
                  const isActive = selected?.id === kimchi.id;
                  return (
                    <button
                      key={kimchi.id}
                      onClick={() => {
                        setSelected(kimchi);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`text-left p-3 rounded-[var(--radius)] border transition-all ${
                        isActive
                          ? `border-primary bg-primary/5 shadow-md`
                          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 ${color.bg.split(" ")[0]}`}
                        />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {isKo ? kimchi.name : kimchi.nameEn}
                        </span>
                      </div>
                      <div className="flex gap-2 text-[10px] text-muted-foreground">
                        <span>
                          {isKo ? "매움" : "Spicy"} {kimchi.spicyLevel}
                        </span>
                        <span>
                          {isKo ? "발효" : "Ferm."} {kimchi.fermentationLevel}
                        </span>
                        <span>
                          {isKo ? "식감" : "Crunch"} {kimchi.crunchiness}
                        </span>
                      </div>
                    </button>
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

/** Detail card for a selected kimchi */
function KimchiDetailCard({
  kimchi,
  isKo,
  onClose,
}: {
  kimchi: KimchiType;
  isKo: boolean;
  onClose: () => void;
}) {
  const color = getRegionColor(kimchi.region);

  const stats = [
    { label: isKo ? "매운맛" : "Spicy", value: kimchi.spicyLevel, max: 5 },
    { label: isKo ? "발효도" : "Fermentation", value: kimchi.fermentationLevel, max: 5 },
    { label: isKo ? "짠맛" : "Saltiness", value: kimchi.saltiness, max: 5 },
    { label: isKo ? "아삭함" : "Crunchiness", value: kimchi.crunchiness, max: 5 },
  ];

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <Image
          src={kimchi.imageUrl}
          alt={isKo ? kimchi.name : kimchi.nameEn}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
          unoptimized
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
          aria-label={isKo ? "닫기" : "Close"}
        >
          ✕
        </button>
        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${color.bg.split(" ")[0]}`}>
          {isKo ? color.label.ko : color.label.en}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground">
          {isKo ? kimchi.name : kimchi.nameEn}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isKo ? kimchi.nameEn : kimchi.name}
        </p>

        <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">
          {kimchi.description}
        </p>

        {/* Stat bars */}
        <div className="mt-4 space-y-2.5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{stat.label}</span>
                <span className="text-muted-foreground">
                  {stat.value}/{stat.max}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(stat.value / stat.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main ingredients */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-foreground mb-1.5">
            {isKo ? "주재료" : "Main Ingredients"}
          </p>
          <div className="flex flex-wrap gap-1">
            {kimchi.mainIngredients.map((ing) => (
              <span
                key={ing}
                className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Best with */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-foreground mb-1.5">
            {isKo ? "잘 어울리는 음식" : "Best With"}
          </p>
          <div className="flex flex-wrap gap-1">
            {kimchi.bestWith.map((food) => (
              <span
                key={food}
                className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary"
              >
                {food}
              </span>
            ))}
          </div>
        </div>

        {/* Wiki link */}
        <Link
          href={`/wiki/${kimchi.id}`}
          className="mt-4 block w-full text-center px-4 py-2.5 text-sm font-medium bg-primary text-white rounded-[var(--radius)] hover:bg-primary/90 transition-colors"
        >
          {isKo ? "위키에서 자세히 보기" : "View in Wiki"}
        </Link>
      </div>
    </Card>
  );
}
