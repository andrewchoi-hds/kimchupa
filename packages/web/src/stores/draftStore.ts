import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PostType = "recipe" | "free" | "qna" | "review" | "diary";

export interface PostDraft {
  type: PostType;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  savedAt: string;
}

interface DraftState {
  draft: PostDraft | null;

  // Actions
  saveDraft: (draft: Omit<PostDraft, "savedAt">) => void;
  clearDraft: () => void;
  hasDraft: () => boolean;
}

const DEFAULT_DRAFT: PostDraft = {
  type: "free",
  title: "",
  content: "",
  tags: [],
  images: [],
  savedAt: "",
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      draft: null,

      saveDraft: (draftData) => {
        // 내용이 있을 때만 저장
        if (draftData.title.trim() || draftData.content.trim()) {
          set({
            draft: {
              ...draftData,
              savedAt: new Date().toISOString(),
            },
          });
        }
      },

      clearDraft: () => {
        set({ draft: null });
      },

      hasDraft: () => {
        const draft = get().draft;
        return !!(draft && (draft.title.trim() || draft.content.trim()));
      },
    }),
    {
      name: "kimchupa-draft",
      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);
