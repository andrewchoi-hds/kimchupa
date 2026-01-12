interface BadgeProps {
  name: string;
  icon: string;
  description?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  earned?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Badge({
  name,
  icon,
  description,
  rarity = "common",
  earned = true,
  size = "md",
}: BadgeProps) {
  const rarityColors = {
    common: "from-zinc-400 to-zinc-500",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
  };

  const rarityBorders = {
    common: "border-zinc-300 dark:border-zinc-600",
    rare: "border-blue-400 dark:border-blue-500",
    epic: "border-purple-400 dark:border-purple-500",
    legendary: "border-yellow-400 dark:border-yellow-500",
  };

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${!earned ? "opacity-40" : ""}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${rarityColors[rarity]} border-2 ${rarityBorders[rarity]} flex items-center justify-center shadow-lg ${earned ? "animate-pulse-slow" : "grayscale"}`}
      >
        <span className={iconSizes[size]}>{icon}</span>
      </div>
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 text-center">
        {name}
      </span>
      {description && (
        <span className="text-xs text-zinc-500 text-center max-w-20">
          {description}
        </span>
      )}
    </div>
  );
}
