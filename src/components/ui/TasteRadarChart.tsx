"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface TasteData {
  spicyLevel: number;
  fermentationLevel: number;
  saltiness: number;
  crunchiness: number;
}

interface TasteRadarChartProps {
  data: TasteData;
  compareTo?: TasteData & { name: string };
  name?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

const TASTE_LABELS: Record<string, { ko: string; en: string }> = {
  spicy: { ko: "매운맛", en: "Spicy" },
  fermented: { ko: "발효도", en: "Fermented" },
  salty: { ko: "짠맛", en: "Salty" },
  crunchy: { ko: "아삭함", en: "Crunchy" },
};

const SIZE_CONFIG = {
  sm: { width: 200, height: 200, outerRadius: 60 },
  md: { width: 300, height: 300, outerRadius: 90 },
  lg: { width: 400, height: 400, outerRadius: 120 },
};

export default function TasteRadarChart({
  data,
  compareTo,
  name = "이 김치",
  size = "md",
  showLabels = true,
}: TasteRadarChartProps) {
  const chartData = [
    {
      taste: TASTE_LABELS.spicy.ko,
      value: data.spicyLevel,
      fullMark: 5,
      ...(compareTo && { compare: compareTo.spicyLevel }),
    },
    {
      taste: TASTE_LABELS.fermented.ko,
      value: data.fermentationLevel,
      fullMark: 5,
      ...(compareTo && { compare: compareTo.fermentationLevel }),
    },
    {
      taste: TASTE_LABELS.salty.ko,
      value: data.saltiness,
      fullMark: 5,
      ...(compareTo && { compare: compareTo.saltiness }),
    },
    {
      taste: TASTE_LABELS.crunchy.ko,
      value: data.crunchiness,
      fullMark: 5,
      ...(compareTo && { compare: compareTo.crunchiness }),
    },
  ];

  const { width, height, outerRadius } = SIZE_CONFIG[size];

  return (
    <div className="w-full" style={{ maxWidth: width }}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={chartData} outerRadius={outerRadius}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="taste"
            tick={{
              fill: "#6b7280",
              fontSize: size === "sm" ? 10 : 12,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name={name}
            dataKey="value"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          {compareTo && (
            <Radar
              name={compareTo.name}
              dataKey="compare"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          {showLabels && <Legend />}
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const item = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <p className="font-medium text-gray-900">{item.taste}</p>
                  {payload.map((entry, index) => (
                    <p
                      key={index}
                      className="text-sm"
                      style={{ color: entry.color }}
                    >
                      {entry.name}: {entry.value}/5
                    </p>
                  ))}
                </div>
              );
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 맛 상세 설명 */}
      {showLabels && (
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <TasteIndicator
            label="매운맛"
            value={data.spicyLevel}
            color="red"
            description={getSpicyDescription(data.spicyLevel)}
          />
          <TasteIndicator
            label="발효도"
            value={data.fermentationLevel}
            color="amber"
            description={getFermentedDescription(data.fermentationLevel)}
          />
          <TasteIndicator
            label="짠맛"
            value={data.saltiness}
            color="blue"
            description={getSaltyDescription(data.saltiness)}
          />
          <TasteIndicator
            label="아삭함"
            value={data.crunchiness}
            color="green"
            description={getCrunchyDescription(data.crunchiness)}
          />
        </div>
      )}
    </div>
  );
}

interface TasteIndicatorProps {
  label: string;
  value: number;
  color: "red" | "amber" | "blue" | "green";
  description: string;
}

function TasteIndicator({
  label,
  value,
  color,
  description,
}: TasteIndicatorProps) {
  const colorClasses = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };

  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}/5</span>
      </div>
      <div className="flex gap-0.5 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= value ? colorClasses[color] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function getSpicyDescription(level: number): string {
  const descriptions = [
    "전혀 맵지 않음",
    "살짝 매운맛",
    "적당한 매운맛",
    "제법 매운맛",
    "많이 매움",
    "아주 매움",
  ];
  return descriptions[level] || descriptions[0];
}

function getFermentedDescription(level: number): string {
  const descriptions = [
    "발효 없음",
    "겉절이 수준",
    "살짝 익음",
    "적당히 익음",
    "잘 익음",
    "푹 익은 묵은지",
  ];
  return descriptions[level] || descriptions[0];
}

function getSaltyDescription(level: number): string {
  const descriptions = [
    "거의 안 짬",
    "담백함",
    "약간 짭짤",
    "적당히 짭짤",
    "꽤 짬",
    "매우 짬",
  ];
  return descriptions[level] || descriptions[0];
}

function getCrunchyDescription(level: number): string {
  const descriptions = [
    "아삭함 없음",
    "부드러움",
    "약간 아삭",
    "적당히 아삭",
    "아삭아삭",
    "매우 아삭",
  ];
  return descriptions[level] || descriptions[0];
}
