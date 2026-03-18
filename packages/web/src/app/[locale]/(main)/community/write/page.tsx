"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageUpload from "@/components/ui/ImageUpload";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { useCreatePost } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
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
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const profile = profileData?.data;
  const { mutateAsync: createPostAsync, isPending: isCreatePending } = useCreatePost();
  const { draft, saveDraft, clearDraft, hasDraft } = useDraftStore();
  const [postType, setPostType] = useState<PostType>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 로그인 필요 - 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error(t("toast.loginRequired"), t("toast.loginRequiredDesc"));
      router.push("/login");
    }
  }, [status, router, t]);

  // 임시저장된 글 확인 (마운트 시 한 번만)
  useEffect(() => {
    if (hasDraft()) {
      setShowDraftModal(true);
    }
  }, []);

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

    try {
      // Create excerpt from content
      const excerpt = content.slice(0, 100) + (content.length > 100 ? "..." : "");

      const result = await createPostAsync({
        type: postType,
        title: title.trim(),
        content: content.trim(),
        excerpt,
        tags,
        images: images.map((img) => img.url),
      });

      // 임시저장 삭제
      clearDraft();

      toast.success(t("toast.postCreated"), t("toast.postCreatedDesc"));

      const postId = result?.data?.id;
      router.push(postId ? `/community/${postId}` : "/community");
    } catch {
      toast.error(t("toast.postFailed"), t("toast.postFailedDesc"));
    }
  };

  const selectedType = postTypes.find((pt) => pt.id === postType);
  const canPost = (profile?.level ?? 1) >= (selectedType?.minLevel || 1);

  // Header에 전달할 사용자 정보
  const headerUser = session?.user && profile ? {
    nickname: profile.nickname,
    level: profile.level,
    levelName: profile.levelName,
    xp: profile.xp,
    profileImage: profile.profileImage || undefined,
  } : null;

  // 로딩 중이거나 비로그인 상태면 로딩 표시
  if (status === "loading" || status === "unauthenticated" || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={headerUser} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">{t("breadcrumb.home")}</Link>
              <span>/</span>
              <Link href="/community" className="hover:text-primary">{t("title")}</Link>
              <span>/</span>
              <span className="text-foreground">{t("write")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              {t("writePost")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <Card padding="lg">
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("form.selectBoard")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {postTypes.map((type) => {
                    const isAvailable = (profile?.level ?? 1) >= type.minLevel;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => isAvailable && setPostType(type.id)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-[var(--radius)] text-center transition-all ${
                          postType === type.id
                            ? "bg-primary text-white"
                            : isAvailable
                            ? "bg-muted text-foreground hover:bg-muted/80"
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
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
              </Card>

              {/* Title */}
              <Card padding="lg">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t("form.title")}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("form.titlePlaceholder")}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {title.length}/100
                </p>
              </Card>

              {/* Content */}
              <Card padding="lg">
                <label
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t("form.content")}
                </label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder={t("form.contentPlaceholder") + " (마크다운 지원)"}
                />
              </Card>

              {/* Image Upload */}
              <Card padding="lg">
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("form.imageUpload")}
                </label>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                  disabled={isCreatePending}
                />
              </Card>

              {/* Tags */}
              <Card padding="lg">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("form.tags")}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      variant="primary"
                      removable
                      onRemove={() => handleRemoveTag(tag)}
                    >
                      #{tag}
                    </Tag>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("form.tagPlaceholder")}
                    className="flex-1 px-4 py-2 bg-muted border border-border rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                    maxLength={20}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={tags.length >= 5 || !tagInput.trim()}
                  >
                    {t("form.addTag")}
                  </Button>
                </div>
              </Card>

              {/* XP Notice */}
              <Card padding="md" className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="font-medium text-foreground">
                      {t("xpNotice.title", { xp: 20 })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {postType === "recipe" && t("xpNotice.recipe")}
                      {postType === "diary" && t("xpNotice.diary")}
                      {postType === "qna" && t("xpNotice.qna")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Submit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/community">
                    <Button variant="ghost">
                      {tCommon("cancel")}
                    </Button>
                  </Link>
                  {lastSaved && (
                    <span className="text-xs text-muted-foreground">
                      {t("form.lastSaved", { time: lastSaved })}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleManualSave}
                    disabled={!title.trim() && !content.trim()}
                  >
                    {t("form.saveDraft")}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isCreatePending}
                    disabled={!canPost || !title.trim() || !content.trim() || isCreatePending}
                  >
                    {isCreatePending ? t("form.submitting") : t("form.submit")}
                  </Button>
                </div>
              </div>

              {!canPost && selectedType && (
                <p className="text-center text-error text-sm">
                  {t("form.levelRequiredBoard", { board: selectedType.label, level: selectedType.minLevel, currentLevel: profile?.level ?? 1 })}
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
          <Card padding="lg" className="max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <span className="text-5xl block mb-4">📝</span>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t("draft.title")}
              </h3>
              <p className="text-muted-foreground mb-2">
                {t("draft.savedAt", { time: new Date(draft.savedAt).toLocaleString() })}
              </p>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {draft.title || t("draft.noTitle")} - {draft.content.slice(0, 50) || t("draft.noContent")}...
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={ignoreDraft}>
                  {t("draft.writeNew")}
                </Button>
                <Button variant="primary" onClick={restoreDraft}>
                  {t("draft.restore")}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
