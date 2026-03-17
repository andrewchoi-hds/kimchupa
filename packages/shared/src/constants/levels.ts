import type { UserLevel } from "../types";

export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    name: "김치 새싹",
    minXp: 0,
    maxXp: 99,
    permissions: {
      canPost: false,
      canComment: false,
      canEditWiki: false,
      canSuggestWikiEdit: false,
      canModerate: false,
    },
  },
  {
    level: 2,
    name: "김치 입문자",
    minXp: 100,
    maxXp: 499,
    permissions: {
      canPost: false,
      canComment: true,
      canEditWiki: false,
      canSuggestWikiEdit: false,
      canModerate: false,
    },
  },
  {
    level: 3,
    name: "김치 수습생",
    minXp: 500,
    maxXp: 1999,
    permissions: {
      canPost: true,
      canComment: true,
      canEditWiki: false,
      canSuggestWikiEdit: false,
      canModerate: false,
    },
  },
  {
    level: 4,
    name: "김치 요리사",
    minXp: 2000,
    maxXp: 4999,
    permissions: {
      canPost: true,
      canComment: true,
      canEditWiki: false,
      canSuggestWikiEdit: true,
      canModerate: false,
    },
  },
  {
    level: 5,
    name: "김치 장인",
    minXp: 5000,
    maxXp: 14999,
    permissions: {
      canPost: true,
      canComment: true,
      canEditWiki: true,
      canSuggestWikiEdit: true,
      canModerate: false,
    },
  },
  {
    level: 6,
    name: "김치 달인",
    minXp: 15000,
    maxXp: 49999,
    permissions: {
      canPost: true,
      canComment: true,
      canEditWiki: true,
      canSuggestWikiEdit: true,
      canModerate: true,
    },
  },
  {
    level: 7,
    name: "김치 명인",
    minXp: 50000,
    maxXp: Infinity,
    permissions: {
      canPost: true,
      canComment: true,
      canEditWiki: true,
      canSuggestWikiEdit: true,
      canModerate: true,
    },
  },
];

export const XP_REWARDS = {
  attendance: 5,
  post_created: 20,
  comment_created: 5,
  recipe_shared: 50,
  wiki_edit: 30,
  wiki_suggestion: 10,
  post_liked: 2,
  challenge_completed: 100,
} as const;

export const LEVEL_EMOJIS: Record<number, string> = {
  1: "🌱",
  2: "🥬",
  3: "👨‍🍳",
  4: "🧑‍🍳",
  5: "⭐",
  6: "🏆",
  7: "👑",
};

export function getLevelByXp(xp: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= USER_LEVELS[i].minXp) {
      return USER_LEVELS[i];
    }
  }
  return USER_LEVELS[0];
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
  const nextLevel = nextLevelIndex !== -1 ? USER_LEVELS[nextLevelIndex] : null;

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
