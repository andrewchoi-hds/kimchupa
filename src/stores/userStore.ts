import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserByEmail } from "./authStore";
import { toast } from "./toastStore";
import { USER_LEVELS } from "@/constants/levels";

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage: string | null;
  bio: string;
}

interface UserState {
  profile: UserProfile;
  isInitialized: boolean;

  // Actions
  setProfileImage: (url: string | null) => void;
  updateNickname: (nickname: string) => void;
  updateBio: (bio: string) => void;
  addXp: (amount: number) => void;
  initFromSession: (session: { user?: { id?: string; email?: string | null; name?: string | null } } | null) => void;
  syncFromAuthStore: (email: string) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: "",
  email: "",
  nickname: "게스트",
  level: 1,
  levelName: "김치 새싹",
  xp: 0,
  profileImage: null,
  bio: "김치를 사랑하는 요리 입문자입니다",
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: { ...DEFAULT_PROFILE },
      isInitialized: false,

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

      addXp: (amount) => {
        const currentState = get();
        const oldLevel = currentState.profile.level;
        const newXp = currentState.profile.xp + amount;

        // 레벨 계산 (USER_LEVELS 사용)
        let newLevel = 1;
        let newLevelName = "김치 새싹";

        for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
          if (newXp >= USER_LEVELS[i].minXp) {
            newLevel = USER_LEVELS[i].level;
            newLevelName = USER_LEVELS[i].name;
            break;
          }
        }

        // 상태 업데이트
        set({
          profile: {
            ...currentState.profile,
            xp: newXp,
            level: newLevel,
            levelName: newLevelName,
          },
        });

        // 레벨업 시 알림 표시
        if (newLevel > oldLevel) {
          toast.levelUp(newLevel, newLevelName);

          // 레벨업에 따른 새 권한 안내
          const levelInfo = USER_LEVELS.find((l) => l.level === newLevel);
          const prevLevelInfo = USER_LEVELS.find((l) => l.level === oldLevel);

          if (levelInfo && prevLevelInfo) {
            // 새로 얻은 권한 확인
            if (levelInfo.permissions.canPost && !prevLevelInfo.permissions.canPost) {
              setTimeout(() => toast.success("새 기능 해금", "게시글 작성이 가능해졌습니다!"), 1500);
            }
            if (levelInfo.permissions.canComment && !prevLevelInfo.permissions.canComment) {
              setTimeout(() => toast.success("새 기능 해금", "댓글 작성이 가능해졌습니다!"), 1500);
            }
            if (levelInfo.permissions.canSuggestWikiEdit && !prevLevelInfo.permissions.canSuggestWikiEdit) {
              setTimeout(() => toast.success("새 기능 해금", "위키 편집 제안이 가능해졌습니다!"), 1500);
            }
            if (levelInfo.permissions.canEditWiki && !prevLevelInfo.permissions.canEditWiki) {
              setTimeout(() => toast.success("새 기능 해금", "위키 직접 편집이 가능해졌습니다!"), 1500);
            }
          }
        }
      },

      // 세션으로부터 프로필 초기화
      initFromSession: (session) => {
        const email = session?.user?.email;

        if (!email) {
          // 로그아웃 상태
          set({
            profile: { ...DEFAULT_PROFILE },
            isInitialized: true,
          });
          return;
        }

        const currentProfile = get().profile;

        // 이미 같은 사용자로 초기화되어 있으면 스킵
        if (currentProfile.email === email && get().isInitialized) {
          return;
        }

        // authStore에서 사용자 정보 조회
        const storedUser = getUserByEmail(email);

        if (storedUser) {
          // 등록된 사용자: authStore 정보 사용
          set({
            profile: {
              id: storedUser.id,
              email: storedUser.email,
              nickname: storedUser.nickname,
              level: storedUser.level,
              levelName: storedUser.levelName,
              xp: storedUser.xp,
              profileImage: storedUser.profileImage,
              bio: currentProfile.bio || "김치를 사랑하는 요리 입문자입니다",
            },
            isInitialized: true,
          });
        } else {
          // 미등록 사용자 (소셜 로그인 등): 세션 정보로 초기화
          const name = session?.user?.name;
          set({
            profile: {
              id: session?.user?.id || `user_${Date.now()}`,
              email: email,
              nickname: name || email.split("@")[0],
              level: 1,
              levelName: "김치 새싹",
              xp: 0,
              profileImage: null,
              bio: "김치를 사랑하는 요리 입문자입니다",
            },
            isInitialized: true,
          });
        }
      },

      // authStore에서 최신 정보 동기화
      syncFromAuthStore: (email) => {
        const storedUser = getUserByEmail(email);
        if (storedUser) {
          set((state) => ({
            profile: {
              ...state.profile,
              level: storedUser.level,
              levelName: storedUser.levelName,
              xp: storedUser.xp,
            },
          }));
        }
      },

      // 프로필 초기화 (로그아웃 시)
      reset: () =>
        set({
          profile: { ...DEFAULT_PROFILE },
          isInitialized: false,
        }),
    }),
    {
      name: "kimchupa-user",
      partialize: (state) => ({
        profile: state.profile,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// 편의를 위한 타입 export
export type { UserProfile };
