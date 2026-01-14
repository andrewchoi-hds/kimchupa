"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePostsStore } from "@/stores/postsStore";
import { useUserStore } from "@/stores/userStore";
import { toast } from "@/stores/toastStore";

type PostType = "recipe" | "free" | "qna" | "review" | "diary";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile, initFromSession } = useUserStore();
  const { getPostById, updatePost } = usePostsStore();

  const post = getPostById(id);

  const [postType, setPostType] = useState<PostType>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 세션 변경 시 프로필 동기화
  useEffect(() => {
    initFromSession(session);
  }, [session, initFromSession]);

  // 게시글 데이터 로드
  useEffect(() => {
    if (post) {
      setPostType(post.type);
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags);
    }
  }, [post]);

  // 로그인 필요 및 권한 확인
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("로그인 필요", "수정하려면 로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 작성자 본인인지 확인
    if (status === "authenticated" && post && post.author.id !== profile.id) {
      toast.error("권한 없음", "본인이 작성한 글만 수정할 수 있습니다.");
      router.push(`/community/${id}`);
    }
  }, [status, post, profile.id, router, id]);

  const postTypes: { id: PostType; label: string; emoji: string }[] = [
    { id: "free", label: "자유", emoji: "💬" },
    { id: "recipe", label: "레시피", emoji: "👨‍🍳" },
    { id: "qna", label: "Q&A", emoji: "❓" },
    { id: "review", label: "리뷰", emoji: "⭐" },
    { id: "diary", label: "김치일기", emoji: "📔" },
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
      updatePost(id, {
        type: postType,
        title: title.trim(),
        content: content.trim(),
        tags,
      });

      toast.success("수정 완료!", "게시글이 수정되었습니다.");
      router.push(`/community/${id}`);
    } catch {
      toast.error("수정 실패", "게시글 수정에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  // Header에 전달할 사용자 정보
  const headerUser = session?.user
    ? {
        nickname: profile.nickname,
        level: profile.level,
        levelName: profile.levelName,
        xp: profile.xp,
        profileImage: profile.profileImage || undefined,
      }
    : null;

  // 로딩 중이거나 게시글이 없으면 로딩 표시
  if (status === "loading" || !post) {
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
              <Link href="/" className="hover:text-purple-600">
                홈
              </Link>
              <span>/</span>
              <Link href="/community" className="hover:text-purple-600">
                커뮤니티
              </Link>
              <span>/</span>
              <Link href={`/community/${id}`} className="hover:text-purple-600">
                게시글
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">수정</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              글 수정
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type Selection */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  게시판 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {postTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPostType(type.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        postType === type.id
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{type.emoji}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
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
                  <p className="text-xs text-zinc-500">{content.length}/5000</p>
                </div>
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

              {/* Submit */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/community/${id}`}
                  className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || isSubmitting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      수정 중...
                    </>
                  ) : (
                    "수정하기"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
