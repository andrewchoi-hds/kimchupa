import { prisma } from "@kimchupa/db";
import { badgeRepository } from "../repositories/badge.repository";

/** Data needed to check badge conditions */
export interface BadgeCheckData {
  totalPosts: number;
  recipePosts: number;
  qnaAnswers: number;
  currentStreak: number;
  longestStreak: number;
  wikiEdits: number;
  followers: number;
  level: number;
}

/** Badge condition definitions: maps badge slug to check function */
const BADGE_CONDITIONS: Record<string, (data: BadgeCheckData) => boolean> = {
  "first-post": (data) => data.totalPosts >= 1,
  "recipe-master": (data) => data.recipePosts >= 10,
  "helpful": (data) => data.qnaAnswers >= 50,
  "streak-7": (data) => data.currentStreak >= 7 || data.longestStreak >= 7,
  "streak-30": (data) => data.currentStreak >= 30 || data.longestStreak >= 30,
  "wiki-editor": (data) => data.wikiEdits >= 10,
  "influencer": (data) => data.followers >= 100,
  "legend": (data) => data.level >= 7,
};

export const badgeService = {
  /** Get all badges */
  async getAll() {
    return badgeRepository.findAll();
  },

  /** Get all badges with user's earned status */
  async getAllWithUserStatus(userId: string) {
    return badgeRepository.getAllWithUserStatus(userId);
  },

  /** Get only the user's earned badges */
  async getUserBadges(userId: string) {
    return badgeRepository.findUserBadges(userId);
  },

  /** Get count of earned badges */
  async getEarnedCount(userId: string) {
    return badgeRepository.getEarnedCount(userId);
  },

  /**
   * Check all badge conditions and award any newly earned badges.
   * Returns list of newly awarded badge slugs.
   */
  async checkAndAward(userId: string, data?: BadgeCheckData): Promise<string[]> {
    // If data not provided, gather it from the database
    const checkData = data || await gatherBadgeCheckData(userId);

    const newlyEarned: string[] = [];

    for (const [slug, condition] of Object.entries(BADGE_CONDITIONS)) {
      if (!condition(checkData)) continue;

      // Check if badge exists in DB
      const badge = await badgeRepository.findBySlug(slug);
      if (!badge) continue;

      // Check if already awarded
      const alreadyHas = await badgeRepository.hasBadge(userId, badge.id);
      if (alreadyHas) continue;

      // Award the badge
      const awarded = await badgeRepository.awardBadge(userId, badge.id);
      if (awarded) {
        newlyEarned.push(slug);
      }
    }

    return newlyEarned;
  },

  /** Check if a user has a specific badge by slug */
  async hasBadge(userId: string, slug: string) {
    return badgeRepository.hasBadgeBySlug(userId, slug);
  },
};

/** Gather all data needed for badge condition checks from the database */
async function gatherBadgeCheckData(userId: string): Promise<BadgeCheckData> {
  const [
    totalPosts,
    recipePosts,
    qnaAnswers,
    user,
  ] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.post.count({ where: { authorId: userId, type: "recipe" } }),
    prisma.comment.count({
      where: {
        authorId: userId,
        post: { type: "qna" },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    }),
  ]);

  // Get streak data from attendance
  const attendance = await prisma.attendance.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    select: { date: true, streak: true },
  });

  let currentStreak = 0;
  let longestStreak = 0;

  if (attendance.length > 0) {
    // Current streak: check from most recent
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = new Date(attendance[0].date);
    mostRecent.setHours(0, 0, 0, 0);

    if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      let currentDate = mostRecent;
      for (let i = 1; i < attendance.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        prevDate.setHours(0, 0, 0, 0);
        const recordDate = new Date(attendance[i].date);
        recordDate.setHours(0, 0, 0, 0);
        if (recordDate.getTime() === prevDate.getTime()) {
          currentStreak++;
          currentDate = recordDate;
        } else {
          break;
        }
      }
    }

    // Longest streak
    longestStreak = Math.max(...attendance.map((a) => a.streak), 0);
  }

  return {
    totalPosts,
    recipePosts,
    qnaAnswers,
    currentStreak,
    longestStreak,
    wikiEdits: 0, // TODO: implement when wiki edit tracking is available
    followers: 0, // TODO: implement when follower system is available
    level: user?.level || 1,
  };
}
