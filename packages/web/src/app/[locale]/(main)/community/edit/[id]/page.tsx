"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { usePost, useUpdatePost } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/stores/toastStore";

type PostType = "recipe" | "free" | "qna" | "review" | "diary";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const t = useTranslations("community");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const { data: postData, isLoading: isPostLoading } = usePost(id);
  const post = postData?.data;
  const { mutateAsync: updatePostAsync, isPending: isUpdatePending } = useUpdatePost();

  // 게시글 데이터로 초기값 설정
  const [postType, setPostType] = useState<PostType>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [initialized, setInitialized] = useState(false);

  // 게시글 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (post && !initialized) {
      setPostType(post.type || "free");
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags || []);
      setInitialized(true);
    }
  }, [post, initialized]);

  // 로그인 필요 및 권한 확인
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error(t("toast.loginRequired"), t("toast.editLoginRequiredDesc"));
      router.push("/login");
      return;
    }

    // 작성자 본인인지 확인
    if (status === "authenticated" && post && profile && post.author.id !== profile.id) {
      toast.error(t("toast.noPermission"), t("toast.noPermissionDesc"));
      router.push(`/community/${id}`);
    }
  }, [status, post, profile, router, id, t]);

  const postTypes: { id: PostType; label: string; emoji: string }[] = [
    { id: "free", label: t("boards.free"), emoji: "💬" },
    { id: "recipe", label: t("boards.recipe"), emoji: "👨‍🍳" },
    { id: "qna", label: t("boards.qna"), emoji: "❓" },
    { id: "review", label: t("boards.review"), emoji: "⭐" },
    { id: "diary", label: t("boards.diary"), emoji: "📔" },
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
      await updatePostAsync({
        id,
        title: title.trim(),
        content: content.trim(),
        tags,
      });

      toast.success(t("toast.editSuccess"), t("toast.editSuccessDesc"));
      router.push(`/community/${id}`);
    } catch {
      toast.error(t("toast.editFailed"), t("toast.editFailedDesc"));
    }
  };

  // Header에 전달할 사용자 정보
  const headerUser = session?.user && profile
    ? {
        nickname: profile.nickname,
        level: profile.level,
        levelName: profile.levelName,
        xp: profile.xp,
        profileImage: profile.profileImage || undefined,
      }
    : null;

  // 로딩 중이거나 게시글이 없으면 로딩 표시
  if (status === "loading" || isPostLoading || !post) {
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
              <Link href="/" className="hover:text-primary">
                {t("breadcrumb.home")}
              </Link>
              <span>/</span>
              <Link href="/community" className="hover:text-primary">
                {t("title")}
              </Link>
              <span>/</span>
              <Link href={`/community/${id}`} className="hover:text-primary">
                {t("breadcrumb.post")}
              </Link>
              <span>/</span>
              <span className="text-foreground">{t("breadcrumb.edit")}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              {t("editPost")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <Card padding="lg">
                <label className="block text-sm font-medium text-foreground mb-3">
                  {t("form.selectBoard")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPostType(type.id)}
                      className={`p-3 rounded-[var(--radius)] text-center transition-all ${
                        postType === type.id
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{type.emoji}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
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

              {/* Submit */}
              <div className="flex items-center justify-between">
                <Link href={`/community/${id}`}>
                  <Button variant="ghost">
                    {tCommon("cancel")}
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isUpdatePending}
                  disabled={!title.trim() || !content.trim() || isUpdatePending}
                >
                  {isUpdatePending ? t("form.updating") : t("form.update")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
