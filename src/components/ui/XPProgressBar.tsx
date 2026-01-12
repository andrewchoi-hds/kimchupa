import { getXpProgress, LEVEL_EMOJIS } from "@/constants/levels";

interface XPProgressBarProps {
  xp: number;
  showDetails?: boolean;
}

export default function XPProgressBar({ xp, showDetails = true }: XPProgressBarProps) {
  const { currentLevel, nextLevel, progress, xpToNext } = getXpProgress(xp);

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{LEVEL_EMOJIS[currentLevel.level]}</span>
            <span className="font-medium text-zinc-900 dark:text-white">
              Lv.{currentLevel.level} {currentLevel.name}
            </span>
          </div>
          {nextLevel && (
            <div className="flex items-center gap-1 text-sm text-zinc-500">
              <span>다음: {LEVEL_EMOJIS[nextLevel.level]} Lv.{nextLevel.level}</span>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {showDetails && (
          <div className="flex justify-between mt-1 text-xs text-zinc-500">
            <span>{xp.toLocaleString()} XP</span>
            {nextLevel ? (
              <span>{xpToNext.toLocaleString()} XP to Lv.{nextLevel.level}</span>
            ) : (
              <span>최고 레벨 달성!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
