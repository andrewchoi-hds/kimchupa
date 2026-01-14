import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_BADGES, type MockBadge } from "@/constants/mockData";
import { toast } from "./toastStore";

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

// 뱃지 획득 조건 체크를 위한 인터페이스
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

interface BadgesState {
  earnedBadges: EarnedBadge[];

  // Actions
  earnBadge: (badgeId: string) => boolean; // returns true if newly earned
  hasBadge: (badgeId: string) => boolean;
  getBadgeDetails: (badgeId: string) => (MockBadge & { earned: boolean; earnedAt?: string }) | null;
  getAllBadgesWithStatus: () => (MockBadge & { earned: boolean; earnedAt?: string })[];
  getEarnedCount: () => number;
  checkAndAwardBadges: (data: BadgeCheckData) => string[]; // returns list of newly earned badge ids
}

export const useBadgesStore = create<BadgesState>()(
  persist(
    (set, get) => ({
      earnedBadges: [],

      earnBadge: (badgeId) => {
        const current = get().earnedBadges;
        const alreadyEarned = current.some((b) => b.badgeId === badgeId);

        if (alreadyEarned) {
          return false;
        }

        const newBadge: EarnedBadge = {
          badgeId,
          earnedAt: new Date().toISOString(),
        };

        set({
          earnedBadges: [...current, newBadge],
        });

        return true;
      },

      hasBadge: (badgeId) => {
        return get().earnedBadges.some((b) => b.badgeId === badgeId);
      },

      getBadgeDetails: (badgeId) => {
        const badge = MOCK_BADGES.find((b) => b.id === badgeId);
        if (!badge) return null;

        const earned = get().earnedBadges.find((b) => b.badgeId === badgeId);
        return {
          ...badge,
          earned: !!earned,
          earnedAt: earned?.earnedAt,
        };
      },

      getAllBadgesWithStatus: () => {
        const earnedBadges = get().earnedBadges;
        return MOCK_BADGES.map((badge) => {
          const earned = earnedBadges.find((b) => b.badgeId === badge.id);
          return {
            ...badge,
            earned: !!earned,
            earnedAt: earned?.earnedAt,
          };
        });
      },

      getEarnedCount: () => {
        return get().earnedBadges.length;
      },

      // 조건에 따라 뱃지 자동 획득 체크
      checkAndAwardBadges: (data) => {
        const { earnBadge, hasBadge } = get();
        const newlyEarned: string[] = [];

        // 첫 글 작성 (first-post)
        if (data.totalPosts >= 1 && !hasBadge("first-post")) {
          if (earnBadge("first-post")) {
            newlyEarned.push("first-post");
          }
        }

        // 레시피 장인 (recipe-master) - 레시피 10개
        if (data.recipePosts >= 10 && !hasBadge("recipe-master")) {
          if (earnBadge("recipe-master")) {
            newlyEarned.push("recipe-master");
          }
        }

        // 도움의 손길 (helpful) - Q&A 답변 50개
        if (data.qnaAnswers >= 50 && !hasBadge("helpful")) {
          if (earnBadge("helpful")) {
            newlyEarned.push("helpful");
          }
        }

        // 7일 연속 출석 (streak-7)
        if ((data.currentStreak >= 7 || data.longestStreak >= 7) && !hasBadge("streak-7")) {
          if (earnBadge("streak-7")) {
            newlyEarned.push("streak-7");
          }
        }

        // 30일 연속 출석 (streak-30)
        if ((data.currentStreak >= 30 || data.longestStreak >= 30) && !hasBadge("streak-30")) {
          if (earnBadge("streak-30")) {
            newlyEarned.push("streak-30");
          }
        }

        // 위키 편집자 (wiki-editor) - 위키 편집 10회
        if (data.wikiEdits >= 10 && !hasBadge("wiki-editor")) {
          if (earnBadge("wiki-editor")) {
            newlyEarned.push("wiki-editor");
          }
        }

        // 김치 인플루언서 (influencer) - 팔로워 100명
        if (data.followers >= 100 && !hasBadge("influencer")) {
          if (earnBadge("influencer")) {
            newlyEarned.push("influencer");
          }
        }

        // 김치 레전드 (legend) - 레벨 7 달성
        if (data.level >= 7 && !hasBadge("legend")) {
          if (earnBadge("legend")) {
            newlyEarned.push("legend");
          }
        }

        // 새로 획득한 뱃지에 대해 토스트 알림
        newlyEarned.forEach((badgeId, index) => {
          const badge = MOCK_BADGES.find((b) => b.id === badgeId);
          if (badge) {
            setTimeout(() => {
              toast.success(
                `🏆 뱃지 획득!`,
                `${badge.icon} ${badge.name}`
              );
            }, index * 1000); // 순차적으로 표시
          }
        });

        return newlyEarned;
      },
    }),
    {
      name: "kimchupa-badges",
      partialize: (state) => ({
        earnedBadges: state.earnedBadges,
      }),
    }
  )
);
