import { LEVEL_EMOJIS } from "@/constants/levels";

interface LevelBadgeProps {
  level: number;
  levelName: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export default function LevelBadge({
  level,
  levelName,
  size = "md",
  showName = true,
}: LevelBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const levelColors: Record<number, string> = {
    1: "bg-green-100 text-green-700",
    2: "bg-emerald-100 text-emerald-700",
    3: "bg-blue-100 text-blue-700",
    4: "bg-purple-100 text-purple-700",
    5: "bg-orange-100 text-orange-700",
    6: "bg-red-100 text-red-700",
    7: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${levelColors[level] || levelColors[1]}`}
    >
      <span>{LEVEL_EMOJIS[level] || "🌱"}</span>
      <span>Lv.{level}</span>
      {showName && <span>{levelName}</span>}
    </span>
  );
}
