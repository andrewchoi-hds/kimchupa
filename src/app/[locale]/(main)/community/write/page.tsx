"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageUpload from "@/components/ui/ImageUpload";
import { usePostsStore } from "@/stores/postsStore";
import { useUserStore } from "@/stores/userStore";
import { useDraftStore } from "@/stores/draftStore";
import { toast } from "@/stores/toastStore";

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
}

type PostType = "recipe" | "free" | "qna" | "review" | "diary";

export default function WritePage() {
  const t = useTranslations("community");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile, initFromSession, addXp } = useUserStore();
  const addPost = usePostsStore((state) => state.addPost);
  const { draft, saveDraft, clearDraft, hasDraft } = useDraftStore();
  const [postType, setPostType] = useState<PostType>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedDraft = useRef(false);

  // 세션 변경 시 프로필 동기화
  useEffect(() => {
    initFromSession(session);
  }, [session, initFromSession]);

  // 로그인 필요 - 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error(t("toast.loginRequired"), t("toast.loginRequiredDesc"));
      router.push("/login");
    }
  }, [status, router, t]);

  // 임시저장된 글 확인 (페이지 로드 시 한 번만)
  useEffect(() => {
    if (!hasCheckedDraft.current && hasDraft()) {
      hasCheckedDraft.current = true;
      setShowDraftModal(true);
    }
  }, [hasDraft]);

  // 자동 저장 함수
  const performAutoSave = useCallback(() => {
    if (title.trim() || content.trim()) {
      saveDraft({
        type: postType,
        title,
        content,
        tags,
        images: images.map((img) => img.url),
      });
      setLastSaved(new Date().toLocaleTimeString("ko-KR"));
    }
  }, [postType, title, content, tags, images, saveDraft]);

  // 자동 저장 (30초마다)
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setInterval(() => {
      performAutoSave();
    }, 30000); // 30초마다 자동 저장

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [performAutoSave]);

  // 임시저장 복구
  const restoreDraft = () => {
    if (draft) {
      setPostType(draft.type);
      setTitle(draft.title);
      setContent(draft.content);
      setTags(draft.tags);
      // 이미지는 URL만 있으므로 복구 시 간단한 형태로
      setImages(draft.images.map((url) => ({ url, filename: "", size: 0 })));
      toast.success(t("toast.draftRestored"), t("toast.draftRestoredDesc"));
    }
    setShowDraftModal(false);
  };

  // 임시저장 무시
  const ignoreDraft = () => {
    clearDraft();
    setShowDraftModal(false);
  };

  // 수동 임시저장
  const handleManualSave = () => {
    performAutoSave();
    toast.success(t("toast.draftSaved"), t("toast.draftSavedDesc"));
  };

  const postTypes: { id: PostType; label: string; emoji: string; description: string; minLevel: number }[] = [
    { id: "free", label: t("boards.free"), emoji: "💬", description: t("boardDesc.free"), minLevel: 1 },
    { id: "recipe", label: t("boards.recipe"), emoji: "👨‍🍳", description: t("boardDesc.recipe"), minLevel: 2 },
    { id: "qna", label: t("boards.qna"), emoji: "❓", description: t("boardDesc.qna"), minLevel: 1 },
    { id: "review", label: t("boards.review"), emoji: "⭐", description: t("boardDesc.review"), minLevel: 2 },
    { id: "diary", label: t("boards.diary"), emoji: "📔", description: t("boardDesc.diary"), minLevel: 1 },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      // Create excerpt from content
      const excerpt = content.slice(0, 100) + (content.length > 100 ? "..." : "");

      // 현재 사용자 정보를 author로 전달
      const author = {
        id: profile.id,
        nickname: profile.nickname,
        level: profile.level,
        levelName: profile.levelName,
        xp: profile.xp,
      };

      const postId = addPost({
        type: postType,
        title: title.trim(),
        content: content.trim(),
        excerpt,
        tags,
        images: images.map((img) => img.url),
      }, author);

      // XP reward based on post type
      const xpReward = postType === "recipe" ? 70 : postType === "diary" ? 15 : 20;
      addXp(xpReward);

      // 임시저장 삭제
      clearDraft();

      toast.success(t("toast.postCreated"), t("toast.postCreatedDesc"));
      toast.xp(xpReward, postType === "recipe" ? t("toast.recipeShared") : t("toast.postWritten"));

      router.push(`/community/${postId}`);
    } catch {
      toast.error(t("toast.postFailed"), t("toast.postFailedDesc"));
      setIsSubmitting(false);
    }
  };

  const selectedType = postTypes.find((t) => t.id === postType);
  const canPost = profile.level >= (selectedType?.minLevel || 1);

  // Header에 전달할 사용자 정보
  const headerUser = session?.user ? {
    nickname: profile.nickname,
    level: profile.level,
    levelName: profile.levelName,
    xp: profile.xp,
    profileImage: profile.profileImage || undefined,
  } : null;

  // 로딩 중이거나 비로그인 상태면 로딩 표시
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={headerUser} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-purple-600">{t("breadcrumb.home")}</Link>
              <span>/</span>
              <Link href="/community" className="hover:text-purple-600">{t("title")}</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">{t("write")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              {t("writePost")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  {t("form.selectBoard")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {postTypes.map((type) => {
                    const isAvailable = profile.level >= type.minLevel;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => isAvailable && setPostType(type.id)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-xl text-center transition-all ${
                          postType === type.id
                            ? "bg-purple-600 text-white"
                            : isAvailable
                            ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{type.emoji}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                        {!isAvailable && (
                          <span className="text-xs block mt-1">Lv.{type.minLevel}+</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  {t("form.title")}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("form.titlePlaceholder")}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-zinc-500 mt-1 text-right">
                  {title.length}/100
                </p>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  {t("form.content")}
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("form.contentPlaceholder")}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={15}
                  required
                />
                <div className="flex items-center justify-end mt-2">
                  <p className="text-xs text-zinc-500">
                    {content.length}/5000
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  {t("form.imageUpload")}
                </label>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                  disabled={isSubmitting}
                />
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {t("form.tags")}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("form.tagPlaceholder")}
                    className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={20}
                    disabled={tags.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={tags.length >= 5 || !tagInput.trim()}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50"
                  >
                    {t("form.addTag")}
                  </button>
                </div>
              </div>

              {/* XP Notice */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {t("xpNotice.title", { xp: 20 })}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {postType === "recipe" && t("xpNotice.recipe")}
                      {postType === "diary" && t("xpNotice.diary")}
                      {postType === "qna" && t("xpNotice.qna")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href="/community"
                    className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    {tCommon("cancel")}
                  </Link>
                  {lastSaved && (
                    <span className="text-xs text-zinc-500">
                      {t("form.lastSaved", { time: lastSaved })}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleManualSave}
                    disabled={!title.trim() && !content.trim()}
                    className="px-6 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 disabled:opacity-50"
                  >
                    {t("form.saveDraft")}
                  </button>
                  <button
                    type="submit"
                    disabled={!canPost || !title.trim() || !content.trim() || isSubmitting}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        {t("form.submitting")}
                      </>
                    ) : (
                      t("form.submit")
                    )}
                  </button>
                </div>
              </div>

              {!canPost && selectedType && (
                <p className="text-center text-red-500 text-sm">
                  {t("form.levelRequiredBoard", { board: selectedType.label, level: selectedType.minLevel, currentLevel: profile.level })}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Draft Recovery Modal */}
      {showDraftModal && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <span className="text-5xl block mb-4">📝</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {t("draft.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                {t("draft.savedAt", { time: new Date(draft.savedAt).toLocaleString() })}
              </p>
              <p className="text-sm text-zinc-500 mb-6 line-clamp-2">
                {draft.title || t("draft.noTitle")} - {draft.content.slice(0, 50) || t("draft.noContent")}...
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={ignoreDraft}
                  className="px-6 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  {t("draft.writeNew")}
                </button>
                <button
                  onClick={restoreDraft}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t("draft.restore")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
