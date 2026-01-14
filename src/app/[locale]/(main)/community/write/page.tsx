"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
      toast.error("로그인 필요", "글쓰기를 하려면 로그인이 필요합니다.");
      router.push("/login");
    }
  }, [status, router]);

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
      toast.success("복구 완료", "임시저장된 글을 불러왔습니다.");
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
    toast.success("임시저장 완료", "글이 임시저장되었습니다.");
  };

  const postTypes: { id: PostType; label: string; emoji: string; description: string; minLevel: number }[] = [
    { id: "free", label: "자유", emoji: "💬", description: "자유로운 이야기", minLevel: 1 },
    { id: "recipe", label: "레시피", emoji: "👨‍🍳", description: "김치 레시피 공유", minLevel: 2 },
    { id: "qna", label: "Q&A", emoji: "❓", description: "질문과 답변", minLevel: 1 },
    { id: "review", label: "리뷰", emoji: "⭐", description: "상품 리뷰", minLevel: 2 },
    { id: "diary", label: "김치일기", emoji: "📔", description: "발효 과정 기록", minLevel: 1 },
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

      toast.success("게시글 등록 완료!", "커뮤니티에 글이 등록되었습니다.");
      toast.xp(xpReward, postType === "recipe" ? "레시피 공유" : "게시글 작성");

      router.push(`/community/${postId}`);
    } catch {
      toast.error("등록 실패", "게시글 등록에 실패했습니다. 다시 시도해주세요.");
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
          <p className="text-zinc-600 dark:text-zinc-400">로딩 중...</p>
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
              <Link href="/" className="hover:text-purple-600">홈</Link>
              <span>/</span>
              <Link href="/community" className="hover:text-purple-600">커뮤니티</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">글쓰기</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              새 글 작성
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  게시판 선택
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
                  제목
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
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
                  내용
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
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
                  이미지 첨부 (선택)
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
                  태그 (최대 5개)
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
                    placeholder="태그 입력 후 Enter"
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
                    추가
                  </button>
                </div>
              </div>

              {/* XP Notice */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      게시글 작성 시 +20 XP 획득!
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {postType === "recipe" && "레시피 게시글은 +50 XP를 추가로 획득합니다"}
                      {postType === "diary" && "김치일기는 +15 XP를 획득합니다"}
                      {postType === "qna" && "질문은 +10 XP를 획득합니다"}
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
                    취소
                  </Link>
                  {lastSaved && (
                    <span className="text-xs text-zinc-500">
                      마지막 저장: {lastSaved}
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
                    임시저장
                  </button>
                  <button
                    type="submit"
                    disabled={!canPost || !title.trim() || !content.trim() || isSubmitting}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        등록 중...
                      </>
                    ) : (
                      "등록하기"
                    )}
                  </button>
                </div>
              </div>

              {!canPost && (
                <p className="text-center text-red-500 text-sm">
                  {selectedType?.label} 게시판은 Lv.{selectedType?.minLevel} 이상부터 작성 가능합니다.
                  현재 레벨: Lv.{profile.level}
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
                임시저장된 글이 있습니다
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                {new Date(draft.savedAt).toLocaleString("ko-KR")}에 저장됨
              </p>
              <p className="text-sm text-zinc-500 mb-6 line-clamp-2">
                {draft.title || "(제목 없음)"} - {draft.content.slice(0, 50) || "(내용 없음)"}...
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={ignoreDraft}
                  className="px-6 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  새로 작성
                </button>
                <button
                  onClick={restoreDraft}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  불러오기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
