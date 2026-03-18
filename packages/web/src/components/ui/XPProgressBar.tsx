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
            <span className="font-medium text-foreground">
              Lv.{currentLevel.level} {currentLevel.name}
            </span>
          </div>
          {nextLevel && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>다음: {LEVEL_EMOJIS[nextLevel.level]} Lv.{nextLevel.level}</span>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {showDetails && (
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
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
