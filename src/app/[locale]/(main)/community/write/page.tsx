"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ImageUpload from "@/components/ui/ImageUpload";
import { CURRENT_USER } from "@/constants/mockData";
import { usePostsStore } from "@/stores/postsStore";
import { toast } from "@/stores/toastStore";

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
}

type PostType = "recipe" | "free" | "qna" | "review" | "diary";

export default function WritePage() {
  const router = useRouter();
  const addPost = usePostsStore((state) => state.addPost);
  const [postType, setPostType] = useState<PostType>("free");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postTypes: { id: PostType; label: string; emoji: string; description: string; minLevel: number }[] = [
    { id: "free", label: "자유", emoji: "💬", description: "자유로운 이야기", minLevel: 3 },
    { id: "recipe", label: "레시피", emoji: "👨‍🍳", description: "김치 레시피 공유", minLevel: 3 },
    { id: "qna", label: "Q&A", emoji: "❓", description: "질문과 답변", minLevel: 2 },
    { id: "review", label: "리뷰", emoji: "⭐", description: "상품 리뷰", minLevel: 3 },
    { id: "diary", label: "김치일기", emoji: "📔", description: "발효 과정 기록", minLevel: 3 },
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

      const postId = addPost({
        type: postType,
        title: title.trim(),
        content: content.trim(),
        excerpt,
        tags,
        images: images.map((img) => img.url),
      });

      // XP reward based on post type
      const xpReward = postType === "recipe" ? 70 : postType === "diary" ? 15 : 20;
      toast.success("게시글 등록 완료!", "커뮤니티에 글이 등록되었습니다.");
      toast.xp(xpReward, postType === "recipe" ? "레시피 공유" : "게시글 작성");

      router.push(`/community/${postId}`);
    } catch {
      toast.error("등록 실패", "게시글 등록에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  const selectedType = postTypes.find((t) => t.id === postType);
  const canPost = CURRENT_USER.level >= (selectedType?.minLevel || 3);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={CURRENT_USER} />

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
                    const isAvailable = CURRENT_USER.level >= type.minLevel;
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
                <Link
                  href="/community"
                  className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  취소
                </Link>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-6 py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600"
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
                  현재 레벨: Lv.{CURRENT_USER.level}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
