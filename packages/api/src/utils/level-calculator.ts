import { USER_LEVELS } from "@kimchupa/shared";

export type UserLevel = {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  permissions: {
    canPost: boolean;
    canComment: boolean;
    canEditWiki: boolean;
    canSuggestWikiEdit: boolean;
    canModerate: boolean;
  };
};

export function getLevelByXp(xp: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= USER_LEVELS[i].minXp) {
      return USER_LEVELS[i] as UserLevel;
    }
  }
  return USER_LEVELS[0] as UserLevel;
}

export function getXpProgress(xp: number): {
  currentLevel: UserLevel;
  nextLevel: UserLevel | null;
  progress: number;
  xpToNext: number;
} {
  const currentLevel = getLevelByXp(xp);
  const nextLevelIndex = USER_LEVELS.findIndex(
    (l) => l.level === currentLevel.level + 1
  );
  const nextLevel = nextLevelIndex !== -1 ? (USER_LEVELS[nextLevelIndex] as UserLevel) : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      xpToNext: 0,
    };
  }

  const xpInCurrentLevel = xp - currentLevel.minXp;
  const xpNeededForLevel = nextLevel.minXp - currentLevel.minXp;
  const progress = Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);
  const xpToNext = nextLevel.minXp - xp;

  return {
    currentLevel,
    nextLevel,
    progress,
    xpToNext,
  };
}
