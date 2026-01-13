import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENT_USER } from "@/constants/mockData";

interface UserProfile {
  id: string;
  nickname: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage: string | null;
  bio: string;
}

interface UserState {
  profile: UserProfile;

  // Actions
  setProfileImage: (url: string | null) => void;
  updateNickname: (nickname: string) => void;
  updateBio: (bio: string) => void;
  addXp: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: {
        id: CURRENT_USER.id,
        nickname: CURRENT_USER.nickname,
        level: CURRENT_USER.level,
        levelName: CURRENT_USER.levelName,
        xp: CURRENT_USER.xp,
        profileImage: null,
        bio: "김치를 사랑하는 요리 입문자입니다",
      },

      setProfileImage: (url) =>
        set((state) => ({
          profile: { ...state.profile, profileImage: url },
        })),

      updateNickname: (nickname) =>
        set((state) => ({
          profile: { ...state.profile, nickname },
        })),

      updateBio: (bio) =>
        set((state) => ({
          profile: { ...state.profile, bio },
        })),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.profile.xp + amount;
          // Simple level calculation (would be more complex in production)
          let newLevel = state.profile.level;
          let newLevelName = state.profile.levelName;

          if (newXp >= 50000) {
            newLevel = 7;
            newLevelName = "김치 명인";
          } else if (newXp >= 15000) {
            newLevel = 6;
            newLevelName = "김치 달인";
          } else if (newXp >= 5000) {
            newLevel = 5;
            newLevelName = "김치 장인";
          } else if (newXp >= 2000) {
            newLevel = 4;
            newLevelName = "김치 요리사";
          } else if (newXp >= 500) {
            newLevel = 3;
            newLevelName = "김치 수습생";
          } else if (newXp >= 100) {
            newLevel = 2;
            newLevelName = "김치 입문자";
          } else {
            newLevel = 1;
            newLevelName = "김치 새싹";
          }

          return {
            profile: {
              ...state.profile,
              xp: newXp,
              level: newLevel,
              levelName: newLevelName,
            },
          };
        }),
    }),
    {
      name: "kimchupa-user",
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
